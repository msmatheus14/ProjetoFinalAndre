import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const noticia = await prisma.noticia.findUnique({
      where: { id }
    })

    if (!noticia) {
      return NextResponse.json(
        { error: "Notícia não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(noticia)
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar notícia" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { titulo, local, autor, descricao, categoria, data, tipo } = body

    if (!titulo || !data || !tipo) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      )
    }

    const noticia = await prisma.noticia.update({
      where: { id },
      data: {
        titulo,
        local: local || "",
        autor: autor || "",
        descricao: descricao || "",
        categoria: categoria || "",
        data: new Date(data),
        tipo: parseInt(tipo),
      },
    })

    await prisma.log.create({
      data: {
        descricao: `EDITAR_NOTICIA: Notícia editada: ${titulo}`,
        tipo: "SUCESSO",
        data: new Date(),
      },
    })

    return NextResponse.json(noticia)
  } catch (error) {
    await prisma.log.create({
      data: {
        descricao: `ERRO_EDITAR_NOTICIA: Erro ao editar notícia: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        tipo: "ERRO",
        data: new Date(),
      },
    })

    return NextResponse.json(
      { error: "Erro ao editar notícia" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const noticia = await prisma.noticia.findUnique({
      where: { id }
    })

    if (!noticia) {
      return NextResponse.json(
        { error: "Notícia não encontrada" },
        { status: 404 }
      )
    }

    await prisma.noticia.delete({
      where: { id }
    })

    await prisma.log.create({
      data: {
        descricao: `EXCLUIR_NOTICIA: Notícia excluída: ${noticia.titulo}`,
        tipo: "SUCESSO",
        data: new Date(),
      },
    })

    return NextResponse.json({ message: "Notícia excluída com sucesso" })
  } catch (error) {
    await prisma.log.create({
      data: {
        descricao: `ERRO_EXCLUIR_NOTICIA: Erro ao excluir notícia: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        tipo: "ERRO",
        data: new Date(),
      },
    })

    return NextResponse.json(
      { error: "Erro ao excluir notícia" },
      { status: 500 }
    )
  }
}
