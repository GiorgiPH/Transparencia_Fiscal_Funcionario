import { apiClient } from '@/lib/api/axios-client';
import type {
  Noticia,
  RedSocial,
  CreateNoticiaData,
  UpdateNoticiaData,
  CreateRedSocialData,
  UpdateRedSocialData,
  EstadisticasEstrategiasComunicacion,
  NoticiasQueryParams,
  RedesSocialesQueryParams
} from '@/types/estrategias-comunicacion';

export const estrategiasComunicacionService = {
  // Noticias - Endpoints administrativos
  
  async getNoticias(params?: NoticiasQueryParams): Promise<Noticia[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.take !== undefined) queryParams.append('take', params.take.toString());
    if (params?.activo !== undefined) queryParams.append('activo', params.activo.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
    if (params?.order) queryParams.append('order', params.order);
    
    const queryString = queryParams.toString();
    const url = `/estrategias-comunicacion/admin/noticias${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<Noticia[]>(url);
  },

  async getNoticiaById(id: number): Promise<Noticia> {
    return apiClient.get<Noticia>(`/estrategias-comunicacion/admin/noticias/${id}`);
  },

  async createNoticia(data: CreateNoticiaData, file?: File): Promise<Noticia> {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      
      if (typeof value === 'boolean') {
        formData.append(key, value.toString());
      } else {
        formData.append(key, value);
      }
    });
    
    if (file) {
      formData.append('imagen', file);
    }
    
    return apiClient.post<Noticia>(
      '/estrategias-comunicacion/admin/noticias',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },

  async updateNoticia(id: number, data: UpdateNoticiaData, file?: File): Promise<Noticia> {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      
      if (typeof value === 'boolean') {
        formData.append(key, value.toString());
      } else {
        formData.append(key, value);
      }
    });
    
    if (file) {
      formData.append('imagen', file);
    }
    
    return apiClient.patch<Noticia>(
      `/estrategias-comunicacion/admin/noticias/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },

  async toggleNoticiaActivo(id: number, activo: boolean): Promise<Noticia> {
    return apiClient.patch<Noticia>(`/estrategias-comunicacion/admin/noticias/${id}/activo`, { activo });
  },

  async deleteNoticia(id: number): Promise<void> {
    return apiClient.delete(`/estrategias-comunicacion/admin/noticias/${id}`);
  },

  // Redes Sociales - Endpoints administrativos
  
  async getRedesSociales(params?: RedesSocialesQueryParams): Promise<RedSocial[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.activo !== undefined) queryParams.append('activo', params.activo.toString());
    if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
    if (params?.order) queryParams.append('order', params.order);
    
    const queryString = queryParams.toString();
    const url = `/estrategias-comunicacion/admin/redes-sociales${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<RedSocial[]>(url);
  },

  async getRedSocialById(id: number): Promise<RedSocial> {
    return apiClient.get<RedSocial>(`/estrategias-comunicacion/admin/redes-sociales/${id}`);
  },

  async createRedSocial(data: CreateRedSocialData): Promise<RedSocial> {
    return apiClient.post<RedSocial>('/estrategias-comunicacion/admin/redes-sociales', data);
  },

  async updateRedSocial(id: number, data: UpdateRedSocialData): Promise<RedSocial> {
    return apiClient.patch<RedSocial>(`/estrategias-comunicacion/admin/redes-sociales/${id}`, data);
  },

  async toggleRedSocialActivo(id: number, activo: boolean): Promise<RedSocial> {
    return apiClient.patch<RedSocial>(`/estrategias-comunicacion/admin/redes-sociales/${id}/activo`, { activo });
  },

  async deleteRedSocial(id: number): Promise<void> {
    return apiClient.delete(`/estrategias-comunicacion/admin/redes-sociales/${id}`);
  },

  // Estadísticas
  
  async getEstadisticas(): Promise<EstadisticasEstrategiasComunicacion> {
    return apiClient.get<EstadisticasEstrategiasComunicacion>('/estrategias-comunicacion/admin/estadisticas');
  },

  async countNoticias(activo?: boolean): Promise<number> {
    const queryParams = new URLSearchParams();
    if (activo !== undefined) queryParams.append('activo', activo.toString());
    
    const queryString = queryParams.toString();
    const url = `/estrategias-comunicacion/admin/noticias/count${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<number>(url);
  },

  async countRedesSociales(activo?: boolean): Promise<number> {
    const queryParams = new URLSearchParams();
    if (activo !== undefined) queryParams.append('activo', activo.toString());
    
    const queryString = queryParams.toString();
    const url = `/estrategias-comunicacion/admin/redes-sociales/count${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<number>(url);
  },

  // Endpoints públicos
  
  async getNoticiasPublicas(params?: Omit<NoticiasQueryParams, 'activo'>): Promise<Noticia[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.take !== undefined) queryParams.append('take', params.take.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
    if (params?.order) queryParams.append('order', params.order);
    
    const queryString = queryParams.toString();
    const url = `/estrategias-comunicacion/noticias${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<Noticia[]>(url);
  },

  async getNoticiasRecientesPublicas(limit?: number): Promise<Noticia[]> {
    const queryParams = new URLSearchParams();
    if (limit !== undefined) queryParams.append('limit', limit.toString());
    
    const queryString = queryParams.toString();
    const url = `/estrategias-comunicacion/noticias/recientes${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<Noticia[]>(url);
  },

  async getNoticiaPublicaById(id: number): Promise<Noticia> {
    return apiClient.get<Noticia>(`/estrategias-comunicacion/noticias/${id}`);
  },

  async getRedesSocialesPublicas(): Promise<RedSocial[]> {
    return apiClient.get<RedSocial[]>('/estrategias-comunicacion/redes-sociales');
  },
};