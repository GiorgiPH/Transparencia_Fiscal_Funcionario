"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NAVIGATION_ITEMS } from "@/lib/constants"
import { Home, BookOpen, Settings, Users, Megaphone } from "lucide-react"
import type { User } from "@/types/auth"

interface SidebarProps {
  user: User | null
}

const iconMap = {
  home: Home,
  catalogs: BookOpen,
  "estrategias-comunicacion": Megaphone,
  config: Settings,
  users: Users,
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  const visibleItems = NAVIGATION_ITEMS.filter((item) => {
    if (item.adminOnly) {
      return user?.rol === "Admin"
    }
    return true
  })

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-sidebar">
      <div className="flex h-full flex-col">
         {/* Logo Section */}
        <div className="border-b p-6">
          <div className="flex items-center justify-center">
            <img
              src="/transparencia-fiscal-operativo/Hacienda-Header-Izquierdo.png"
              alt="Logo Portal Transparencia Fiscal"
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {visibleItems.map((item) => {
            const Icon = iconMap[item.id as keyof typeof iconMap]
            const isActive = pathname === item.path

            return (
              <Link
                key={item.id}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer Info */}
        <div className="border-t p-4">
          <div className="rounded-lg bg-muted/30 p-3">
            <p className="text-xs font-medium text-sidebar-foreground">Gobierno de Morelos</p>
            <p className="mt-1 text-xs text-muted-foreground">Secretaría de Administración</p>
          </div>
        </div>
      </div>
    </aside>
  )
}