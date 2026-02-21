export const APP_NAME = "PTF - Portal de Transparencia Fiscal"
export const APP_SUBTITLE = "Funcionario"

export const CONTACT_INFO = {
  phone: "777 329 2200",
  extension: "123",
  email: "utfiscal@morelos.gob.mx",
  address: "Palacio de Gobierno del Estado de Morelos, Plaza de Armas s/n, Colonia Centro, Cuernavaca, Morelos, México",
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
  },
}

export const NAVIGATION_ITEMS = [
  { id: "home", label: "HOME", path: "/dashboard" },
  { id: "catalogs", label: "CATÁLOGOS", path: "/dashboard/catalogos" },
  { id: "estrategias-comunicacion", label: "ESTRATEGIAS DE COMUNICACIÓN", path: "/dashboard/estrategias-comunicacion" },
  { id: "config", label: "CONFIGURACIÓN", path: "/dashboard/configuracion" },
  { id: "users", label: "USUARIOS", path: "/dashboard/usuarios", adminOnly: true },
]

export const USER_ROLES = ["Admin", "Upload", "Edit"] as const