'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  Calendar, 
  MessageCircle, 
  FileText,
  LogOut,
  Menu,
  X
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    // Don't redirect if we're on the login page
    if (pathname === '/admin/login') return

    if (!session) {
      router.push('/admin/login')
      return
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      router.push('/admin/login')
      return
    }
  }, [session, status, router, pathname])

  // Don't apply layout restrictions to login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    return null
  }

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Usuários',
      href: '/admin/users',
      icon: Users,
    },
    {
      name: 'Hubs',
      href: '/admin/hubs',
      icon: Building,
    },
    {
      name: 'Atores',
      href: '/admin/actors',
      icon: Users,
    },
    {
      name: 'Agendamentos',
      href: '/admin/appointments',
      icon: Calendar,
    },
    {
      name: 'Contatos',
      href: '/admin/contacts',
      icon: MessageCircle,
    },
    {
      name: 'Blog',
      href: '/admin/blog',
      icon: FileText,
    },
  ]

  const handleSignOut = () => {
    signOut({ callbackUrl: '/admin/login' })
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-bold text-primary">
            INOVA Admin
          </h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link key={item.href} href={item.href}>
                <div className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}>
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* User info and logout */}
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {session.user.name}
              </p>
              <p className="text-xs text-gray-500">
                {session.user.role}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSignOut}
              className="text-gray-500 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-4 lg:px-6">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Último acesso: {new Date().toLocaleDateString('pt-BR')}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}