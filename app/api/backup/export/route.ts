import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Buscar todos os dados do banco
    const fechamentos = await prisma.fechamento.findMany({
      include: {
        credenciamentos: true,
        cnpjsSimulados: true
      },
      orderBy: {
        data: 'desc'
      }
    })

    // Criar objeto de backup com metadados
    const backup = {
      metadata: {
        versao: '1.0',
        dataExportacao: new Date().toISOString(),
        totalRegistros: fechamentos.length,
        totalCredenciamentos: fechamentos.reduce((sum, f) => sum + f.credenciamentos.length, 0),
        totalCnpjsSimulados: fechamentos.reduce((sum, f) => sum + f.cnpjsSimulados.length, 0)
      },
      dados: fechamentos.map(fechamento => ({
        id: fechamento.id,
        gerenteEstadual: fechamento.gerenteEstadual,
        executivo: fechamento.executivo,
        agencia: fechamento.agencia,
        porteAgencia: fechamento.porteAgencia,
        gerentePJ: fechamento.gerentePJ,
        qtdVisitas: fechamento.qtdVisitas,
        qtdInteracoes: fechamento.qtdInteracoes,
        qtdBraExpre: fechamento.qtdBraExpre,
        data: fechamento.data.toISOString(),
        createdAt: fechamento.createdAt.toISOString(),
        updatedAt: fechamento.updatedAt.toISOString(),
        credenciamentos: fechamento.credenciamentos.map(cred => ({
          id: cred.id,
          qtdCredenciamentos: cred.qtdCredenciamentos,
          ativacoesValor: cred.ativacoesValor,
          ec: cred.ec,
          volumeRS: cred.volumeRS,
          ra: cred.ra,
          cesta: cred.cesta,
          instalaDireto: cred.instalaDireto,
          nomeGerentePJ: cred.nomeGerentePJ,
          createdAt: cred.createdAt.toISOString(),
          updatedAt: cred.updatedAt.toISOString()
        })),
        cnpjsSimulados: fechamento.cnpjsSimulados.map(cnpj => ({
          id: cnpj.id,
          cnpj: cnpj.cnpj,
          nomeEmpresa: cnpj.nomeEmpresa,
          faturamento: cnpj.faturamento,
          comentarios: cnpj.comentarios,
          createdAt: cnpj.createdAt.toISOString(),
          updatedAt: cnpj.updatedAt.toISOString()
        }))
      }))
    }

    // Retornar como JSON para download
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `backup-fechamentos-${timestamp}.json`

    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    console.error('Erro ao exportar backup:', error)
    return NextResponse.json(
      { error: 'Erro ao exportar dados', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
