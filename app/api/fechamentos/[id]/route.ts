import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    console.log('🔄 API PUT - Atualizando registro:', id)
    
    const { executivo, agencia, qtdVisitas, qtdInteracoes, qtdBraExpre, data, credenciamentos, cnpjsSimulados } = body
    
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

    // Atualizar fechamento com credenciamentos e CNPJs simulados
    const fechamento = await prisma.fechamento.update({
      where: { id },
      data: {
        executivo,
        agencia,
        qtdVisitas: parseInt(qtdVisitas),
        qtdInteracoes: parseInt(qtdInteracoes),
        qtdBraExpre: parseInt(qtdBraExpre),
        data: data ? new Date(data) : fechamentoExistente.data,
        credenciamentos: {
          deleteMany: {},
          create: (credenciamentos || []).map((cred: any) => ({
            qtdCredenciamentos: parseInt(cred.qtdCredenciamentos),
            ativacoesValor: 0, // Campo removido, sempre 0
            ec: cred.ec,
            volumeRS: parseFloat(cred.volumeRS),
            ra: cred.ra === 'true' || cred.ra === true,
            cesta: cred.cesta,
            instalaDireto: cred.instalaDireto === 'true' || cred.instalaDireto === true,
            nomeGerentePJ: cred.nomeGerentePJ || null,
          }))
        },
        cnpjsSimulados: {
          deleteMany: {},
          create: (cnpjsSimulados || []).map((cnpj: any) => ({
            cnpj: cnpj.cnpj,
            nomeEmpresa: cnpj.nomeEmpresa,
            faturamento: parseFloat(cnpj.faturamento),
            comentarios: cnpj.comentarios || null,
          }))
        }
      },
      include: {
        credenciamentos: true,
        cnpjsSimulados: true
      }
    })

    return NextResponse.json(fechamento, { status: 200 })
  } catch (error) {
    console.error('Erro ao atualizar fechamento:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar fechamento' },
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
