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
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export function useReminders(options?: { includeInactive?: boolean; from?: string; to?: string }) {
  const includeInactive = options?.includeInactive === true;
  const from = options?.from;
  const to = options?.to;

  return useQuery({
    queryKey: ['reminders', 'range', { includeInactive, from, to }],
    queryFn: async (): Promise<Reminder[]> => {
      const response = await apiClient.getReminders({ includeInactive, from, to });
      return response.reminders;
    },
  });
}
