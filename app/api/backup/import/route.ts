import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar estrutura do backup
    if (!body.metadata || !body.dados) {
      return NextResponse.json(
        { error: 'Formato de backup inválido' },
        { status: 400 }
      )
    }

    const { dados } = body
    
    // Usar transação para garantir que tudo ou nada seja importado
    const resultado = await prisma.$transaction(async (tx) => {
      const resultados = {
        fechamentosCriados: 0,
        credenciamentosCriados: 0,
        cnpjsSimuladosCriados: 0,
        erros: [] as string[]
      }

      for (const fechamentoData of dados) {
        try {
          // Verificar se já existe
          const existe = await tx.fechamento.findUnique({
            where: { id: fechamentoData.id }
          })

          if (existe) {
            resultados.erros.push(`Fechamento ${fechamentoData.id} já existe - pulando`)
            continue
          }

          // Criar fechamento
          const fechamento = await tx.fechamento.create({
            data: {
              id: fechamentoData.id,
              gerenteEstadual: fechamentoData.gerenteEstadual,
              executivo: fechamentoData.executivo,
              agencia: fechamentoData.agencia,
              porteAgencia: fechamentoData.porteAgencia || null,
              gerentePJ: fechamentoData.gerentePJ || null,
              qtdVisitas: fechamentoData.qtdVisitas,
              qtdInteracoes: fechamentoData.qtdInteracoes,
              qtdBraExpre: fechamentoData.qtdBraExpre,
              data: new Date(fechamentoData.data),
              createdAt: new Date(fechamentoData.createdAt),
              updatedAt: new Date(fechamentoData.updatedAt),
              credenciamentos: {
                create: fechamentoData.credenciamentos?.map((cred: any) => ({
                  id: cred.id,
                  qtdCredenciamentos: cred.qtdCredenciamentos,
                  ativacoesValor: cred.ativacoesValor,
                  ec: cred.ec,
                  volumeRS: cred.volumeRS,
                  ra: cred.ra,
                  cesta: cred.cesta,
                  instalaDireto: cred.instalaDireto,
                  nomeGerentePJ: cred.nomeGerentePJ || null,
                  createdAt: new Date(cred.createdAt),
                  updatedAt: new Date(cred.updatedAt)
                })) || []
              },
              cnpjsSimulados: {
                create: fechamentoData.cnpjsSimulados?.map((cnpj: any) => ({
                  id: cnpj.id,
                  cnpj: cnpj.cnpj,
                  nomeEmpresa: cnpj.nomeEmpresa,
                  faturamento: cnpj.faturamento,
                  comentarios: cnpj.comentarios || null,
                  createdAt: new Date(cnpj.createdAt),
                  updatedAt: new Date(cnpj.updatedAt)
                })) || []
              }
            },
            include: {
              credenciamentos: true,
              cnpjsSimulados: true
            }
          })

          resultados.fechamentosCriados++
          resultados.credenciamentosCriados += fechamento.credenciamentos.length
          resultados.cnpjsSimuladosCriados += fechamento.cnpjsSimulados.length
        } catch (error) {
          resultados.erros.push(
            `Erro ao importar fechamento ${fechamentoData.id}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
          )
        }
      }

      return resultados
    })

    return NextResponse.json({
      success: true,
      message: 'Backup importado com sucesso',
      ...resultado
    })
  } catch (error) {
    console.error('Erro ao importar backup:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao importar dados', 
        details: error instanceof Error ? error.message : 'Erro desconhecido' 
      },
      { status: 500 }
    )
  }
}
