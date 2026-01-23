import { Box, Grid, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import type { Reminder } from '../../reminders/hooks/useReminders';
import { DayCell } from './DayCell';
import { startOfDay, toDayKey, type DayCell as DayCellType } from '../utils/dateHelpers';

interface CalendarGridProps {
  cells: DayCellType[];
  dayNames: string[];
  reminders: Reminder[];
  onDayClick: (date: Date, reminders: Reminder[]) => void;
}

export function CalendarGrid({ cells, dayNames, reminders, onDayClick }: CalendarGridProps) {
  const remindersByDay = useMemo(() => {
    const map = new Map<string, Reminder[]>();

    for (const r of reminders) {
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
  }, [reminders]);

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
