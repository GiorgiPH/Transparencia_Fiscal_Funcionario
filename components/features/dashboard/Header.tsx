"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, LogOut, UserIcon } from "lucide-react"
import { APP_NAME, APP_SUBTITLE } from "@/lib/constants"
import { useAuth } from "@/hooks/useAuth"
import { useState, useEffect } from "react"

export function Header() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check initial dark mode state
    const isDark = document.documentElement.classList.contains("dark")
    setIsDarkMode(isDark)
  }, [])

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark")
    setIsDarkMode(!isDarkMode)
  }

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const initials = user?.nombre
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 border-b bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Title Section */}
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-primary">{APP_NAME}</h1>
          <span className="text-sm text-muted-foreground">|</span>
          <span className="text-sm font-medium text-accent">{APP_SUBTITLE}</span>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="h-9 w-9">
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.fotoPerfil || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary text-xs text-primary-foreground">{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium">{user?.nombre}</p>
                  <p className="text-xs text-muted-foreground">{user?.rol}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard/configuracion")}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
