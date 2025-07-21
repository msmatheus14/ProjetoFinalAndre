import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get("limit")
    const limit = limitParam ? parseInt(limitParam) : undefined

    const logs = await prisma.log.findMany({
      orderBy: { data: "desc" },
      ...(limit && { take: limit })
    })

    return NextResponse.json(logs)
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar logs" },
      { status: 500 }
    )
  }
}
