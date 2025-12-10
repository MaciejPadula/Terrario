import type { LoginRequest, RegisterRequest, AuthResponse } from '../../features/auth/shared/types';
import type { 
  CreateListRequest, 
  CreateListResponse, 
  GetListsResponse,
  UpdateListRequest,
  UpdateListResponse,
  DeleteListResponse
} from '../../features/animal-lists/shared/types';
import type { GetSpeciesResponse, GetCategoriesResponse } from '../../features/species/shared/types';

// In development, use relative URLs to leverage Vite proxy
// In production, use the environment variable or fallback

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw error;
    }

    return response.json();
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    await this.request<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    });
  }

  // Animal Lists API
  async getLists(): Promise<GetListsResponse> {
    return this.request<GetListsResponse>('/api/lists', {
      method: 'GET',
    });
  }

  async createList(data: CreateListRequest): Promise<CreateListResponse> {
    return this.request<CreateListResponse>('/api/lists', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateList(id: string, data: UpdateListRequest): Promise<UpdateListResponse> {
    return this.request<UpdateListResponse>(`/api/lists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteList(id: string): Promise<DeleteListResponse> {
    return this.request<DeleteListResponse>(`/api/lists/${id}`, {
      method: 'DELETE',
    });
  }

  // Species API
  async getSpecies(categoryId?: string, search?: string): Promise<GetSpeciesResponse> {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId);
    if (search) params.append('search', search);
    
    const query = params.toString();
    const url = query ? `/api/species?${query}` : '/api/species';
    
    return this.request<GetSpeciesResponse>(url, {
      method: 'GET',
    });
  }

  async getSpeciesCategories(): Promise<GetCategoriesResponse> {
    return this.request<GetCategoriesResponse>('/api/species/categories', {
      method: 'GET',
    });
  }
}

export const apiClient = new ApiClient();
