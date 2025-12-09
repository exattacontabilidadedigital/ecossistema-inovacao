'use client'

export default function ResetAdmin() {
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
        <h1 className="text-2xl font-bold text-center mb-6">Reset Admin Password</h1>
        
        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            Clique no botão abaixo para redefinir a senha do administrador com as configurações atuais do environment.
          </p>
          
          <button
            onClick={handleReset}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            🔄 Redefinir Senha do Admin
          </button>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Email esperado:</strong> admin@inova.ma</p>
            <p><strong>Nova senha:</strong> Inova@2025#Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}