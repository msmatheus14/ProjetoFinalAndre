import Link from "next/link"

import { Button } from "./button"

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">GuerreiroNews</Link>
        <div className="flex gap-4">
          <Link href="/"><Button variant="outline" size="sm">Início</Button></Link>
          <Link href="/noticias/todas"><Button variant="outline" size="sm">Todas</Button></Link>
          <Link href="/noticias/criar"><Button variant="outline" size="sm">Criar</Button></Link>
          <Link href="/logs"><Button variant="outline" size="sm">Logs</Button></Link>
        </div>
      </div>
    </nav>
  )
}