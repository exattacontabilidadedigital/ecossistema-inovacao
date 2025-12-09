'use client'

import { useState } from 'react'

export default function DebugLogin() {
  const [email, setEmail] = useState('admin@inova.ma')
  const [password, setPassword] = useState('Inova@2025#Admin')
  const [result, setResult] = useState('')
  const [users, setUsers] = useState('')
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Erro: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const listUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug-login')
      const data = await response.json()
      setUsers(JSON.stringify(data, null, 2))
    } catch (error) {
      setUsers(`Erro: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testRealLogin = async () => {
    setLoading(true)
    try {
      // Importar signIn do next-auth
      const { signIn } = await import('next-auth/react')
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      
      setResult(JSON.stringify({
        success: !result?.error,
        error: result?.error,
        url: result?.url,
        status: result?.status,
        ok: result?.ok
      }, null, 2))
      
    } catch (error) {
      setResult(`Erro no signIn: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Debug Login - Ecossistema</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formulário de Teste */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Teste de Login</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={testLogin}
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {loading ? 'Testando...' : '🔍 Debug Login'}
                </button>
                
                <button 
                  onClick={testRealLogin}
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {loading ? 'Testando...' : '🔑 Teste NextAuth Login'}
                </button>
                
                <button 
                  onClick={listUsers}
                  disabled={loading}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {loading ? 'Carregando...' : '👥 Listar Usuários'}
                </button>
              </div>
              
              <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded">
                <p><strong>Senhas para testar:</strong></p>
                <p>• admin123</p>
                <p>• Inova@2025#Admin</p>
                <p>• {process.env.ADMIN_PASSWORD || 'env não definida'}</p>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Resultado do Login</h2>
              <pre className="bg-gray-50 p-4 rounded overflow-auto text-xs">
                {result || 'Execute um teste para ver o resultado...'}
              </pre>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Usuários no Banco</h2>
              <pre className="bg-gray-50 p-4 rounded overflow-auto text-xs">
                {users || 'Clique em "Listar Usuários" para ver...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}