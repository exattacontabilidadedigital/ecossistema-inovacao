import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="images/ecossistema_logo-removebg-preview.png"
                alt="Ecossistema de Inovação Açailândia"
                width={200}
                height={60}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-muted-foreground text-sm">Transformando ideias em negócios inovadores</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/hubs" className="text-muted-foreground hover:text-foreground">
                  Hubs
                </Link>
              </li>
              <li>
                <Link href="/agenda" className="text-muted-foreground hover:text-foreground">
                  Agenda
                </Link>
              </li>
              <li>
                <Link href="/atores" className="text-muted-foreground hover:text-foreground">
                  Atores
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-muted-foreground hover:text-foreground">
                  Administração
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>(98) 3234-5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>contato@ecoinovacao.ma.gov.br</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Açailândia, MA</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Ecossistema de Inovação de Açailândia-MA. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
