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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingActor ? 'Editar Ator' : 'Novo Ator'}
            </h2>
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
                  URL do Logo
                </label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({...formData, logo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://exemplo.com/logo.png"
                />
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
                    <img
                      src={actor.logo}
                      alt={actor.name}
                      className="w-12 h-12 object-contain"
                    />
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