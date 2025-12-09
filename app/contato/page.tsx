"use client"

import type React from "react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Clock } from "lucide-react"
import { useState } from "react"

export default function ContatoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        }),
      })
      
      if (response.ok) {
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      } else {
        const error = await response.json()
        console.error('Error sending contact:', error)
        alert('Erro ao enviar mensagem. Tente novamente.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Erro ao enviar mensagem. Verifique sua conexão e tente novamente.')
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Entre em Contato</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Tire suas dúvidas, envie sugestões ou descubra como fazer parte do Ecossistema de Inovação do Maranhão.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Envie sua Mensagem</CardTitle>
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
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto *</Label>
                    <Input
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem *</Label>
                    <Textarea
                      id="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full btn-glow" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="card-hover-glow">
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">Telefone</p>
                      <p className="text-muted-foreground">(99) 3538-5678</p>
                      <p className="text-muted-foreground">(99) 98765-4321</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="text-secondary" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">E-mail</p>
                      <p className="text-muted-foreground">contato@ecoinovacao.ma.gov.br</p>
                      <p className="text-muted-foreground">suporte@ecoinovacao.ma.gov.br</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-accent" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">Endereço</p>
                      <p className="text-muted-foreground">
                        Av. Principal, 1234 - Centro
                        <br />
                        Açailândia - MA, 65930-000
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">Horário de Atendimento</p>
                      <p className="text-muted-foreground">
                        Segunda a Sexta: 8h às 18h
                        <br />
                        Sábado: 8h às 12h
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Redes Sociais</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Acompanhe nossas redes sociais para ficar por dentro das novidades
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      <Facebook className="text-primary" size={24} />
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center hover:bg-secondary/20 transition-colors"
                    >
                      <Instagram className="text-secondary" size={24} />
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center hover:bg-accent/20 transition-colors"
                    >
                      <Linkedin className="text-accent" size={24} />
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="gradient-cta text-primary-foreground">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Precisa de Ajuda Urgente?</h3>
                  <p className="text-sm mb-4 text-primary-foreground/90">
                    Nossa equipe está pronta para te atender. Entre em contato por telefone ou WhatsApp para suporte
                    imediato.
                  </p>
                  <Button 
                    className="w-full btn-glow !bg-white/90 hover:!bg-white !text-primary !border-0"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: 'var(--primary)',
                      border: 'none'
                    }}
                  >
                    Falar com Suporte
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Localização</h2>
            <Card className="overflow-hidden">
              <div className="h-96 bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">[Mapa interativo seria integrado aqui via Google Maps API]</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
