'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Hub {
  id: string
  name: string
  location: string
  address: string
  description: string
  image?: string
  services: string
  hours: string
  active: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    appointments: number
  }
}

interface NewHub {
  name: string
  location: string
  address: string
  description: string
  image: string
  services: string
  hours: string
}

export default function HubsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [hubs, setHubs] = useState<Hub[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingHub, setEditingHub] = useState<Hub | null>(null)
  const [formData, setFormData] = useState<NewHub>({
    name: '',
    location: '',
    address: '',
    description: '',
    image: '',
    services: '',
    hours: ''
  })
  const [uploading, setUploading] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url')
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/admin/login')
      return
    }
    fetchHubs()
  }, [session, status, router])

  const fetchHubs = async () => {
    try {
      const response = await fetch('/api/admin/hubs')
      if (response.ok) {
        const data = await response.json()
        setHubs(data)
      }
    } catch (error) {
      console.error('Error fetching hubs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingHub ? `/api/admin/hubs/${editingHub.id}` : '/api/admin/hubs'
      const method = editingHub ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchHubs()
        setShowForm(false)
        setEditingHub(null)
        setUploadMethod('url')
        setDragOver(false)
        setFormData({
          name: '',
          location: '',
          address: '',
          description: '',
          image: '',
          services: '',
          hours: ''
        })
      }
    } catch (error) {
      console.error('Error saving hub:', error)
    }
  }

  const handleEdit = (hub: Hub) => {
    setEditingHub(hub)
    
    // Convert services JSON back to textarea format
    let servicesText = hub.services
    try {
      const servicesArray = JSON.parse(hub.services)
      servicesText = Array.isArray(servicesArray) ? servicesArray.join('\n') : hub.services
    } catch (e) {
      // If it's not JSON, use as is
      servicesText = hub.services
    }

    setFormData({
      name: hub.name,
      location: hub.location,
      address: hub.address,
      description: hub.description,
      image: hub.image || '',
      services: servicesText,
      hours: hub.hours
    })
    setShowForm(true)
  }

  const handleToggleActive = async (hubId: string, active: boolean) => {
    try {
      const response = await fetch(`/api/admin/hubs/${hubId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: !active }),
      })

      if (response.ok) {
        fetchHubs()
      }
    } catch (error) {
      console.error('Error toggling hub status:', error)
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, image: data.imageUrl }))
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao fazer upload da imagem')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Erro ao fazer upload da imagem')
    } finally {
      setUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        handleFileUpload(file)
      } else {
        alert('Por favor, selecione apenas arquivos de imagem')
      }
    }
  }

  const handleDelete = async (hubId: string) => {
    if (confirm('Tem certeza que deseja excluir este hub? Isso também excluirá todos os agendamentos relacionados.')) {
      try {
        const response = await fetch(`/api/admin/hubs/${hubId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          fetchHubs()
        }
      } catch (error) {
        console.error('Error deleting hub:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Hubs</h1>
          <p className="text-gray-600">Gerencie os hubs de inovação do INOVA</p>
        </div>
        <div className="space-x-2">
          <Link 
            href="/admin/dashboard"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Voltar ao Dashboard
          </Link>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingHub(null)
              setUploadMethod('url')
              setDragOver(false)
              setFormData({
                name: '',
                location: '',
                address: '',
                description: '',
                image: '',
                services: '',
                hours: ''
              })
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Novo Hub
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingHub ? 'Editar Hub' : 'Novo Hub'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingHub(null)
                  setUploadMethod('url')
                  setDragOver(false)
                  setFormData({
                    name: '',
                    location: '',
                    address: '',
                    description: '',
                    image: '',
                    services: '',
                    hours: ''
                  })
                }}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Hub
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localização
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço Completo
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagem do Hub
                </label>
                <div className="mb-3">
                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="imageMethod"
                        value="url"
                        checked={uploadMethod === 'url'}
                        onChange={(e) => setUploadMethod(e.target.value as 'url' | 'file')}
                        className="mr-2"
                      />
                      URL da Imagem
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="imageMethod"
                        value="file"
                        checked={uploadMethod === 'file'}
                        onChange={(e) => setUploadMethod(e.target.value as 'url' | 'file')}
                        className="mr-2"
                      />
                      Upload de Arquivo
                    </label>
                  </div>

                  {uploadMethod === 'url' ? (
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  ) : (
                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file)
                          }}
                          className="sr-only"
                          id="file-upload"
                          disabled={uploading}
                        />
                        <label
                          htmlFor="file-upload"
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`w-full flex items-center justify-center px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                            uploading
                              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                              : dragOver
                              ? 'border-blue-500 bg-blue-100 scale-105'
                              : 'border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400'
                          }`}
                        >
                          <div className="text-center">
                            <svg
                              className={`mx-auto h-8 w-8 mb-2 ${uploading ? 'text-gray-400' : 'text-blue-500'}`}
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <p className={`text-sm ${uploading ? 'text-gray-500' : 'text-blue-600'}`}>
                              {uploading ? 'Fazendo upload...' : 'Clique para selecionar uma imagem'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              ou arraste e solte aqui
                            </p>
                          </div>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
                      </p>
                    </div>
                  )}
                </div>

                {formData.image && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <div className="flex items-center gap-4">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBzdHJva2U9IiNjY2MiIGZpbGw9InRyYW5zcGFyZW50Ii8+Cjwvc3ZnPgo='
                        }}
                      />
                      <div className="text-xs text-gray-500">
                        <p>Imagem carregada com sucesso</p>
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, image: ''})}
                          className="text-red-500 hover:text-red-700 underline mt-1"
                        >
                          Remover imagem
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serviços Oferecidos
                </label>
                <textarea
                  value={formData.services}
                  onChange={(e) => setFormData({...formData, services: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Coworking&#10;Salas de Reunião&#10;Laboratórios&#10;Consultoria"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Digite um serviço por linha. Estes aparecerão como badges no site.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horário de Funcionamento
                </label>
                <input
                  type="text"
                  value={formData.hours}
                  onChange={(e) => setFormData({...formData, hours: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Segunda a Sexta: 8h às 18h"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Exemplo: Segunda a Sexta: 8h - 18h | Sábado: 8h - 12h</p>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  {editingHub ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingHub(null)
                    setUploadMethod('url')
                    setDragOver(false)
                    setFormData({
                      name: '',
                      location: '',
                      address: '',
                      description: '',
                      image: '',
                      services: '',
                      hours: ''
                    })
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hubs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hubs.map((hub) => (
          <div key={hub.id} className="bg-white rounded-lg shadow overflow-hidden">
            {hub.image && (
              <div className="w-full h-40 bg-gray-50 flex items-center justify-center">
                <img
                  src={hub.image}
                  alt={hub.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{hub.name}</h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  hub.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {hub.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{hub.location}</p>
              <p className="text-gray-600 text-sm mb-2">{hub.address}</p>
              <p className="text-gray-700 text-sm mb-4">{hub.description}</p>
              <div className="mb-4">
                <p className="text-xs text-gray-500">Horário:</p>
                <p className="text-sm">{hub.hours}</p>
              </div>
              {hub._count && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500">Agendamentos:</p>
                  <p className="text-sm font-medium">{hub._count.appointments}</p>
                </div>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(hub)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleToggleActive(hub.id, hub.active)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    hub.active 
                      ? 'bg-red-50 hover:bg-red-100 text-red-600' 
                      : 'bg-green-50 hover:bg-green-100 text-green-600'
                  }`}
                >
                  {hub.active ? 'Desativar' : 'Ativar'}
                </button>
                <button
                  onClick={() => handleDelete(hub.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded text-sm transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hubs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum hub cadastrado ainda.</p>
        </div>
      )}
    </div>
  )
}