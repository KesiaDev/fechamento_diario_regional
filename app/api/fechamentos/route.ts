import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
        const { gerenteEstadual, executivo, agencia, porteAgencia, gerentePJ, qtdVisitas, qtdInteracoes, qtdBraExpre, data, credenciamentos, cnpjsSimulados } = body

    // Validação básica
    if (!gerenteEstadual || !executivo || !agencia || qtdVisitas === undefined || qtdInteracoes === undefined || qtdBraExpre === undefined) {
      return NextResponse.json(
        { error: 'Todos os campos principais são obrigatórios' },
        { status: 400 }
      )
    }

    // Criar fechamento com credenciamentos
    const dataFechamento = data ? new Date(data + 'T12:00:00') : new Date(new Date().toISOString().split('T')[0] + 'T12:00:00')
    
    console.log('Criando fechamento com data:', dataFechamento)
    console.log('Data original:', data)
    console.log('Executivo:', executivo)
    console.log('Credenciamentos recebidos:', credenciamentos)

    // Filtrar credenciamentos válidos (que têm pelo menos EC e volumeRS preenchidos)
    const credenciamentosValidos = (credenciamentos || []).filter((cred: any) => 
      cred && cred.ec && cred.volumeRS && cred.ec.toString().trim() !== '' && cred.volumeRS.toString().trim() !== ''
    )

    console.log('Credenciamentos válidos:', credenciamentosValidos.length)

    // Filtrar CNPJs simulados válidos
    const cnpjsValidos = (cnpjsSimulados || []).filter((cnpj: any) => {
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

    console.log('CNPJs válidos:', cnpjsValidos.length)
    console.log('CNPJs recebidos:', cnpjsSimulados?.length || 0)

    // Usar transação para garantir que tudo seja salvo ou nada seja salvo
    const fechamento = await prisma.$transaction(async (tx) => {
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

      return await tx.fechamento.create({
        data: {
          gerenteEstadual,
          executivo,
          agencia,
          porteAgencia: porteAgencia || null,
          gerentePJ: gerentePJ || null,
          qtdVisitas: parseInt(qtdVisitas) || 0,
          qtdInteracoes: parseInt(qtdInteracoes) || 0,
          qtdBraExpre: parseInt(qtdBraExpre) || 0,
          data: dataFechamento,
          credenciamentos: {
            create: credenciamentosValidos.length > 0 ? credenciamentosValidos.map((cred: any) => ({
              qtdCredenciamentos: 1, // Cada credenciamento adicionado = 1 credenciamento
              ativacoesValor: 0, // Campo removido, sempre 0
              ec: cred.ec.toString().trim(),
              volumeRS: parseFloat(cred.volumeRS) || 0,
              ra: cred.ra === 'true' || cred.ra === true || cred.ra === 'True' || cred.ra === 'TRUE',
              cesta: cred.cesta || '',
              instalaDireto: cred.instalaDireto === 'true' || cred.instalaDireto === true || cred.instalaDireto === 'True' || cred.instalaDireto === 'TRUE',
              nomeGerentePJ: cred.nomeGerentePJ || null,
            })) : []
          },
          cnpjsSimulados: {
            create: cnpjsValidos.length > 0 ? cnpjsValidos.map((cnpj: any) => {
              const faturamento = parseFaturamento(cnpj.faturamento)
              console.log('Processando CNPJ:', cnpj.cnpj, 'Faturamento:', faturamento)
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

    return NextResponse.json(fechamentoFormatado, { status: 201 })
  } catch (error) {
    console.error('❌ Erro ao criar fechamento:', error)
    console.error('❌ Erro completo:', JSON.stringify(error, null, 2))
    
    // Log detalhado do erro
    if (error instanceof Error) {
      console.error('❌ Mensagem de erro:', error.message)
      console.error('❌ Stack trace:', error.stack)
    }
    
    // Se for erro do Prisma, logar mais detalhes
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('❌ Código do erro Prisma:', (error as any).code)
      console.error('❌ Meta do erro:', (error as any).meta)
    }
    
    return NextResponse.json(
      { 
        error: 'Erro ao salvar fechamento', 
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filtro = searchParams.get('filtro') || 'dia'
    const dataParam = searchParams.get('data')
    const gerenteEstadual = searchParams.get('gerenteEstadual')
    
    const dataReferencia = dataParam ? new Date(dataParam + 'T12:00:00') : new Date(new Date().toISOString().split('T')[0] + 'T12:00:00')
    
    let startDate: Date
    let endDate: Date
    
    switch (filtro) {
      case 'semana':
        startDate = startOfWeek(dataReferencia, { weekStartsOn: 0 })
        endDate = endOfWeek(dataReferencia, { weekStartsOn: 0 })
        break
      case 'mes':
        startDate = startOfMonth(dataReferencia)
        endDate = endOfMonth(dataReferencia)
        break
      case 'dia':
      default:
        startDate = startOfDay(dataReferencia)
        endDate = endOfDay(dataReferencia)
        break
    }

    // Debug: log das datas para verificar
    console.log('Data referência:', dataReferencia)
    console.log('Start date:', startDate)
    console.log('End date:', endDate)
    console.log('Filtro:', filtro)

    // Primeiro, vamos buscar todos os fechamentos para debug
    const todosFechamentos = await prisma.fechamento.findMany({
      include: {
        credenciamentos: true,
        cnpjsSimulados: true
      },
      orderBy: [
        { data: 'desc' }
      ]
    })

    console.log('Todos os fechamentos no banco:', todosFechamentos.map(f => ({ 
      id: f.id, 
      data: f.data, 
      executivo: f.executivo,
      dataISO: f.data.toISOString()
    })))

    const fechamentos = await prisma.fechamento.findMany({
      where: {
        data: {
          gte: startDate,
          lte: endDate
        },
        ...(gerenteEstadual ? { gerenteEstadual } : {})
      },
      include: {
        credenciamentos: true,
        cnpjsSimulados: true
      },
      orderBy: [
        { data: 'desc' }
      ]
    })

    console.log('Fechamentos encontrados:', fechamentos.length)
    console.log('Fechamentos:', fechamentos.map(f => ({ id: f.id, data: f.data, executivo: f.executivo })))

    // Garantir que credenciamentos e cnpjsSimulados sejam arrays válidos e serializar datas corretamente
    const fechamentosFormatados = fechamentos.map(f => ({
      ...f,
      data: f.data.toISOString(),
      createdAt: f.createdAt.toISOString(),
      updatedAt: f.updatedAt.toISOString(),
      credenciamentos: Array.isArray(f.credenciamentos) ? f.credenciamentos.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString()
      })) : [],
      cnpjsSimulados: Array.isArray(f.cnpjsSimulados) ? f.cnpjsSimulados.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString()
      })) : []
    }))

    return NextResponse.json(fechamentosFormatados)
  } catch (error) {
    console.error('Erro ao buscar fechamentos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar fechamentos' },
      { status: 500 }
    )
  }
}

