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
    const cnpjsValidos = (cnpjsSimulados || []).filter((cnpj: any) =>
      cnpj && cnpj.cnpj && cnpj.nomeEmpresa && cnpj.faturamento &&
      cnpj.cnpj.toString().trim() !== '' && cnpj.nomeEmpresa.toString().trim() !== ''
    )

    // Usar transação para garantir que tudo seja salvo ou nada seja salvo
    const fechamento = await prisma.$transaction(async (tx) => {
      return await tx.fechamento.create({
        data: {
          gerenteEstadual,
          executivo,
          agencia,
          porteAgencia: porteAgencia || null,
          gerentePJ: gerentePJ || null,
          qtdVisitas: parseInt(qtdVisitas),
          qtdInteracoes: parseInt(qtdInteracoes),
          qtdBraExpre: parseInt(qtdBraExpre),
          data: dataFechamento,
          credenciamentos: {
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
            create: cnpjsValidos.map((cnpj: any) => ({
              cnpj: cnpj.cnpj,
              nomeEmpresa: cnpj.nomeEmpresa,
              faturamento: parseFloat(cnpj.faturamento),
              comentarios: cnpj.comentarios || null,
              agenciaSimulacao: cnpj.agenciaSimulacao || null,
              pjIndicou: cnpj.pjIndicou || null,
            }))
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
    console.error('Erro ao criar fechamento:', error)
    console.error('Erro completo:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'Erro ao salvar fechamento', details: error instanceof Error ? error.message : 'Erro desconhecido' },
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

