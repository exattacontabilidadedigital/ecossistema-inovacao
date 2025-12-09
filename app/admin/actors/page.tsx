'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Actor {
  id: string
  name: string
  logo?: string
  mission: string
  programs: string
  website?: string
  icon: string
  color: string
  active: boolean
  createdAt: string
  updatedAt: string
}

interface NewActor {
  name: string
  logo: string
  mission: string
  programs: string
  website: string
  icon: string
  color: string
}

const iconOptions = [
  'Building', 'University', 'Factory', 'Store', 'Globe', 'Users', 'Briefcase', 
  'Lightbulb', 'Rocket', 'Target', 'Award', 'Star', 'Shield', 'Heart'
]

const colorOptions = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
  '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6B7280'
]

export default function ActorsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [actors, setActors] = useState<Actor[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingActor, setEditingActor] = useState<Actor | null>(null)
  const [formData, setFormData] = useState<NewActor>({
    name: '',
    logo: '',
    mission: '',
    programs: '',
    website: '',
    icon: 'Building',
    color: '#3B82F6'
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
    fetchActors()
  }, [session, status, router])

  const fetchActors = async () => {
    try {
      const response = await fetch('/api/admin/actors')
      if (response.ok) {
        const data = await response.json()
        setActors(data)
      }
    } catch (error) {
      console.error('Error fetching actors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingActor ? `/api/admin/actors/${editingActor.id}` : '/api/admin/actors'
      const method = editingActor ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchActors()
        setShowForm(false)
        setEditingActor(null)
        setUploadMethod('url')
        setDragOver(false)
        setFormData({
          name: '',
          logo: '',
          mission: '',
          programs: '',
          website: '',
          icon: 'Building',
          color: '#3B82F6'
        })
      }
    } catch (error) {
      console.error('Error saving actor:', error)
    }
  }

  const handleEdit = (actor: Actor) => {
    setEditingActor(actor)
    setFormData({
      name: actor.name,
      logo: actor.logo || '',
      mission: actor.mission,
      programs: actor.programs,
      website: actor.website || '',
      icon: actor.icon,
      color: actor.color
    })
    setShowForm(true)
  }

  const handleToggleActive = async (actorId: string, active: boolean) => {
    try {
      const response = await fetch(`/api/admin/actors/${actorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: !active }),
      })

      if (response.ok) {
        fetchActors()
      }
    } catch (error) {
      console.error('Error toggling actor status:', error)
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
        setFormData(prev => ({ ...prev, logo: data.imageUrl }))
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

  const handleDelete = async (actorId: string) => {
    if (confirm('Tem certeza que deseja excluir este ator?')) {
      try {
        const response = await fetch(`/api/admin/actors/${actorId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          fetchActors()
        }
      } catch (error) {
        console.error('Error deleting actor:', error)
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
          <h1 className="text-3xl font-bold">Gerenciamento de Atores</h1>
          <p className="text-gray-600">Gerencie os atores do ecossistema de inovação</p>
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
              setEditingActor(null)
              setUploadMethod('url')
              setDragOver(false)
              setFormData({
                name: '',
                logo: '',
                mission: '',
                programs: '',
                website: '',
                icon: 'Building',
                color: '#3B82F6'
              })
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Novo Ator
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingActor ? 'Editar Ator' : 'Novo Ator'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingActor(null)
                  setUploadMethod('url')
                  setDragOver(false)
                  setFormData({
                    name: '',
                    logo: '',
                    mission: '',
                    programs: '',
                    website: '',
                    icon: 'Building',
                    color: '#3B82F6'
                  })
                }}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Ator
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
                  Logo do Ator
                </label>
                <div className="mb-3">
                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="logoMethod"
                        value="url"
                        checked={uploadMethod === 'url'}
                        onChange={(e) => setUploadMethod(e.target.value as 'url' | 'file')}
                        className="mr-2"
                      />
                      URL do Logo
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="logoMethod"
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
                      value={formData.logo}
                      onChange={(e) => setFormData({...formData, logo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://exemplo.com/logo.png"
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
                          id="logo-upload"
                          disabled={uploading}
                        />
                        <label
                          htmlFor="logo-upload"
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
                              {uploading ? 'Fazendo upload...' : 'Clique para selecionar um logo'}
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

                {formData.logo && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <div className="flex items-center gap-4">
                      <img 
                        src={formData.logo} 
                        alt="Preview" 
                        className="w-24 h-24 object-contain rounded-lg border-2 border-gray-200 shadow-sm bg-white"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBzdHJva2U9IiNjY2MiIGZpbGw9InRyYW5zcGFyZW50Ii8+Cjwvc3ZnPgo='
                        }}
                      />
                      <div className="text-xs text-gray-500">
                        <p>Logo carregado com sucesso</p>
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, logo: ''})}
                          className="text-red-500 hover:text-red-700 underline mt-1"
                        >
                          Remover logo
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Missão
                </label>
                <textarea
                  value={formData.mission}
                  onChange={(e) => setFormData({...formData, mission: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Programas (um por linha)
                </label>
                <textarea
                  value={formData.programs}
                  onChange={(e) => setFormData({...formData, programs: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Aceleração de Startups&#10;Mentoria Empresarial&#10;Capacitação Técnica&#10;Networking"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://exemplo.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ícone
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cor do Tema
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      className="w-16 h-10 border border-gray-300 rounded-md"
                    />
                    <select
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {colorOptions.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  {editingActor ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingActor(null)
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

      {/* Actors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {actors.map((actor) => (
          <div key={actor.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div 
              className="h-4" 
              style={{ backgroundColor: actor.color }}
            ></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  {actor.logo ? (
                    <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-lg border">
                      <img
                        src={actor.logo}
                        alt={actor.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: actor.color }}
                    >
                      {actor.icon.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{actor.name}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      actor.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {actor.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-sm mb-4">{actor.mission}</p>
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Programas:</p>
                <div className="flex flex-wrap gap-1">
                  {actor.programs.split('\n').filter(p => p.trim()).map((program, index) => (
                    <span 
                      key={index}
                      className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                    >
                      {program.trim()}
                    </span>
                  ))}
                </div>
              </div>
              {actor.website && (
                <div className="mb-4">
                  <a 
                    href={actor.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Visitar website
                  </a>
                </div>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(actor)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleToggleActive(actor.id, actor.active)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    actor.active 
                      ? 'bg-red-50 hover:bg-red-100 text-red-600' 
                      : 'bg-green-50 hover:bg-green-100 text-green-600'
                  }`}
                >
                  {actor.active ? 'Desativar' : 'Ativar'}
                </button>
                <button
                  onClick={() => handleDelete(actor.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded text-sm transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {actors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum ator cadastrado ainda.</p>
        </div>
      )}
    </div>
  )
}