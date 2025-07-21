import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Tenta fazer uma consulta simples
    await prisma.$connect()
    
    // Tenta contar registros
    const count = await prisma.noticia.count()
    
    return NextResponse.json({ 
      status: "success", 
      message: "Conexão com banco funcionando!",
      noticias_count: count,
      database_url_exists: !!process.env.DATABASE_URL,
      database_url_preview: process.env.DATABASE_URL?.substring(0, 20) + "..."
    })
  } catch (error) {
    console.error("Erro de conexão:", error)
    
    return NextResponse.json({ 
      status: "error", 
      message: "Erro ao conectar com banco",
      error: error instanceof Error ? error.message : "Erro desconhecido",
      database_url_exists: !!process.env.DATABASE_URL
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
