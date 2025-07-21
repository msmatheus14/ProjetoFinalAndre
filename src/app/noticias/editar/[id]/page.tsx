"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { editarNoticiaAction, type NoticiaItem,retornarNoticiaPorId } from "@/app/actions/noticias"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EditarNoticiaPage({ params }: { params: Promise<{ id: string }> }) {
  const [noticia, setNoticia] = useState<NoticiaItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [id, setId] = useState<string>("")

  useEffect(() => {
    const carregarNoticia = async () => {
      try {
        const resolvedParams = await params
        const noticiaId = resolvedParams.id
        setId(noticiaId)
        const dados = await retornarNoticiaPorId(noticiaId)
        setNoticia(dados)
      } catch (error) {
        console.error("Erro ao carregar notícia:", error)
      } finally {
        setLoading(false)
      }
    }
    carregarNoticia()
  }, [params])

  const handleSubmit = async (formData: FormData) => {
    setSaving(true)
    try {
      formData.append("id", id)
      await editarNoticiaAction(formData)
    } catch (error) {
      console.error("Erro ao editar notícia:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!noticia) {
    return (
      <div className="container mx-auto p-4">
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
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href="/noticias/todas">
          <Button variant="outline">← Voltar</Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Editar Notícia</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            handleSubmit(formData)
          }} className="space-y-4">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium mb-1">Título *</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                required
                disabled={saving}
                defaultValue={noticia.titulo}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Digite o título da notícia"
              />
            </div>

            <div>
              <label htmlFor="descricao" className="block text-sm font-medium mb-1">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                disabled={saving}
                rows={4}
                defaultValue={noticia.descricao}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Descreva a notícia"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="autor" className="block text-sm font-medium mb-1">Autor</label>
                <input
                  type="text"
                  id="autor"
                  name="autor"
                  disabled={saving}
                  defaultValue={noticia.autor}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Nome do autor"
                />
              </div>

              <div>
                <label htmlFor="local" className="block text-sm font-medium mb-1">Local</label>
                <input
                  type="text"
                  id="local"
                  name="local"
                  disabled={saving}
                  defaultValue={noticia.local}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Local da notícia"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="categoria" className="block text-sm font-medium mb-1">Categoria</label>
                <input
                  type="text"
                  id="categoria"
                  name="categoria"
                  disabled={saving}
                  defaultValue={noticia.categoria}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Categoria da notícia"
                />
              </div>

              <div>
                <label htmlFor="tipo" className="block text-sm font-medium mb-1">Tipo *</label>
                <select
                  id="tipo"
                  name="tipo"
                  required
                  disabled={saving}
                  defaultValue={noticia.tipo}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Selecione o tipo</option>
                  <option value="1">Urgente</option>
                  <option value="2">Normal</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="data" className="block text-sm font-medium mb-1">Data *</label>
              <input
                type="datetime-local"
                id="data"
                name="data"
                required
                disabled={saving}
                defaultValue={new Date(noticia.data).toISOString().slice(0, 16)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
              
              <Link href="/noticias/todas">
                <Button type="button" variant="outline" disabled={saving}>Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
