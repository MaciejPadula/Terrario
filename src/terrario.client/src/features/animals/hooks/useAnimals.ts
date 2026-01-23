import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api/client';
import type { UpdateAnimalRequest } from '../shared/types';

export function useAnimals(listId?: string, speciesId?: string, searchTerm?: string) {
  return useQuery({
    queryKey: ['animals', { listId, speciesId, searchTerm }],
    queryFn: async () => {
      const response = await apiClient.getAnimals(listId, speciesId, searchTerm);
      return response.animals;
    },
  });
}

export function useRecentAnimals(limit: number = 8) {
  return useQuery({
    queryKey: ['animals', 'recent', limit],
    queryFn: async () => {
      const response = await apiClient.getRecentAnimals(limit);
      return response.recentAnimals;
    },
  });
}

export function useAnimalsCount() {
  return useQuery({
    queryKey: ['animals', 'count'],
    queryFn: async () => {
      const response = await apiClient.getAnimals();
      return response.totalCount;
    },
  });
}

export function useUpdateAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAnimalRequest }) => {
      return apiClient.updateAnimal(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });
}

export function useDeleteAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.deleteAnimal(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });
}

export function useCreateAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; speciesId: string; animalListId: string }) => {
      return apiClient.createAnimal(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });
}
