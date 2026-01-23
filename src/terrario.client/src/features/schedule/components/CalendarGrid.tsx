import { Box, Grid, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import type { Reminder } from '../../reminders/hooks/useReminders';
import { DayCell } from './DayCell';
import { startOfDay, toDayKey, type DayCell as DayCellType } from '../utils/dateHelpers';
import { expandRecurringReminders, type RecurringInstance } from '../utils/recurringHelpers';

interface CalendarGridProps {
  cells: DayCellType[];
  dayNames: string[];
  reminders: Reminder[];
  onDayClick: (date: Date, reminders: (Reminder | RecurringInstance)[]) => void;
}

export function CalendarGrid({ cells, dayNames, reminders, onDayClick }: CalendarGridProps) {
  // Expand recurring reminders for the visible date range
  const expandedReminders = useMemo(() => {
    if (cells.length === 0) return reminders;
    const firstDate = cells[0]?.date ?? new Date();
    const lastDate = cells[cells.length - 1]?.date ?? new Date();
    return expandRecurringReminders(reminders, firstDate, lastDate);
  }, [reminders, cells]);

  const remindersByDay = useMemo(() => {
    const map = new Map<string, (Reminder | RecurringInstance)[]>();

    for (const r of expandedReminders) {
      const dt = new Date(r.reminderDateTime);
      const key = toDayKey(startOfDay(dt));
      const arr = map.get(key);
      if (arr) {
        arr.push(r);
      } else {
        map.set(key, [r]);
      }
    }

    // Sort within day by time
    for (const [key, list] of map.entries()) {
      list.sort((a, b) => new Date(a.reminderDateTime).getTime() - new Date(b.reminderDateTime).getTime());
      map.set(key, list);
    }

    return map;
  }, [expandedReminders]);

  const todayKey = useMemo(() => toDayKey(startOfDay(new Date())), []);

  return (
    <>
      <Grid templateColumns="repeat(7, 1fr)" gap={2} marginBottom={2}>
        {dayNames.map((name) => (
          <Box key={name} textAlign="center" paddingY="0.25rem">
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              {name}
            </Text>
          </Box>
        ))}
      </Grid>

      <Grid templateColumns="repeat(7, 1fr)" gap={2}>
        {cells.map((cell) => {
          const dayReminders = remindersByDay.get(cell.key) ?? [];
          const isToday = cell.key === todayKey;

          return (
            <DayCell
              key={cell.key}
              cell={cell}
              reminders={dayReminders}
              isToday={isToday}
              onDayClick={onDayClick}
            />
          );
        })}
      </Grid>
    </>
  );
}
