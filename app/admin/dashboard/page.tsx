'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface DashboardStats {
  users: number
  hubs: number
  appointments: number
  contacts: number
  blogPosts: number
}

interface RecentActivity {
  id: number
  type: 'user' | 'hub' | 'appointment' | 'contact' | 'blog'
  action: string
  description: string
  timestamp: string
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/admin/login')
      return
    }

    fetchStats()
    fetchRecentActivity()
  }, [session, status, router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchRecentActivity = async () => {
    try {
      // Mock data for now - can be replaced with actual API call
      const mockActivity: RecentActivity[] = [
        {
          id: 1,
          type: 'user',
          action: 'created',
          description: 'Novo usuário registrado: João Silva',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          type: 'hub',
          action: 'updated',
          description: 'Hub "Centro de Inovação" atualizado',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          type: 'appointment',
          action: 'created',
          description: 'Novo agendamento para reunião',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 4,
          type: 'blog',
          action: 'published',
          description: 'Post "Inovação no Maranhão" publicado',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ]
      setRecentActivity(mockActivity)
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (minutes < 60) {
      return `${minutes} minutos atrás`
    } else if (hours < 24) {
      return `${hours} horas atrás`
    } else {
      return date.toLocaleDateString('pt-BR')
    }
  }

  const getActivityIcon = (type: RecentActivity['type']) => {
    const iconClasses = "w-4 h-4"
    
    switch (type) {
      case 'user':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        )
      case 'hub':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        )
      case 'appointment':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        )
      case 'contact':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        )
      case 'blog':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        )
      default:
        return null
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
                INOVA Maranhão
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-semibold">Dashboard Administrativo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {session.user.role}
              </div>
              <div className="text-sm text-gray-600">
                Bem-vindo, <span className="font-medium">{session.user.name}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded text-sm transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-8">
        {/* Navigation Menu */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Menu de Navegação</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Link 
              href="/admin/users" 
              className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center transition-colors group"
            >
              <div className="flex flex-col items-center space-y-2">
                <svg className="w-8 h-8 text-blue-600 group-hover:text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
                <span className="font-medium text-blue-800">Usuários</span>
              </div>
            </Link>

            <Link 
              href="/admin/hubs" 
              className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center transition-colors group"
            >
              <div className="flex flex-col items-center space-y-2">
                <svg className="w-8 h-8 text-green-600 group-hover:text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span className="font-medium text-green-800">Hubs</span>
              </div>
            </Link>

            <Link 
              href="/admin/appointments" 
              className="bg-orange-50 hover:bg-orange-100 p-4 rounded-lg text-center transition-colors group"
            >
              <div className="flex flex-col items-center space-y-2">
                <svg className="w-8 h-8 text-orange-600 group-hover:text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span className="font-medium text-orange-800">Agendamentos</span>
              </div>
            </Link>

            <Link 
              href="/admin/contacts" 
              className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-center transition-colors group"
            >
              <div className="flex flex-col items-center space-y-2">
                <svg className="w-8 h-8 text-purple-600 group-hover:text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <span className="font-medium text-purple-800">Contatos</span>
              </div>
            </Link>

            <Link 
              href="/admin/blog" 
              className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg text-center transition-colors group"
            >
              <div className="flex flex-col items-center space-y-2">
                <svg className="w-8 h-8 text-indigo-600 group-hover:text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span className="font-medium text-indigo-800">Blog</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Estatísticas Gerais</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Usuários</p>
                  <p className="text-2xl font-bold text-blue-800">{stats?.users || 0}</p>
                </div>
                <div className="bg-blue-200 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Hubs</p>
                  <p className="text-2xl font-bold text-green-800">{stats?.hubs || 0}</p>
                </div>
                <div className="bg-green-200 p-3 rounded-full">
                  <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Agendamentos</p>
                  <p className="text-2xl font-bold text-orange-800">{stats?.appointments || 0}</p>
                </div>
                <div className="bg-orange-200 p-3 rounded-full">
                  <svg className="w-6 h-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Contatos</p>
                  <p className="text-2xl font-bold text-purple-800">{stats?.contacts || 0}</p>
                </div>
                <div className="bg-purple-200 p-3 rounded-full">
                  <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-600">Posts do Blog</p>
                  <p className="text-2xl font-bold text-indigo-800">{stats?.blogPosts || 0}</p>
                </div>
                <div className="bg-indigo-200 p-3 rounded-full">
                  <svg className="w-6 h-6 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Atividade Recente</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    activity.action === 'created' ? 'bg-green-100 text-green-800' :
                    activity.action === 'updated' ? 'bg-blue-100 text-blue-800' :
                    activity.action === 'published' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Status do Sistema</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Banco de Dados</span>
              <span className="text-xs text-green-600">Conectado</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">API</span>
              <span className="text-xs text-green-600">Funcionando</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Autenticação</span>
              <span className="text-xs text-green-600">Ativa</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link 
              href="/admin/users/new" 
              className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center transition-colors group"
            >
              <div className="flex flex-col items-center space-y-2">
                <svg className="w-8 h-8 text-blue-600 group-hover:text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
                <span className="font-medium text-blue-800">Novo Usuário</span>
              </div>
            </Link>

            <Link 
              href="/admin/hubs/new" 
              className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center transition-colors group"
            >
              <div className="flex flex-col items-center space-y-2">
                <svg className="w-8 h-8 text-green-600 group-hover:text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span className="font-medium text-green-800">Novo Hub</span>
              </div>
            </Link>

            <Link 
              href="/admin/blog/new" 
              className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg text-center transition-colors group"
            >
              <div className="flex flex-col items-center space-y-2">
                <svg className="w-8 h-8 text-indigo-600 group-hover:text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span className="font-medium text-indigo-800">Novo Post</span>
              </div>
            </Link>

            <Link 
              href="/admin/appointments" 
              className="bg-orange-50 hover:bg-orange-100 p-4 rounded-lg text-center transition-colors group"
            >
              <div className="flex flex-col items-center space-y-2">
                <svg className="w-8 h-8 text-orange-600 group-hover:text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span className="font-medium text-orange-800">Ver Agenda</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}