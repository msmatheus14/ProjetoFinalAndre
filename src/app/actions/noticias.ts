"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"

export interface NoticiaItem {

  id: string
  titulo: string
  descricao?: string
  local?: string
  autor?: string
  data: Date
  categoria?: string
  tipo?: number
}

export interface ComentarioItem {

  id: string
  noticiaId: string
  autor: string
  comentario: string
  data: Date
}

export interface LogItem {

  id: string
  descricao: string
  tipo: string
  data: Date
}

export async function criarNoticiaAction(formData: FormData): Promise<void> {

  const titulo = formData.get("titulo") as string
  const local = formData.get("local") as string
  const autor = formData.get("autor") as string
  const descricao = formData.get("descricao") as string
  const categoria = formData.get("categoria") as string
  const dataStr = formData.get("data") as string
  const tipoStr = formData.get("tipo") as string

  if (!titulo || !dataStr || !tipoStr) {

    throw new Error("Campos obrigatórios não preenchidos")

  }

  const data = new Date(dataStr)
  const tipo = parseInt(tipoStr)

  try {

    await prisma.noticia.create({

      data: {

        titulo,
        local: local || "",
        autor: autor || "",
        descricao: descricao || "",
        categoria: categoria || "",
        data,
        tipo,
      },

    })

    await prisma.log.create({

      data: {
        descricao: `CRIAR_NOTICIA: Nova notícia criada: ${titulo}`,
        tipo: "SUCESSO",
        data: new Date(),
      },

    })


    revalidatePath("/noticias/todas")

    revalidatePath("/")

  } catch (error) {

    await prisma.log.create({

      data: {

        descricao: `ERRO_CRIAR_NOTICIA: Erro ao criar notícia: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        tipo: "ERRO",
        data: new Date(),

      },
    })
    throw error
  }

  redirect("/noticias/todas")
}

export async function retornarNoticiaTipo(tipo: number): Promise<NoticiaItem[]> {

  try {

    const noticias = await prisma.noticia.findMany({

      where: { tipo },
      orderBy: { data: "desc" },

    })

    return noticias.map((noticia) => ({

      id: noticia.id,
      titulo: noticia.titulo,
      descricao: noticia.descricao || "",
      local: noticia.local || "",
      autor: noticia.autor || "",
      data: noticia.data,
      categoria: noticia.categoria || "",
      tipo: noticia.tipo ?? undefined,

    }))
  } catch (error) {

    console.error("Erro ao buscar notícias por tipo:", error)
    return []

  }
}

export async function retornarTodasNoticias(): Promise<NoticiaItem[]> {

  try {

    const noticias = await prisma.noticia.findMany({
      orderBy: { data: "desc" },

    })

    return noticias.map((noticia) => ({

      id: noticia.id,
      titulo: noticia.titulo,
      descricao: noticia.descricao || "",
      local: noticia.local || "",
      autor: noticia.autor || "",
      data: noticia.data,
      categoria: noticia.categoria || "",
      tipo: noticia.tipo ?? undefined,

    }))
  } catch (error) {

    console.error("Erro ao buscar notícias:", error)
    return []

  }
}

export async function retornarNoticiaPorId(id: string): Promise<NoticiaItem | null> {

  try {

    const noticia = await prisma.noticia.findUnique({

      where: { id },

    })

    if (!noticia) {

      return null
    }

    return {

      id: noticia.id,
      titulo: noticia.titulo,
      descricao: noticia.descricao || "",
      local: noticia.local || "",
      autor: noticia.autor || "",
      data: noticia.data,
      categoria: noticia.categoria || "",
      tipo: noticia.tipo ?? undefined,
    }

  } catch (error) {

    console.error("Erro ao buscar notícia:", error)
    return null

  }
}

export async function editarNoticiaAction(formData: FormData): Promise<void> {

  const id = formData.get("id") as string
  const titulo = formData.get("titulo") as string
  const local = formData.get("local") as string
  const autor = formData.get("autor") as string
  const descricao = formData.get("descricao") as string
  const categoria = formData.get("categoria") as string
  const dataStr = formData.get("data") as string
  const tipoStr = formData.get("tipo") as string

  if (!id || !titulo || !dataStr || !tipoStr) {
    throw new Error("Campos obrigatórios não preenchidos")
  }

  const data = new Date(dataStr)
  const tipo = parseInt(tipoStr)

  try {
    console.log(" Iniciando edição da notícia:", titulo)

    await prisma.noticia.update({

      where: { id },
      data: {
        titulo,
        local: local || "",
        autor: autor || "",
        descricao: descricao || "",
        categoria: categoria || "",
        data,
        tipo,
      },
    })

    console.log(" Notícia editada com sucesso, criando log...")

    await prisma.log.create({

      data: {
        descricao: `EDITAR_NOTICIA: Notícia editada: ${titulo}`,
        tipo: "SUCESSO",
        data: new Date(),
      },

    })

    console.log(" Log de edição criado com sucesso!")

    revalidatePath("/noticias/todas")
    revalidatePath("/")
    revalidatePath(`/noticias/item/${id}`)
    revalidatePath("/logs")

  } catch (error) {
    console.error(" Erro na edição da notícia:", error)

    await prisma.log.create({

      data: {

        descricao: `ERRO_EDITAR_NOTICIA: Erro ao editar notícia: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        tipo: "ERRO",
        data: new Date(),

      },
    })

    console.log(" Log de erro criado com sucesso!")
  }

  redirect("/noticias/todas")
}

export async function excluirNoticiaAction(id: string): Promise<void> {

  try {
    console.log(" Iniciando exclusão da notícia ID:", id)

    const noticia = await prisma.noticia.findUnique({

      where: { id },

    })

    if (!noticia) {

      throw new Error("Notícia não encontrada")

    }

    await prisma.noticia.delete({

      where: { id },

    })

    console.log(" Notícia excluída com sucesso, criando log...")

    await prisma.log.create({

      data: {

        descricao: `EXCLUIR_NOTICIA: Notícia excluída: ${noticia.titulo}`,
        tipo: "SUCESSO",
        data: new Date(),

      },
    })

    console.log(" Log de exclusão criado com sucesso!")

    revalidatePath("/noticias/todas")
    revalidatePath("/")
    revalidatePath("/logs")

  } catch (error) {
    console.error(" Erro na exclusão da notícia:", error)

    await prisma.log.create({

      data: {

        descricao: `ERRO_EXCLUIR_NOTICIA: Erro ao excluir notícia: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        tipo: "ERRO",
        data: new Date(),
      },
    })

    console.log(" Log de erro de exclusão criado com sucesso!")
  }

  redirect("/noticias/todas")
}

export async function adicionarComentarioAction(formData: FormData): Promise<void> {

  const noticiaId = formData.get("noticiaId") as string
  const autor = formData.get("autor") as string
  const conteudo = formData.get("conteudo") as string

  if (!noticiaId || !autor || !conteudo) {

    throw new Error("Todos os campos são obrigatórios")
  }

  try {
    console.log(" Iniciando criação de comentário por:", autor)

    await prisma.comentario.create({

      data: {

        noticiaId,
        autor,
        comentario: conteudo,
        data: new Date(),
      },

    })

    console.log(" Comentário criado com sucesso, criando log...")

    await prisma.log.create({

      data: {

        descricao: `ADICIONAR_COMENTARIO: Comentário adicionado por ${autor}`,
        tipo: "SUCESSO",
        data: new Date(),

      },
    })

    console.log(" Log de comentário criado com sucesso!")

    revalidatePath(`/noticias/item/${noticiaId}`)
    revalidatePath("/logs")

  } catch (error) {

    console.error(" Erro ao adicionar comentário:", error)

    throw error
  }
}

export async function buscarComentarios(noticiaId: string): Promise<ComentarioItem[]> {

  try {

    const comentarios = await prisma.comentario.findMany({
      where: { noticiaId },
      orderBy: { data: "desc" },

    })

    return comentarios.map((comentario) => ({

      id: comentario.id,
      noticiaId: comentario.noticiaId,
      autor: comentario.autor,
      comentario: comentario.comentario,
      data: comentario.data,

    }))
  } catch (error) {

    console.error("Erro ao buscar comentários:", error)

    return []

  }
}

export async function retornarLogs(limite?: number): Promise<LogItem[]> {

  try {

    const logs = await prisma.log.findMany({
      orderBy: { data: "desc" },
      ...(limite && { take: limite })

    })

    return logs.map((log) => ({

      id: log.id,
      descricao: log.descricao,
      tipo: log.tipo,
      data: log.data,

    }))
  } catch (error) {

    console.error("Erro ao buscar logs:", error)
    return []
    
  }
}