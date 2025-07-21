import { PrismaClient } from "@prisma/client"

// Garante que apenas uma instância do PrismaClient seja criada em desenvolvimento
// para evitar problemas de "hot-reloading" com múltiplas conexões.
declare global {
  var prismaInstance: PrismaClient | undefined
}

export const prisma = global.prismaInstance || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  global.prismaInstance = prisma
}
