import { CONTACT_INFO } from "@/lib/constants"
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-card">
      <div className="px-6 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Organization Info */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">Secretaría de Administración y Finanzas</h3>
            <p className="text-sm text-muted-foreground">Poder Ejecutivo del Gobierno del Estado de Morelos</p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">Contacto</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>
                  {CONTACT_INFO.phone} Ext. {CONTACT_INFO.extension}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-accent">
                  {CONTACT_INFO.email}
                </a>
              </div>
            </div>
          </div>

          {/* Location & Social */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">Ubicación</h3>
            <div className="mb-3 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span className="text-pretty">{CONTACT_INFO.address}</span>
            </div>
            <div className="flex gap-3">
              <a
                href={CONTACT_INFO.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-accent"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={CONTACT_INFO.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-accent"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={CONTACT_INFO.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-accent"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t pt-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Gobierno del Estado de Morelos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
