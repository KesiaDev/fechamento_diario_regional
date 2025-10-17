import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
        const { executivo, agencia, qtdVisitas, qtdInteracoes, qtdBraExpre, data, credenciamentos, cnpjsSimulados } = body

    // Validação básica
    if (!executivo || !agencia || qtdVisitas === undefined || qtdInteracoes === undefined || qtdBraExpre === undefined) {
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

    const fechamento = await prisma.fechamento.create({
      data: {
        executivo,
        agencia,
        qtdVisitas: parseInt(qtdVisitas),
        qtdInteracoes: parseInt(qtdInteracoes),
        qtdBraExpre: parseInt(qtdBraExpre),
        data: dataFechamento,
        credenciamentos: {
          create: (credenciamentos || []).map((cred: any) => ({
            qtdCredenciamentos: 1, // Cada credenciamento adicionado = 1 credenciamento
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

    return NextResponse.json(fechamento, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar fechamento:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar fechamento' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filtro = searchParams.get('filtro') || 'dia'
    const dataParam = searchParams.get('data')
    
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

    const fechamentos = await prisma.fechamento.findMany({
      where: {
        data: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        credenciamentos: true,
        cnpjsSimulados: true
      },
      orderBy: {
        data: 'desc'
      }
    })

    console.log('Fechamentos encontrados:', fechamentos.length)
    console.log('Fechamentos:', fechamentos.map(f => ({ id: f.id, data: f.data, executivo: f.executivo })))

    return NextResponse.json(fechamentos)
  } catch (error) {
    console.error('Erro ao buscar fechamentos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar fechamentos' },
      { status: 500 }
    )
  }
}

