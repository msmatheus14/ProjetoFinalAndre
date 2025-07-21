import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const noticiaId = searchParams.get("noticiaId")

    if (!noticiaId) {
      return NextResponse.json(
        { error: "ID da notícia é obrigatório" },
        { status: 400 }
      )
    }

    const comentarios = await prisma.comentario.findMany({
      where: { noticiaId },
      orderBy: { data: "desc" }
    })

    return NextResponse.json(comentarios)
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar comentários" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { noticiaId, autor, comentario } = body

    if (!noticiaId || !autor || !comentario) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      )
    }

    const novoComentario = await prisma.comentario.create({
      data: {
        noticiaId,
        autor,
        comentario,
        data: new Date(),
      },
    })

    await prisma.log.create({
      data: {
        descricao: `ADICIONAR_COMENTARIO: Comentário adicionado por ${autor}`,
        tipo: "SUCESSO",
        data: new Date(),
      },
    })

    return NextResponse.json(novoComentario, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Erro ao adicionar comentário" },
      { status: 500 }
    )
  }
}
