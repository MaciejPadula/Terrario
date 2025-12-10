// Types for Animal Lists feature

export interface AnimalList {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateListRequest {
  name: string;
  description?: string;
}

export interface CreateListResponse {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface GetListsResponse {
  lists: AnimalList[];
  totalCount: number;
}

export interface UpdateListRequest {
  name: string;
  description?: string;
}

export interface UpdateListResponse {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeleteListResponse {
  message: string;
}
