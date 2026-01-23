import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api/client';
import type { UploadAnimalImageResponse, DeleteAnimalImageResponse } from '../shared/types';

const uploadAnimalImage = async (animalId: string, file: File): Promise<UploadAnimalImageResponse> =>
  apiClient.uploadAnimalImage(animalId, file);

const deleteAnimalImage = async (animalId: string): Promise<DeleteAnimalImageResponse> =>
  apiClient.deleteAnimalImage(animalId);

export function useUploadAnimalImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ animalId, file }: { animalId: string; file: File }) =>
      uploadAnimalImage(animalId, file),
    onSuccess: (_, variables) => {
      // Invalidate animal details query to refetch with new image
      queryClient.invalidateQueries({ queryKey: ['animal', variables.animalId] });
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });
}

export function useDeleteAnimalImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (animalId: string) => deleteAnimalImage(animalId),
    onSuccess: (_, animalId) => {
      // Invalidate animal details query to refetch without image
      queryClient.invalidateQueries({ queryKey: ['animal', animalId] });
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });
}
