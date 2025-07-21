import Link from "next/link"

import { retornarLogs, retornarNoticiaTipo } from "@/app/actions/noticias"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"

export default async function HomePage() {
  const urgentNews = await retornarNoticiaTipo(1)
  const recentLogs = await retornarLogs(5)

  return (
    <section>
      <section className="bg-red-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">GuerreiroNews</h1>
          <p className="text-xl text-gray-200">Notícia com credibilidade!</p>
        </div>
      </section>

      <section className="bg-red-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Notícias Urgentes</h2>
          {urgentNews.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {urgentNews.map((noticia) => (
                <Card key={noticia.id} className="bg-white text-gray-900 shadow-md rounded-lg">
                  <CardContent className="p-6">
                    <CardTitle className="text-2xl mb-2">{noticia.titulo}</CardTitle>
                    <CardDescription className="text-gray-700 mb-4 line-clamp-2">{noticia.descricao}</CardDescription>
                    <Link href={`/noticias/item/${noticia.id}`}>
                      <Button variant="secondary" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
                        Leia mais
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-200">Nenhuma notícia urgente no momento.</p>
          )}
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Últimos Logs</h2>
          <div className="mb-4">
            <Link href="/logs">
              <Button variant="outline">Ver Todos os Logs</Button>
            </Link>
          </div>
          {recentLogs.length > 0 ? (
            <ul className="space-y-2">
              {recentLogs.map((log) => (
                <li key={log.id} className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                  <p className="font-semibold">{log.tipo}: {log.descricao}</p>
                  <p className="text-sm text-gray-500">
                    Registrado em: {new Date(log.data).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">Nenhum log recente.</p>
          )}
        </div>
      </section>
    </section>
  )
}
