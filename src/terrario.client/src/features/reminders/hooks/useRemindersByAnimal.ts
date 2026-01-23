import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api/client';

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  reminderDateTime: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  isActive: boolean;
  animalId?: string;
  animalName?: string;
  createdAt: string;
}

export function useRemindersByAnimal(animalId: string) {
  return useQuery({
    queryKey: ['reminders', 'animal', animalId],
    queryFn: async (): Promise<Reminder[]> => {
      const response = await apiClient.getRemindersByAnimal(animalId);
      return response.reminders;
    },
    enabled: !!animalId,
  });
}