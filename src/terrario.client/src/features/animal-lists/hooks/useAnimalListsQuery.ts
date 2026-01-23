import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api/client';
import type { CreateListRequest, UpdateListRequest } from '../shared/types';

export function useAnimalListsQuery() {
  return useQuery({
    queryKey: ['animalLists'],
    queryFn: async () => {
      const response = await apiClient.getLists();
      return response.lists;
    },
  });
}

export function useAnimalListsCount() {
  return useQuery({
    queryKey: ['animalLists', 'count'],
    queryFn: async () => {
      const response = await apiClient.getLists();
      return response.totalCount;
    },
  });
}

export function useCreateAnimalList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateListRequest) => {
      return apiClient.createList(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animalLists'] });
    },
  });
}

export function useUpdateAnimalList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateListRequest }) => {
      return apiClient.updateList(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animalLists'] });
    },
  });
}

export function useDeleteAnimalList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.deleteList(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animalLists'] });
    },
  });
}
