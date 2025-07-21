"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "../../lib/prisma" 


export async function criarLog(descricao: string, tipo = "INFO") {

  try {

    await prisma.log.create({

      data: {
        descricao,
        tipo,
        data: new Date(),
      },
    })

    console.log(`Log criado: [${tipo}] ${descricao}`)

  } catch (error) {

    console.error("Erro ao criar log:", error)

  }
}


export async function retornarTodosLogs(quant?: number) {

  try {

    const logs = await prisma.log.findMany({

      orderBy: {
        data: "desc",
      },
      take: quant,

    })

    return logs

  } catch (error) {

    console.error("Erro ao retornar logs:", error)
    return []

  }
}

export async function excluirTodosLogsAction() {

  try {
    await prisma.log.deleteMany({}) 

    console.log("Todos os logs foram excluídos.")

    revalidatePath("/logs")

    revalidatePath("/")

  } catch (error) {

    console.error("Erro ao excluir todos os logs na action:", error)

    
  }
}
