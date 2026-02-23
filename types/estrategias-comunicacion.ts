// Tipos para el módulo de Estrategias de Comunicación

// Noticia
export interface Noticia {
  id: number;
  titulo: string;
  descripcion_corta: string;
  contenido: string;
  imagen_url?: string;
  link: string;
  fecha_publicacion: string; // ISO string
  activo: boolean;
  fecha_creacion: string; // ISO string
  fecha_actualizacion: string; // ISO string
}

export interface CreateNoticiaData {
  titulo: string;
  descripcion_corta: string;
  contenido: string;
  imagen_url?: string;
  link: string;
  fecha_publicacion: string; // ISO string
  activo?: boolean;
}

export interface UpdateNoticiaData {
  titulo?: string;
  descripcion_corta?: string;
  contenido?: string;
  imagen_url?: string;
  link: string;
  fecha_publicacion?: string; // ISO string
  activo?: boolean;
}

// Red Social
export interface RedSocial {
  id: number;
  nombre: string;
  descripcion: string;
  url: string;
  icono: string;
  activo: boolean;
  orden: number;
  fecha_creacion: string; // ISO string
  fecha_actualizacion: string; // ISO string
}

export interface CreateRedSocialData {
  nombre: string;
  descripcion: string;
  url: string;
  icono: string;
  orden?: number;
  activo?: boolean;
}

export interface UpdateRedSocialData {
  nombre?: string;
  descripcion?: string;
  url?: string;
  icono?: string;
  orden?: number;
  activo?: boolean;
}

// Estadísticas
export interface EstadisticasEstrategiasComunicacion {
  totalNoticias: number;
  totalNoticiasActivas: number;
  totalNoticiasInactivas: number;
  totalRedesSociales: number;
  totalRedesSocialesActivas: number;
  totalRedesSocialesInactivas: number;
  noticiasPorMes: Array<{
    mes: string;
    cantidad: number;
  }>;
}

// Parámetros de consulta
export interface NoticiasQueryParams {
  skip?: number;
  take?: number;
  activo?: boolean;
  search?: string;
  orderBy?: 'fecha_publicacion' | 'fecha_creacion';
  order?: 'asc' | 'desc';
}

export interface RedesSocialesQueryParams {
  activo?: boolean;
  orderBy?: 'nombre' | 'orden';
  order?: 'asc' | 'desc';
}