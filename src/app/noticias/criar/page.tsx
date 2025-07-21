"use client"

import Link from "next/link"
import { useState } from "react"

import { criarNoticiaAction } from "@/app/actions/noticias"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CriarNoticiaPage() {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        await criarNoticiaAction(formData)
        setLoading(false)
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
                    <CardTitle className="text-2xl">Criar Nova Notícia</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        handleSubmit(formData)
                    }} className="space-y-4">
                        <div>
                            <label htmlFor="titulo" className="block text-sm font-medium mb-1">
                                Título *
                            </label>
                            <input
                                type="text"
                                id="titulo"
                                name="titulo"
                                required
                                disabled={loading}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Digite o título da notícia"
                            />
                        </div>

                        <div>
                            <label htmlFor="descricao" className="block text-sm font-medium mb-1">
                                Descrição
                            </label>
                            <textarea
                                id="descricao"
                                name="descricao"
                                disabled={loading}
                                rows={4}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Descreva a notícia"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="autor" className="block text-sm font-medium mb-1">
                                    Autor
                                </label>
                                <input
                                    type="text"
                                    id="autor"
                                    name="autor"
                                    disabled={loading}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Nome do autor"
                                />
                            </div>

                            <div>
                                <label htmlFor="local" className="block text-sm font-medium mb-1">
                                    Local
                                </label>
                                <input
                                    type="text"
                                    id="local"
                                    name="local"
                                    disabled={loading}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Local da notícia"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="categoria" className="block text-sm font-medium mb-1">
                                    Categoria
                                </label>
                                <input
                                    type="text"
                                    id="categoria"
                                    name="categoria"
                                    disabled={loading}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Categoria da notícia"
                                />
                            </div>

                            <div>
                                <label htmlFor="tipo" className="block text-sm font-medium mb-1">
                                    Tipo *
                                </label>
                                <select
                                    id="tipo"
                                    name="tipo"
                                    required
                                    disabled={loading}
                                    className="w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="">Selecione o tipo</option>
                                    <option value="1">Urgente</option>
                                    <option value="2">Normal</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="data" className="block text-sm font-medium mb-1">
                                Data *
                            </label>
                            <input
                                type="datetime-local"
                                id="data"
                                name="data"
                                required
                                disabled={loading}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {loading ? "Criando..." : "Criar Notícia"}
                            </Button>
                            
                            <Link href="/noticias/todas">
                                <Button type="button" variant="outline" disabled={loading}>
                                    Cancelar
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
