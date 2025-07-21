import Link from "next/link"

import { adicionarComentarioAction, buscarComentarios, type ComentarioItem,retornarNoticiaPorId } from "@/app/actions/noticias"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ItemNoticiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const noticia = await retornarNoticiaPorId(id)
  const comentarios: ComentarioItem[] = await buscarComentarios(id)

  if (!noticia) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Notícia não encontrada</h1>
          <Link href="/noticias/todas">
            <Button>Voltar para notícias</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/noticias/todas">
            <Button variant="outline">← Voltar para notícias</Button>
          </Link>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{noticia.titulo}</CardTitle>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span> {noticia.local}</span>
              <span> {noticia.autor}</span>
              <span> {new Date(noticia.data).toLocaleDateString("pt-BR")}</span>
              <span> {noticia.categoria}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                noticia.tipo === 1 ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
              }`}>
                {noticia.tipo === 1 ? "URGENTE" : "NORMAL"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed text-lg">{noticia.descricao}</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Adicionar Comentário</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={adicionarComentarioAction} className="space-y-4">
              <input type="hidden" name="noticiaId" value={id} />
              <div>
                <label htmlFor="autor" className="block text-sm font-medium mb-1">Nome *</label>
                <input
                  type="text"
                  id="autor"
                  name="autor"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="conteudo" className="block text-sm font-medium mb-1">Comentário *</label>
                <textarea
                  id="conteudo"
                  name="conteudo"
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Enviar Comentário
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {comentarios.length > 0 ? (
            comentarios.map((comentario) => (
              <div key={comentario.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{comentario.autor}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comentario.data).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{comentario.comentario}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nenhum comentário ainda. Seja o primeiro a comentar!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
