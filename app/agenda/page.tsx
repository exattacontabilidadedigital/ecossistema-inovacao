"use client"

import type React from "react"
import { useState, useEffect } from "react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Info } from "lucide-react"

interface Hub {
  id: string
  name: string
  location: string
  active: boolean
}

export default function AgendaPage() {
  const [hubs, setHubs] = useState<Hub[]>([])
  const [loadingHubs, setLoadingHubs] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    hub: "",
    date: "",
    time: "",
    duration: "",
    purpose: "",
  })

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
      setLoadingHubs(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    console.log("Reserva:", formData)
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.hub || !formData.date || !formData.time || !formData.duration) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          organization: formData.organization,
          hubId: formData.hub,
          date: formData.date,
          time: formData.time,
          duration: formData.duration,
          purpose: formData.purpose,
        }),
      })
      
      if (response.ok) {
        const appointment = await response.json()
        alert('Reserva enviada com sucesso! Entraremos em contato em breve.')
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          organization: "",
          hub: "",
          date: "",
          time: "",
          duration: "",
          purpose: "",
        })
      } else {
        const error = await response.json()
        console.error('Error creating appointment:', error)
        alert('Erro ao enviar reserva. Tente novamente.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Erro ao enviar reserva. Verifique sua conexão e tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="py-16 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Agenda & Reservas</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Reserve seu espaço nos nossos hubs de inovação. Agende datas e horários para workshops, reuniões,
              coworking ou desenvolvimento de projetos.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Faça sua Reserva</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="(99) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">Empresa / Startup / Instituição</Label>
                    <Input
                      id="organization"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hub">Selecione o Hub *</Label>
                    <Select required onValueChange={(value) => setFormData({ ...formData, hub: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingHubs ? "Carregando hubs..." : "Escolha um hub"} />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingHubs ? (
                          <SelectItem value="loading" disabled>
                            Carregando hubs...
                          </SelectItem>
                        ) : hubs.length === 0 ? (
                          <SelectItem value="empty" disabled>
                            Nenhum hub disponível
                          </SelectItem>
                        ) : (
                          hubs.map((hub) => (
                            <SelectItem key={hub.id} value={hub.id}>
                              {hub.name} - {hub.location}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Data da Reserva *</Label>
                      <Input
                        id="date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Horário *</Label>
                      <Input
                        id="time"
                        type="time"
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração Prevista *</Label>
                    <Select required onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a duração" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hora</SelectItem>
                        <SelectItem value="2">2 horas</SelectItem>
                        <SelectItem value="3">3 horas</SelectItem>
                        <SelectItem value="4">4 horas</SelectItem>
                        <SelectItem value="5">5 horas</SelectItem>
                        <SelectItem value="6">6 horas</SelectItem>
                        <SelectItem value="8">8 horas (dia todo)</SelectItem>
                        <SelectItem value="custom">Personalizada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Propósito da Reserva *</Label>
                    <Select required onValueChange={(value) => setFormData({ ...formData, purpose: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o propósito" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coworking">Coworking</SelectItem>
                        <SelectItem value="reuniao">Reunião</SelectItem>
                        <SelectItem value="workshop">Workshop / Palestra</SelectItem>
                        <SelectItem value="mentoria">Mentoria</SelectItem>
                        <SelectItem value="projeto">Desenvolvimento de Projeto</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full btn-glow bg-accent hover:bg-accent/90 text-accent-foreground" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Enviando...' : 'Confirmar Reserva'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Info Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="text-primary" size={24} />
                    Políticas de Uso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    • <strong>Duração:</strong> Reservas de 2 a 8 horas por dia
                  </p>
                  <p>
                    • <strong>Prioridade:</strong> Projetos inovadores e startups em desenvolvimento têm prioridade
                  </p>
                  <p>
                    • <strong>Cancelamento:</strong> Avise com 24h de antecedência
                  </p>
                  <p>
                    • <strong>Gratuito:</strong> Todos os serviços são gratuitos para a comunidade
                  </p>
                  <p>
                    • <strong>Regras:</strong> Mantenha o espaço limpo e respeite outros usuários
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="text-secondary" size={24} />
                    Horários Disponíveis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">Hub Mercado Municipal</p>
                    <p className="text-muted-foreground">Seg-Sex: 8h - 18h</p>
                  </div>
                  <div>
                    <p className="font-semibold">Hub UEMASUL</p>
                    <p className="text-muted-foreground">Seg-Sex: 7h - 21h | Sáb: 8h - 12h</p>
                  </div>
                  <div>
                    <p className="font-semibold">Hub SENAI</p>
                    <p className="text-muted-foreground">Seg-Sex: 8h - 17h</p>
                  </div>
                  <div>
                    <p className="font-semibold">Hub IFMA</p>
                    <p className="text-muted-foreground">Seg-Sex: 7h - 22h</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary text-primary-foreground">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Precisa de Ajuda?</h3>
                  <p className="text-sm mb-4 text-primary-foreground/90">
                    Entre em contato conosco para dúvidas sobre reservas ou disponibilidade.
                  </p>
                  <Button variant="secondary" asChild className="w-full">
                    <a href="/contato">Falar com Suporte</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
