'use client'

import { useEffect, useState } from 'react'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Building2, Globe, Users } from "lucide-react"

interface Actor {
  id: string
  name: string
  logo?: string
  mission: string
  programs: string[]
  website?: string
  icon: string
  color: string
}

export default function AtoresPage() {
  const [actors, setActors] = useState<Actor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActors()
  }, [])

  const fetchActors = async () => {
    try {
      const response = await fetch('/api/actors')
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Atores do Ecossistema
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              Conheça as organizações que impulsionam a inovação e o empreendedorismo 
              no Maranhão, criando oportunidades e transformando ideias em realidade.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando atores...</p>
              </div>
            ) : actors.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum ator disponível no momento.</p>
              </div>
            ) : (
              actors.map((actor) => (
                <Card key={actor.id} className="overflow-hidden hover:shadow-lg transition-shadow card-hover-glow">
                  <div className="grid md:grid-cols-[120px_1fr] gap-6">
                    <div className="bg-gray-50 flex items-center justify-center p-6">
                      {actor.logo ? (
                        <img 
                          src={actor.logo} 
                          alt={actor.name}
                          className="max-w-full max-h-20 object-contain"
                        />
                      ) : (
                        <div 
                          className="w-16 h-16 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: actor.color }}
                        >
                          <Building2 className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <CardHeader className="p-0 mb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl">{actor.name}</CardTitle>
                            {actor.website && (
                              <Button asChild variant="outline" size="sm">
                                <a 
                                  href={actor.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2"
                                >
                                  <Globe size={16} />
                                  Site
                                  <ExternalLink size={14} />
                                </a>
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-0 space-y-4">
                          <p className="text-muted-foreground leading-relaxed">{actor.mission}</p>

                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <Users size={16} />
                              Programas e Serviços
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {actor.programs.map((program, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
                                >
                                  {program.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
