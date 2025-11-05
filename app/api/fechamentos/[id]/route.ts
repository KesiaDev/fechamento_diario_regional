import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    console.log('🔄 API PUT - Atualizando registro:', id)
    
    const { gerenteEstadual, executivo, agencia, porteAgencia, gerentePJ, qtdVisitas, qtdInteracoes, qtdBraExpre, data, credenciamentos, cnpjsSimulados } = body
    
    console.log('📝 Dados recebidos:', { executivo, agencia, qtdVisitas, qtdInteracoes, qtdBraExpre, data })

    // Validação básica
    if (!executivo || !agencia || qtdVisitas === undefined || qtdInteracoes === undefined || qtdBraExpre === undefined) {
      return NextResponse.json(
        { error: 'Todos os campos principais são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o fechamento existe
    const fechamentoExistente = await prisma.fechamento.findUnique({
      where: { id },
      include: {
        credenciamentos: true,
        cnpjsSimulados: true
      }
    })

    if (!fechamentoExistente) {
      return NextResponse.json(
        { error: 'Fechamento não encontrado' },
        { status: 404 }
      )
    }

    // Filtrar credenciamentos válidos (que têm pelo menos EC e volumeRS preenchidos)
    const credenciamentosValidos = (credenciamentos || []).filter((cred: any) => 
      cred && cred.ec && cred.volumeRS && cred.ec.toString().trim() !== '' && cred.volumeRS.toString().trim() !== ''
    )

    console.log('Credenciamentos válidos:', credenciamentosValidos.length)

    // Filtrar CNPJs simulados válidos e remover duplicatas
    const cnpjsFiltrados = (cnpjsSimulados || []).filter((cnpj: any) => {
      if (!cnpj || !cnpj.cnpj || !cnpj.nomeEmpresa || cnpj.faturamento === undefined || cnpj.faturamento === null) {
        return false
      }
      const cnpjStr = cnpj.cnpj.toString().trim()
      const nomeStr = cnpj.nomeEmpresa.toString().trim()
      if (cnpjStr === '' || nomeStr === '') {
        return false
      }
      // Verificar se faturamento é um número válido
      const faturamentoNum = typeof cnpj.faturamento === 'string' 
        ? parseFloat(cnpj.faturamento.replace(/[^\d,.-]/g, '').replace(',', '.'))
        : parseFloat(cnpj.faturamento)
      return !isNaN(faturamentoNum) && isFinite(faturamentoNum)
    })

    // Remover CNPJs duplicados no mesmo fechamento (mesmo CNPJ não pode aparecer duas vezes)
    const cnpjsUnicos = new Map<string, any>()
    cnpjsFiltrados.forEach((cnpj: any) => {
      const cnpjStr = cnpj.cnpj.toString().trim()
      // Se já existe, manter o primeiro (ou pode escolher o último)
      if (!cnpjsUnicos.has(cnpjStr)) {
        cnpjsUnicos.set(cnpjStr, cnpj)
      }
    })
    const cnpjsValidos = Array.from(cnpjsUnicos.values())

    console.log('CNPJs válidos (atualização):', cnpjsValidos.length)
    console.log('CNPJs únicos (sem duplicatas):', cnpjsValidos.map(c => c.cnpj))

    // Atualizar fechamento com credenciamentos e CNPJs simulados usando transação
    const fechamento = await prisma.$transaction(async (tx) => {
      return await tx.fechamento.update({
        where: { id },
        data: {
          gerenteEstadual: gerenteEstadual || fechamentoExistente.gerenteEstadual,
          executivo,
          agencia,
          porteAgencia: porteAgencia || null,
          gerentePJ: gerentePJ || null,
          qtdVisitas: parseInt(qtdVisitas),
          qtdInteracoes: parseInt(qtdInteracoes),
          qtdBraExpre: parseInt(qtdBraExpre),
          data: data ? new Date(data + 'T12:00:00') : fechamentoExistente.data,
          credenciamentos: {
            deleteMany: {},
            create: credenciamentosValidos.map((cred: any) => ({
              qtdCredenciamentos: 1, // Cada credenciamento adicionado = 1 credenciamento
              ativacoesValor: 0, // Campo removido, sempre 0
              ec: cred.ec,
              volumeRS: parseFloat(cred.volumeRS),
              ra: cred.ra === 'true' || cred.ra === true || cred.ra === 'True' || cred.ra === 'TRUE',
              cesta: cred.cesta,
              instalaDireto: cred.instalaDireto === 'true' || cred.instalaDireto === true || cred.instalaDireto === 'True' || cred.instalaDireto === 'TRUE',
              nomeGerentePJ: cred.nomeGerentePJ || null,
            }))
          },
          cnpjsSimulados: {
            deleteMany: {},
            create: cnpjsValidos.length > 0 ? cnpjsValidos.map((cnpj: any) => {
              // Função auxiliar para converter string de moeda para número
              const parseFaturamento = (value: any): number => {
                if (typeof value === 'number') return value
                if (typeof value === 'string') {
                  // Remove caracteres não numéricos exceto ponto e vírgula
                  const cleaned = value.replace(/[^\d,.-]/g, '').replace(',', '.')
                  const parsed = parseFloat(cleaned)
                  return isNaN(parsed) ? 0 : parsed
                }
                return 0
              }
              const faturamento = parseFaturamento(cnpj.faturamento)
              return {
                cnpj: cnpj.cnpj.toString().trim(),
                nomeEmpresa: cnpj.nomeEmpresa.toString().trim(),
                faturamento,
                comentarios: cnpj.comentarios || null,
                agenciaSimulacao: cnpj.agenciaSimulacao || null,
                pjIndicou: cnpj.pjIndicou || null,
              }
            }) : []
          }
        },
        include: {
          credenciamentos: true,
          cnpjsSimulados: true
        }
      })
    })

    // Garantir que credenciamentos e cnpjsSimulados sejam arrays válidos e serializar datas corretamente
    const fechamentoFormatado = {
      ...fechamento,
      data: fechamento.data.toISOString(),
      createdAt: fechamento.createdAt.toISOString(),
      updatedAt: fechamento.updatedAt.toISOString(),
      credenciamentos: Array.isArray(fechamento.credenciamentos) ? fechamento.credenciamentos.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString()
      })) : [],
      cnpjsSimulados: Array.isArray(fechamento.cnpjsSimulados) ? fechamento.cnpjsSimulados.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString()
      })) : []
    }

    return NextResponse.json(fechamentoFormatado, { status: 200 })
  } catch (error) {
    console.error('Erro ao atualizar fechamento:', error)
    console.error('Erro completo:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'Erro ao atualizar fechamento', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Verificar se o fechamento existe
    const fechamento = await prisma.fechamento.findUnique({
      where: { id },
      include: {
        credenciamentos: true,
        cnpjsSimulados: true
      }
    })

    if (!fechamento) {
      return NextResponse.json(
        { error: 'Fechamento não encontrado' },
        { status: 404 }
      )
    }

    // Excluir o fechamento (os credenciamentos e CNPJs serão excluídos automaticamente devido ao onDelete: Cascade)
    await prisma.fechamento.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Fechamento excluído com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao excluir fechamento:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir fechamento' },
      { status: 500 }
    )
  }
}
