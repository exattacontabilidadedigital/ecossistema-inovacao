'use client'

import { useEffect, useState } from 'react'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Users, Lightbulb, Target, Rocket } from "lucide-react"
import Link from "next/link"

interface Hub {
  id: string
  name: string
  location: string
  address: string
  description: string
  image?: string
  services: string[]
  hours: string
}

export default function HubsPage() {
  const [hubs, setHubs] = useState<Hub[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHubs()
  }, [])

  const fetchHubs = async () => {
    try {
      const response = await fetch('/api/hubs')
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
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Hubs de Inovação</h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 text-pretty">
              Espaços compartilhados e colaborativos onde você pode colocar suas ideias em prática e explorar todo o
              potencial para criar uma atmosfera propícia à inovação.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              Gere impacto na economia e cultura do Maranhão através de negócios inovadores em um ambiente que respira
              transformação.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="border-2 hover:border-primary transition-colors card-hover-glow">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Lightbulb className="text-primary" size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">O que é um Hub de Inovação</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    Um espaço compartilhado e colaborativo em que as pessoas podem colocar as suas ideias em prática e
                    explorar o potencial do local, para criar uma atmosfera propícia para quem quer gerar impacto na
                    economia e cultura por meio de negócios inovadores.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-secondary transition-colors card-hover-glow">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                    <Users className="text-secondary" size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Quem Pode Usar</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    Aberto a todos que queiram desenvolver ideias e negócios. Estudantes, empreendedores, startups e a
                    comunidade podem usufruir de um ambiente que respira inovação através do espaço colaborativo e da
                    conexão com mentores.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-accent transition-colors card-hover-glow">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                    <Rocket className="text-accent" size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">O que Acontece Aqui</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    Estimulamos a interação entre diferentes agentes para o surgimento de ideias inovadoras e
                    proporcionamos às startups um ambiente favorável para testar sua tecnologia e fazer networking.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Atividades Realizadas nos Hubs</h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Conheça as diversas atividades e serviços disponíveis para impulsionar sua jornada de inovação
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Trabalhos educativos junto à comunidade",
                "Coworking para estudantes e sociedade",
                "Acesso à internet para trabalhos acadêmicos",
                "Mentorias para planejamento e desenvolvimento",
                "Integração entre entidades empresariais e instituições acadêmicas",
                "Criação e desenvolvimento de tecnologias",
                "Palestras educativas e profissionais",
                "Oficinas práticas de criatividade e inovação",
                "Apoio na organização do Associativismo",
                "Pesquisa de extensão e mercadológica",
                "Estágios para complemento de carga horária",
                "Desenvolvimento de projetos para cidades inteligentes",
              ].map((atividade, index) => (
                <div key={index} className="flex items-start gap-3 bg-background p-4 rounded-lg border">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Target className="text-primary" size={14} />
                  </div>
                  <span className="text-muted-foreground leading-relaxed">{atividade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Hubs Físicos</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Conheça nossos espaços espalhados por Açailândia, cada um com infraestrutura completa
            </p>
          </div>

          <div className="grid gap-8">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Carregando hubs...</p>
              </div>
            ) : hubs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum hub disponível no momento.</p>
              </div>
            ) : (
              hubs.map((hub) => (
                <Card key={hub.id} className="overflow-hidden hover:shadow-lg transition-shadow card-hover-glow">
                <div className="grid md:grid-cols-[300px_1fr] gap-6">
                  <div className="h-48 relative overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img src={hub.image || "/placeholder.svg"} alt={hub.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-2xl">{hub.name}</CardTitle>
                        <p className="text-muted-foreground">{hub.location}</p>
                      </CardHeader>
                      <CardContent className="p-0 space-y-4">
                        <p className="text-muted-foreground leading-relaxed">{hub.description}</p>

                        <div className="flex items-start gap-2">
                          <MapPin className="text-primary mt-1 flex-shrink-0" size={20} />
                          <span className="text-sm">{hub.address}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="text-primary flex-shrink-0" size={20} />
                          <span className="text-sm">{hub.hours}</span>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Users className="text-secondary" size={20} />
                            Serviços Oferecidos
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {hub.services.map((service, i) => (
                              <span
                                key={i}
                                className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    <div className="mt-6">
                      <Button asChild className="w-full">
                        <Link href="/agenda">Agendar Visita</Link>
                      </Button>
                    </div>
                  </div>
                </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Como Começar a Inovar</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-3xl font-bold text-primary-foreground">1</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Escolha o Hub</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    Selecione o hub mais próximo ou com os serviços que você precisa para seu projeto
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/70 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-3xl font-bold text-secondary-foreground">2</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Faça a Reserva</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    Preencha o formulário na página de agenda com data e horário desejados
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-3xl font-bold text-accent-foreground">3</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Inove!</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    Chegue no horário agendado e aproveite toda a infraestrutura disponível
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/agenda">Agendar Minha Visita</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
