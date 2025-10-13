import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
