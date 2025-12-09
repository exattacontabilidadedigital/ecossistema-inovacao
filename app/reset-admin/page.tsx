'use client'

export default function ResetAdmin() {
  const handleInit = async () => {
    try {
      const response = await fetch('/api/init-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(`✅ ${data.message}\n\nCredenciais:\nEmail: ${data.credentials.email}\nSenha: ${data.credentials.password}\n\nAdmin ID: ${data.admin.id}`)
      } else {
        alert(`❌ Erro: ${data.error}`)
      }
    } catch (error) {
      alert(`❌ Erro: ${error}`)
    }
  }

  const handleReset = async () => {
    try {
      const response = await fetch('/api/reset-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(`✅ ${data.message}\n\nCredenciais:\nEmail: ${data.admin.email}\nSenha: ${data.password}`)
      } else {
        alert(`❌ Erro: ${data.error}`)
      }
    } catch (error) {
      alert(`❌ Erro: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Database Admin</h1>
        
        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            Use primeiro "Inicializar BD" para criar as tabelas, depois "Reset Admin" se necessário.
          </p>
          
          <button
            onClick={handleInit}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            🚀 Inicializar Banco de Dados + Admin
          </button>
          
          <button
            onClick={handleReset}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            🔄 Apenas Reset Senha do Admin
          </button>
          
          <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded">
            <p><strong>Email:</strong> admin@inova.ma</p>
            <p><strong>Senha:</strong> Inova@2025#Admin</p>
            <p><strong>Primeiro uso:</strong> Clique em "Inicializar BD"</p>
          </div>
        </div>
      </div>
    </div>
  )
}