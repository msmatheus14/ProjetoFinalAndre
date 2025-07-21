"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { excluirNoticiaAction, type NoticiaItem,retornarTodasNoticias } from "@/app/actions/noticias"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

export default function TodasNoticiasPage() {
    const [noticias, setNoticias] = useState<NoticiaItem[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const carregarNoticias = async () => {
            try {
                const dados = await retornarTodasNoticias()
                setNoticias(dados)
            } catch (error) {
                console.error("Erro ao carregar notícias:", error)
            } finally {
                setLoading(false)
            }
        }
        carregarNoticias()
    }, [])

    const handleEditar = (id: string) => {
        router.push(`/noticias/editar/${id}`)
    }

    const handleExcluir = async (id: string, titulo: string) => {
        if (window.confirm(`Tem certeza que deseja excluir "${titulo}"?`)) {
            try {
                await excluirNoticiaAction(id)
                const dados = await retornarTodasNoticias()
                setNoticias(dados)
                
            } catch (error) {
                if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
                    window.location.reload()
                    return
                }
               
            }
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <p>Carregando...</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Todas as Notícias</h1>
                <Link href="/noticias/criar">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        Nova Notícia
                    </Button>
                </Link>
            </div>

            <p className="mb-4 text-gray-600">
                {noticias.length} notícia(s) encontrada(s)
            </p>

            {noticias.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {noticias.map((noticia) => (
                        <Card key={noticia.id} className="p-4">
                            <CardTitle className="text-lg mb-2">
                                {noticia.titulo}
                                {noticia.tipo === 1 && (
                                    <span className="ml-2 bg-red-200 text-red-800 text-xs px-2 py-1 rounded">
                                        Urgente
                                    </span>
                                )}
                            </CardTitle>
                            
                            <CardContent className="p-0">
                                <p className="text-gray-700 mb-3 text-sm">
                                    {noticia.descricao || "Sem descrição"}
                                </p>
                                
                                <div className="text-xs text-gray-500 mb-3">
                                    <p>Autor: {noticia.autor || "Não informado"}</p>
                                    <p>Local: {noticia.local || "Não informado"}</p>
                                    <p>Data: {new Date(noticia.data).toLocaleDateString("pt-BR")}</p>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Link href={`/noticias/item/${noticia.id}`}>
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                            Ver
                                        </Button>
                                    </Link>
                                    
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEditar(noticia.id)}
                                    >
                                        Editar
                                    </Button>
                                    
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleExcluir(noticia.id, noticia.titulo)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Excluir
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <h2 className="text-xl mb-4">Nenhuma notícia encontrada</h2>
                    <Link href="/noticias/criar">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            Criar Primeira Notícia
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
