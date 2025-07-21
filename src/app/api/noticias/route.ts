import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const noticias = await prisma.noticia.findMany({
      orderBy: { data: "desc" }
    })

    return NextResponse.json(noticias)
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar notícias" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { titulo, local, autor, descricao, categoria, data, tipo } = body

    if (!titulo || !data || !tipo) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      )
    }

    const noticia = await prisma.noticia.create({
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
        descricao: `CRIAR_NOTICIA: Nova notícia criada: ${titulo}`,
        tipo: "SUCESSO",
        data: new Date(),
      },
    })

    return NextResponse.json(noticia, { status: 201 })
  } catch (error) {
    await prisma.log.create({
      data: {
        descricao: `ERRO_CRIAR_NOTICIA: Erro ao criar notícia: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        tipo: "ERRO",
        data: new Date(),
      },
    })

    return NextResponse.json(
      { error: "Erro ao criar notícia" },
      { status: 500 }
    )
  }
}
