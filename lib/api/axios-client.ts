import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { authStore, tokenHelper } from '@/lib/stores/auth-store';
import type { AuthTokens } from '@/types/auth';

// Interfaces for API responses
export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  errors?: Array<{ field: string; message: string }>;
  timestamp: string;
  path: string;
}

// Token refresh function
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = authStore.getState().getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Call refresh token endpoint
    const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string; expiresIn: string }>>(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/refresh`,
      { refreshToken }
    );

    const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data.data;
    
    // Update store with new tokens
    const currentUser = authStore.getState().user;
    if (currentUser) {
      const tokens: AuthTokens = {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn
      };
      authStore.getState().login(currentUser, tokens);
      tokenHelper.saveTokens(tokens);
    }

    return accessToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    authStore.getState().logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }
};

class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
    config: AxiosRequestConfig;
  }> = [];

  constructor() {
    this.instance = axios.create({
      baseURL: /*process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'*/ 'http://localhost:3001',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - attach token automatically
    this.instance.interceptors.request.use(
      (config) => {
        const token = authStore.getState().getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors and token refresh
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as any;

        // If error is 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, add to queue
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject, config: originalRequest });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              // Update the failed requests with new token
              this.failedQueue.forEach(({ resolve, reject, config }) => {
                if (config.headers) {
                  config.headers.Authorization = `Bearer ${newAccessToken}`;
                } else {
                  config.headers = { Authorization: `Bearer ${newAccessToken}` };
                }
                this.instance
                  .request(config)
                  .then(resolve)
                  .catch(reject);
              });
              this.failedQueue = [];

              // Retry the original request
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              } else {
                originalRequest.headers = { Authorization: `Bearer ${newAccessToken}` };
              }
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear queue and logout
            this.failedQueue.forEach(({ reject }) => reject(refreshError));
            this.failedQueue = [];
            authStore.getState().logout();
            
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          } finally {
            this.isRefreshing = false;
          }
        }

        // Format error for consistency
        const apiError: ApiError = error.response?.data || {
          statusCode: error.response?.status || 500,
          message: error.message || 'Error de conexión',
          error: 'Network Error',
          timestamp: new Date().toISOString(),
          path: originalRequest?.url || '',
        };

        return Promise.reject(apiError);
      }
    );
  }

  // HTTP methods that return only data
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  // Method to get full response (including message, statusCode, etc.)
  async getFullResponse<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  // Raw axios instance for advanced use cases
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

export const apiClient = new ApiClient();
