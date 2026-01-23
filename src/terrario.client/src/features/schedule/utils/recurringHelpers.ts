import type { Reminder } from '../../reminders/hooks/useReminders';
import { startOfDay, toDayKey } from './dateHelpers';

export type RecurringInstance = Reminder & {
  isVirtualInstance: boolean;
  originalReminderId: string;
  instanceDate: Date;
};

/**
 * Generates virtual instances of recurring reminders within a date range
 */
export function expandRecurringReminders(
  reminders: Reminder[],
  fromDate: Date,
  toDate: Date
): (Reminder | RecurringInstance)[] {
  const expanded: (Reminder | RecurringInstance)[] = [];

  for (const reminder of reminders) {
    // Add the original reminder
    expanded.push(reminder);

    // If it's recurring, generate additional instances
    if (reminder.isRecurring && reminder.recurrencePattern) {
      const instances = generateRecurringInstances(reminder, fromDate, toDate);
      expanded.push(...instances);
    }
  }

  return expanded;
}

function generateRecurringInstances(
  reminder: Reminder,
  fromDate: Date,
  toDate: Date
): RecurringInstance[] {
  const instances: RecurringInstance[] = [];
  const originalDate = new Date(reminder.reminderDateTime);
  const pattern = reminder.recurrencePattern?.toLowerCase();

  if (!pattern) return instances;

  let currentDate = new Date(originalDate);
  const maxIterations = 1000; // Safety limit
  let iterations = 0;

  while (currentDate <= toDate && iterations < maxIterations) {
    // Move to next occurrence based on pattern
    switch (pattern) {
      case 'daily':
        currentDate = addDays(currentDate, 1);
        break;
      case 'weekly':
        currentDate = addDays(currentDate, 7);
        break;
      case 'monthly':
        currentDate = addMonths(currentDate, 1);
        break;
      case 'yearly':
        currentDate = addYears(currentDate, 1);
        break;
      default:
        // Unknown pattern, stop
        return instances;
    }

    iterations++;

    // If the new date is within range and not the original date, add it
    if (currentDate >= fromDate && currentDate <= toDate) {
      const dayKey = toDayKey(startOfDay(currentDate));
      const originalDayKey = toDayKey(startOfDay(originalDate));
      
      // Don't duplicate the original reminder's day
      if (dayKey !== originalDayKey) {
        instances.push({
          ...reminder,
          id: `${reminder.id}-instance-${dayKey}`,
          reminderDateTime: currentDate.toISOString(),
          isVirtualInstance: true,
          originalReminderId: reminder.id,
          instanceDate: new Date(currentDate),
        });
      }
    }
  }

  return instances;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}
