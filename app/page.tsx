import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Lightbulb, Rocket, Users, TrendingUp, Building2, GraduationCap, UserPlus } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden hero-animated">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Impulsionando a <span className="text-primary">Inovação</span> no Maranhão
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-balance leading-relaxed">
              Transformando ideias em negócios inovadores e fomentando a cultura de inovação nas empresas maranhenses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-glow" asChild>
                <Link href="/agenda">Junte-se ao Ecossistema</Link>
              </Button>
              <Button size="lg" variant="outline" className="btn-glow" asChild>
                <Link href="/hubs">Conheça os Hubs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold stat-glow mb-2">5</div>
              <div className="text-muted-foreground">Instituições Parceiras</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold stat-glow mb-2">4</div>
              <div className="text-muted-foreground">Hubs Físicos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold stat-glow mb-2">100+</div>
              <div className="text-muted-foreground">Startups Apoiadas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold stat-glow mb-2">500+</div>
              <div className="text-muted-foreground">Empreendedores</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Text Content */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">O que é o Ecossistema de Inovação?</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    Empresas, universidades, instituições e governos se unem para criar um ambiente colaborativo e inovador,
                    em que todos trabalham juntos e compartilham resultados em comum, proporcionando uma intensa troca de
                    experiências.
                  </p>
                </div>
              </div>

              {/* Ecosystem Flow Diagram */}
              <div className="relative">
                <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-2xl p-6">
                  
                  {/* Circular Layout */}
                  <div className="relative w-80 h-80 mx-auto">
                    {/* Center */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="text-center px-4 py-2 bg-background border-2 border-primary/20 rounded-lg shadow-sm">
                        <div className="text-sm font-bold text-primary">ECOSSISTEMA</div>
                      </div>
                    </div>

                    {/* Top */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 mx-auto">
                          <Users className="text-primary" size={20} />
                        </div>
                        <div className="text-xs font-medium">COMUNIDADE</div>
                        <div className="text-xs text-muted-foreground">
                          NEGÓCIOS<br/>TECNOLOGIA<br/>DESIGN
                        </div>
                      </div>
                    </div>

                    {/* Top Right */}
                    <div className="absolute top-6 right-0">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-2 mx-auto">
                          <GraduationCap className="text-secondary" size={20} />
                        </div>
                        <div className="text-xs font-medium">INSTITUIÇÃO</div>
                        <div className="text-xs text-muted-foreground">DE ENSINO</div>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-2 mx-auto">
                          <Rocket className="text-accent" size={20} />
                        </div>
                        <div className="text-xs font-medium">STARTUP</div>
                      </div>
                    </div>

                    {/* Bottom Right */}
                    <div className="absolute bottom-6 right-0">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-2 mx-auto">
                          <Building2 className="text-secondary" size={20} />
                        </div>
                        <div className="text-xs font-medium">HABITAT</div>
                        <div className="text-xs text-muted-foreground">ACELERADORA</div>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 mx-auto">
                          <Building2 className="text-primary" size={20} />
                        </div>
                        <div className="text-xs font-medium">INSTITUIÇÃO</div>
                        <div className="text-xs text-muted-foreground">DE APOIO</div>
                      </div>
                    </div>

                    {/* Bottom Left */}
                    <div className="absolute bottom-6 left-0">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-2 mx-auto">
                          <Users className="text-accent" size={20} />
                        </div>
                        <div className="text-xs font-medium">MENTOR</div>
                      </div>
                    </div>

                    {/* Left */}
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-2 mx-auto">
                          <TrendingUp className="text-secondary" size={20} />
                        </div>
                        <div className="text-xs font-medium">INSTITUIÇÃO</div>
                        <div className="text-xs text-muted-foreground">DE FOMENTO</div>
                      </div>
                    </div>

                    {/* Top Left */}
                    <div className="absolute top-6 left-0">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 mx-auto">
                          <Building2 className="text-primary" size={20} />
                        </div>
                        <div className="text-xs font-medium">INSTITUIÇÃO</div>
                        <div className="text-xs text-muted-foreground">DE PESQUISA</div>
                      </div>
                    </div>

                    {/* Connecting lines */}
                    <div className="absolute inset-0 pointer-events-none">
                      <svg className="w-full h-full opacity-20">
                        <circle
                          cx="50%"
                          cy="50%"
                          r="120"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                          className="text-primary"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Participate Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <UserPlus className="text-primary" size={32} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Quem Pode Participar?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Todos que possam contribuir para um ambiente de negócios favorável à inovação: sociedade,
                empreendedores, empresas, entidades, acadêmicos, e pessoas que tenham ideias e necessitem de mentorias e
                acompanhamento para desenvolvê-las.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card card-hover-glow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Building2 className="text-primary" size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Empresas e Empreendedores</h4>
                      <p className="text-sm text-muted-foreground">
                        Negócios em busca de inovação, crescimento e conexão com o mercado
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card card-hover-glow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <GraduationCap className="text-secondary" size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Acadêmicos e Estudantes</h4>
                      <p className="text-sm text-muted-foreground">
                        Pesquisadores, professores e alunos interessados em inovação e tecnologia
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Lightbulb className="text-accent" size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Pessoas com Ideias</h4>
                      <p className="text-sm text-muted-foreground">
                        Indivíduos que precisam de mentoria e acompanhamento para desenvolver projetos
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Users className="text-primary" size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Entidades e Sociedade</h4>
                      <p className="text-sm text-muted-foreground">
                        Organizações e comunidade interessadas em fomentar a inovação regional
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que participar?</h2>
            <p className="text-lg text-muted-foreground">Benefícios para toda a comunidade</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Para Empresas</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Acesso a inovação e novas tecnologias</li>
                  <li>• Capacitação e consultoria especializada</li>
                  <li>• Networking com startups e parceiros</li>
                  <li>• Aumento de competitividade</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="text-secondary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Para Startups</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Espaço de coworking gratuito</li>
                  <li>• Mentoria e aceleração</li>
                  <li>• Acesso a investidores</li>
                  <li>• Conexão com o mercado</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="text-accent" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Para Estudantes</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Cursos e workshops gratuitos</li>
                  <li>• Networking com empreendedores</li>
                  <li>• Oportunidades de estágio</li>
                  <li>• Desenvolvimento de projetos</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-cta text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Traga sua ideia inovadora</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Junte-se a centenas de empreendedores que estão transformando o Maranhão. Reserve seu espaço nos nossos hubs
            e comece hoje mesmo!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-glow bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <Link href="/agenda">Agendar Visita</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary btn-glow"
              asChild
            >
              <Link href="/contato">Fale Conosco</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
