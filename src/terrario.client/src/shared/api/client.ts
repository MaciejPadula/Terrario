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
import type {
  CreateAnimalRequest,
  CreateAnimalResponse,
  UpdateAnimalRequest,
  UpdateAnimalResponse,
  GetAnimalsResponse,
  DeleteAnimalResponse,
  GetRecentAnimalsResponse
} from '../../features/animals/shared/types';

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

  // Animals API
  async getAnimals(animalListId?: string, speciesId?: string, search?: string): Promise<GetAnimalsResponse> {
    const params = new URLSearchParams();
    if (animalListId) params.append('animalListId', animalListId);
    if (speciesId) params.append('speciesId', speciesId);
    if (search) params.append('search', search);
    
    const query = params.toString();
    const url = query ? `/api/animals?${query}` : '/api/animals';
    
    return this.request<GetAnimalsResponse>(url, {
      method: 'GET',
    });
  }

  async createAnimal(data: CreateAnimalRequest): Promise<CreateAnimalResponse> {
    return this.request<CreateAnimalResponse>('/api/animals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAnimal(id: string, data: UpdateAnimalRequest): Promise<UpdateAnimalResponse> {
    return this.request<UpdateAnimalResponse>(`/api/animals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAnimal(id: string): Promise<DeleteAnimalResponse> {
    return this.request<DeleteAnimalResponse>(`/api/animals/${id}`, {
      method: 'DELETE',
    });
  }

  async getRecentAnimals(limit?: number): Promise<GetRecentAnimalsResponse> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    
    const query = params.toString();
    const url = query ? `/api/animals/recent?${query}` : '/api/animals/recent';
    
    return this.request<GetRecentAnimalsResponse>(url, {
      method: 'GET',
    });
  }
}

export const apiClient = new ApiClient();
