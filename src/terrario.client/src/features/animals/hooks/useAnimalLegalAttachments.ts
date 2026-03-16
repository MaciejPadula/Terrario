import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api/client';
import type { AnimalDetails } from '../shared/types';

export function useLegalAttachments(animalId: string) {
  return useQuery({
    queryKey: ['animals', 'legal-attachments', animalId],
    queryFn: () => apiClient.getLegalAttachments(animalId),
    enabled: !!animalId,
    select: (data) => data.attachments,
  });
}

export function useUploadLegalAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ animalId, file }: { animalId: string; file: File }) =>
      apiClient.uploadLegalAttachment(animalId, file),
    onSuccess: (data, variables) => {
      // Append new attachment to the details cache
      queryClient.setQueryData<AnimalDetails>(
        ['animals', 'details', variables.animalId],
        (old) =>
          old
            ? {
                ...old,
                legalAttachments: [
                  ...old.legalAttachments,
                  data.attachment,
                ],
              }
            : old,
      );
      queryClient.invalidateQueries({ queryKey: ['animals', 'legal-attachments', variables.animalId] });
    },
  });
}

export function useDeleteLegalAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ attachmentId }: { attachmentId: string; animalId: string }) =>
      apiClient.deleteLegalAttachment(attachmentId),
    onSuccess: (_, variables) => {
      queryClient.setQueryData<AnimalDetails>(
        ['animals', 'details', variables.animalId],
        (old) =>
          old
            ? {
                ...old,
                legalAttachments: old.legalAttachments.filter(
                  (a) => a.id !== variables.attachmentId,
                ),
              }
            : old,
      );
      queryClient.invalidateQueries({ queryKey: ['animals', 'legal-attachments', variables.animalId] });
    },
  });
}
