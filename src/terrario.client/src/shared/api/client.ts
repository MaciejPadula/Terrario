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
  GetRecentAnimalsResponse,
  GetAnimalDetailsResponse,
  UploadAnimalImageResponse,
  DeleteAnimalImageResponse
} from '../../features/animals/shared/types';

// Reminder types
interface Reminder {
  id: string;
  title: string;
  description?: string;
  reminderDateTime: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  isActive: boolean;
  animalId?: string;
  animalName?: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

interface CreateReminderRequest {
  title: string;
  description?: string;
  reminderDateTime: string;
  isRecurring?: boolean;
  recurrencePattern?: string;
  animalId?: string;
}

// FCM Token types
interface SaveFcmTokenRequest {
  token: string;
  deviceId?: string;
}

interface SaveFcmTokenResponse {
  message: string;
}

// In development, use relative URLs to leverage Vite proxy
// In production, use the environment variable or fallback

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');

    const headers = new Headers(options.headers);
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    // Don't force JSON Content-Type when sending FormData.
    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(`${endpoint}`, config);

    if (!response.ok) {
      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        // Clear local storage and trigger logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login page
        window.location.href = '/login';
      }
      
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw error;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      return response.json();
    }

    return (await response.text()) as unknown as T;
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

  async saveFcmToken(data: SaveFcmTokenRequest): Promise<SaveFcmTokenResponse> {
    return this.request<SaveFcmTokenResponse>('/api/auth/save-fcm-token', {
      method: 'POST',
      body: JSON.stringify(data),
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

  async getAnimalDetails(id: string): Promise<GetAnimalDetailsResponse> {
    return this.request<GetAnimalDetailsResponse>(`/api/animals/${id}`, {
      method: 'GET',
    });
  }

  async uploadAnimalImage(animalId: string, file: File): Promise<UploadAnimalImageResponse> {
    const formData = new FormData();
    formData.append('image', file);

    return this.request<UploadAnimalImageResponse>(`/api/animals/${animalId}/image`, {
      method: 'POST',
      body: formData,
    });
  }

  async deleteAnimalImage(animalId: string): Promise<DeleteAnimalImageResponse> {
    return this.request<DeleteAnimalImageResponse>(`/api/animals/${animalId}/image`, {
      method: 'DELETE',
    });
  }

  // Reminders API
  async getRemindersByAnimal(animalId: string): Promise<{ reminders: Reminder[] }> {
    return this.request<{ reminders: Reminder[] }>(`/api/animals/${animalId}/reminders`);
  }

  async getReminders(options?: {
    includeInactive?: boolean;
    from?: string;
    to?: string;
  }): Promise<{ reminders: Reminder[] }> {
    const params = new URLSearchParams();
    if (options?.includeInactive === true) params.set('includeInactive', 'true');
    if (options?.from) params.set('from', options.from);
    if (options?.to) params.set('to', options.to);

    const query = params.toString();
    const url = query ? `/api/reminders?${query}` : '/api/reminders';

    return this.request<{ reminders: Reminder[] }>(url);
  }

  async createReminder(data: CreateReminderRequest): Promise<Reminder> {
    return this.request<Reminder>('/api/reminders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
