import { excluirTodosLogsAction, retornarTodosLogs } from "@/app/actions/logs"
import { Button } from "@/components/ui/button" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" 


export default async function LogsPage() {

  const logs = await retornarTodosLogs()

  return (
    
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-8 border border-gray-200 shadow-sm rounded-lg bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Logs de Notícias</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={excluirTodosLogsAction} className="mb-4">
            <Button
              type="submit"
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
            >
              Excluir Todos os Logs
            </Button>
          </form>

          {logs.length > 0 ? (
            <div className="space-y-4">
              {logs.map((log) => (
                <Card key={log.id} className="border border-gray-200 shadow-sm rounded-lg bg-white">
                  <CardContent className="p-4">
                    <p className="font-semibold text-gray-900">Tipo: {log.tipo}</p>
                    <p className="text-gray-800">Descrição: {log.descricao}</p>
                    <p className="text-sm text-gray-600">
                      Data:{" "}
                      {new Date(log.data).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Nenhum log registrado no momento.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
