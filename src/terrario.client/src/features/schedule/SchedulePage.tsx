import { Box, Button, Flex, Spinner, Text, VStack } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReminders, type Reminder } from '../reminders/hooks/useReminders';
import type { RecurringInstance } from './utils/recurringHelpers';
import { CalendarGrid } from './components/CalendarGrid';
import { ReminderModal } from './components/ReminderModal';
import {
  addMonths,
  buildMonthGrid,
  getDayNames,
  getMonthLabel,
  startOfDay,
  toLocalDateTimeParam,
} from './utils/dateHelpers';

export function SchedulePage() {
  const { t, i18n } = useTranslation();
  const [viewMonth, setViewMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<{ date: Date; reminders: (Reminder | RecurringInstance)[] } | null>(null);

  const cells = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);
  const range = useMemo(() => {
    const first = cells[0]?.date ?? startOfDay(viewMonth);
    const last = cells[cells.length - 1]?.date ?? startOfDay(viewMonth);
    const from = startOfDay(first);
    const to = startOfDay(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
    return {
      from: toLocalDateTimeParam(from),
      to: toLocalDateTimeParam(to),
    };
  }, [cells, viewMonth]);

  const { data: reminders = [], isLoading } = useReminders({
    includeInactive: true,
    from: range.from,
    to: range.to,
  });

  const monthLabel = useMemo(() => {
    return getMonthLabel(viewMonth, i18n.language || 'en');
  }, [i18n.language, viewMonth]);

  const dayNames = useMemo(() => {
    return getDayNames(i18n.language || 'en');
  }, [i18n.language]);

  const handleDayClick = (date: Date, reminders: (Reminder | RecurringInstance)[]) => {
    setSelectedDay({ date, reminders });
  };

  const handleCloseModal = () => {
    setSelectedDay(null);
  };

  return (
    <VStack align="stretch" gap={6} paddingX={{ base: '0.1rem', md: '0' }}>
      <Flex direction={['column', 'row']} justify="space-between" align={['stretch', 'center']} gap={4}>
        <Text
          fontSize={{ base: '1.75rem', md: '2rem' }}
          fontWeight="bold"
          color="var(--color-primary)"
          lineHeight="1.2"
        >
          📅 {t('pages.schedule')}
        </Text>

        <Flex gap={2} justify={['space-between', 'flex-end']}>
          <Button variant="outline" onClick={() => setViewMonth(addMonths(viewMonth, -1))}>
            {t('schedule.prevMonth')}
          </Button>
          <Button variant="outline" onClick={() => setViewMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}>
            {t('schedule.today')}
          </Button>
          <Button variant="outline" onClick={() => setViewMonth(addMonths(viewMonth, 1))}>
            {t('schedule.nextMonth')}
          </Button>
        </Flex>
      </Flex>

      <Box 
        bg="white" 
        borderRadius="16px" 
        boxShadow="var(--box-shadow-light)" 
        padding={{ base: '0.5rem', md: '1rem' }}
        maxWidth={{ base: '100%', md: '900px' }}
        marginX="auto"
        width="100%"
      >
        <Flex justify="center" paddingY="0.5rem">
          <Text fontWeight="bold" color="var(--color-primary)">
            {monthLabel}
          </Text>
        </Flex>

        {isLoading ? (
          <Flex justify="center" padding="2rem">
            <Spinner color="var(--color-primary)" />
          </Flex>
        ) : (
          <CalendarGrid
            cells={cells}
            dayNames={dayNames}
            reminders={reminders}
            onDayClick={handleDayClick}
          />
        )}
      </Box>

      <ReminderModal
        isOpen={!!selectedDay}
        date={selectedDay?.date ?? null}
        reminders={selectedDay?.reminders ?? []}
        onClose={handleCloseModal}
      />
    </VStack>
  );
}
