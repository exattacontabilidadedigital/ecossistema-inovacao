'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, Database, AlertTriangle, CheckCircle } from 'lucide-react'

export default function DataImportPage() {
  const { data: session } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.name.endsWith('.json')) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError('Por favor, selecione um arquivo JSON válido')
        setFile(null)
      }
    }
  }

  const handleImport = async () => {
    if (!file) {
      setError('Selecione um arquivo primeiro')
      return
    }

    setImporting(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('dataFile', file)

      const response = await fetch('/api/admin/import-data', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro na importação')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setImporting(false)
    }
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Acesso negado. Faça login como administrador.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Importação de Dados</h1>
          <p className="text-gray-600">
            Importe dados de backup para o banco de dados de produção
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Importar Backup de Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>ATENÇÃO:</strong> Esta operação irá substituir todos os dados existentes. 
                Certifique-se de ter um backup antes de continuar.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <label htmlFor="dataFile" className="text-sm font-medium">
                Selecionar arquivo de backup (data-export.json)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  id="dataFile"
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Upload className="h-4 w-4 text-gray-400" />
              </div>
              {file && (
                <p className="text-sm text-green-600">
                  ✓ Arquivo selecionado: {file.name}
                </p>
              )}
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div>
                    <p className="font-medium mb-2">✅ Importação concluída com sucesso!</p>
                    <p className="text-sm">Dados importados:</p>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Usuários: {result.summary.users}</li>
                      <li>• Hubs: {result.summary.hubs}</li>
                      <li>• Atores: {result.summary.actors}</li>
                      <li>• Agendamentos: {result.summary.appointments}</li>
                      <li>• Contatos: {result.summary.contacts}</li>
                      <li>• Categorias: {result.summary.categories}</li>
                      <li>• Tags: {result.summary.tags}</li>
                      <li>• Posts: {result.summary.blogPosts}</li>
                      <li>• Configurações: {result.summary.settings}</li>
                    </ul>
                    <p className="text-sm mt-2">
                      Importado em: {new Date(result.summary.importedAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleImport}
              disabled={!file || importing}
              className="w-full"
              size="lg"
            >
              {importing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Importando dados...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Importar Dados
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instruções</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <ol className="list-decimal list-inside space-y-2">
              <li>Selecione o arquivo <code className="bg-gray-100 px-1 rounded">data-export.json</code> gerado pelo script de exportação local</li>
              <li>Clique em "Importar Dados" para iniciar o processo</li>
              <li>Aguarde a conclusão da importação</li>
              <li>Verifique se todos os dados foram importados corretamente</li>
            </ol>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>💡 Dica:</strong> Para gerar o arquivo de exportação localmente, execute:
                <code className="block bg-blue-100 p-2 mt-1 rounded">pnpm run export-data</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}