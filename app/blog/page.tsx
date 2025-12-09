'use client'

import { useState, useEffect } from 'react'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, Trophy, Lightbulb, Megaphone } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  color: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

interface BlogPost {
  id: string
  title: string
  excerpt?: string
  content: string
  slug: string
  image?: string
  status: string
  publishedAt: string
  author: {
    id: string
    name: string
  }
  categories: Category[]
  tags: Tag[]
}

// Função para obter ícone baseado na categoria
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase()
  if (name.includes('sucesso') || name.includes('cases')) return Trophy
  if (name.includes('evento') || name.includes('workshop') || name.includes('programa')) return Megaphone
  if (name.includes('inovação') || name.includes('tecnologia') || name.includes('infraestrutura')) return Lightbulb
  return Lightbulb // padrão
}

// Função para truncar texto
const truncateText = (text: string, maxLength: number = 150) => {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

// Função para formatar data
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/blog')
        
        if (!response.ok) {
          throw new Error('Falha ao carregar os posts')
        }
        
        const data = await response.json()
        setPosts(data.posts || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar posts')
        console.error('Erro ao carregar posts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Carregando posts...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-600">
            <p>Erro: {error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="mt-4"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Se não há posts, mostra mensagem
  if (posts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <section className="py-16 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog & Notícias</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Fique por dentro das últimas novidades, eventos, casos de sucesso e oportunidades do Ecossistema de
                Inovação do Maranhão.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 flex-1 flex items-center justify-center">
          <div className="text-center">
            <Lightbulb className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum post ainda</h3>
            <p className="text-muted-foreground">
              Os posts aparecerão aqui quando forem publicados.
            </p>
          </div>
        </section>

        <Footer />
      </div>
    )
  }

  const featuredPost = posts[0]
  const otherPosts = posts.slice(1)
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="py-16 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog & Notícias</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Fique por dentro das últimas novidades, eventos, casos de sucesso e oportunidades do Ecossistema de
              Inovação do Maranhão.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Featured Post */}
          <Card className="mb-12 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="h-64 md:h-auto relative overflow-hidden">
                <img
                  src={featuredPost.image || "/placeholder.svg"}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    {(() => {
                      const Icon = getCategoryIcon(featuredPost.categories[0]?.name || '')
                      return <Icon className="text-primary" size={20} />
                    })()}
                    <span className="text-sm font-semibold text-primary">
                      {featuredPost.categories[0]?.name || 'Artigo'}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-balance">{featuredPost.title}</h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {featuredPost.excerpt || truncateText(featuredPost.content)}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {formatDate(featuredPost.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={16} />
                      {featuredPost.author.name}
                    </span>
                  </div>
                </div>
                <Button>
                  Ler Mais
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Grid of Posts */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((post, index) => {
              const Icon = getCategoryIcon(post.categories[0]?.name || '')
              return (
                <Card key={post.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="text-primary" size={18} />
                      <span className="text-xs font-semibold text-primary">
                        {post.categories[0]?.name || 'Artigo'}
                      </span>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                      {post.excerpt || truncateText(post.content)}
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(post.publishedAt)}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Ler Mais
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Fique Atualizado</h2>
            <p className="text-muted-foreground mb-8">
              Receba novidades, eventos e oportunidades diretamente no seu e-mail
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background"
              />
              <Button>Inscrever</Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
