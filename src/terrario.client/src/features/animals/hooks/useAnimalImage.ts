import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api/client';
import type { UploadAnimalImageResponse, DeleteAnimalImageResponse, AnimalDetails } from '../shared/types';

const uploadAnimalImage = async (animalId: string, file: File): Promise<UploadAnimalImageResponse> =>
  apiClient.uploadAnimalImage(animalId, file);

const deleteAnimalImage = async (animalId: string): Promise<DeleteAnimalImageResponse> =>
  apiClient.deleteAnimalImage(animalId);

export function useUploadAnimalImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ animalId, file }: { animalId: string; file: File }) =>
      uploadAnimalImage(animalId, file),
    onSuccess: (data, variables) => {
      // Immediately update the cache so the new image appears without waiting for refetch
      queryClient.setQueryData<AnimalDetails>(
        ['animals', 'details', variables.animalId],
        (old) => old ? { ...old, imageUrl: data.imageUrl } : old,
      );
      queryClient.invalidateQueries({ queryKey: ['animals', 'details', variables.animalId] });
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });
}

export function useDeleteAnimalImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (animalId: string) => deleteAnimalImage(animalId),
    onSuccess: (_, animalId) => {
      // Immediately clear the image URL in cache — prevents stale data from
      // briefly re-showing the deleted image while the background refetch runs.
      queryClient.setQueryData<AnimalDetails>(
        ['animals', 'details', animalId],
        (old) => old ? { ...old, imageUrl: undefined } : old,
      );
      queryClient.invalidateQueries({ queryKey: ['animals', 'details', animalId] });
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });
}
