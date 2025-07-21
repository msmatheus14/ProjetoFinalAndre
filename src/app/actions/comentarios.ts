"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma" 


export async function criarComentarioAction(formData: FormData) {

  const comentario = formData.get("comentario") as string
  const autor = formData.get("autor") as string
  const noticiaId = formData.get("noticiaId") as string

  if (!comentario || !autor || !noticiaId) {

    console.error("Dados inválidos para criar comentário.")
    return { error: "Dados inválidos." }

  }

  try {
    await prisma.comentario.create({
     
      data: {
        comentario,
        autor,
        noticia: {
          connect: { id: noticiaId },
        },
      },
    })
    revalidatePath(`/noticias/${noticiaId}`)
  } catch (error) {
    console.error("Erro ao criar comentário na action:", error)
    return { error: (error as Error).message || "Erro ao criar comentário." }
  }
}


export async function excluirComentarioAction(id: string, noticiaId: string) {
  if (!id || !noticiaId) {
    console.error("IDs inválidos para exclusão de comentário.")
    return { error: "IDs inválidos." }
  }

  try {
    await prisma.comentario.delete({
     
      where: { id },
    })
    revalidatePath(`/noticias/${noticiaId}`)

  } catch (error) {

    console.error("Erro ao excluir comentário na action:", error)

    return { error: (error as Error).message || "Erro ao excluir comentário." }
    
  }
}
