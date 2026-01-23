import { Badge, Box, Flex, Text } from '@chakra-ui/react';
import type { Reminder } from '../../reminders/hooks/useReminders';
import type { RecurringInstance } from '../utils/recurringHelpers';
import type { DayCell as DayCellType } from '../utils/dateHelpers';

interface DayCellProps {
  cell: DayCellType;
  reminders: (Reminder | RecurringInstance)[];
  isToday: boolean;
  onDayClick: (date: Date, reminders: (Reminder | RecurringInstance)[]) => void;
}

export function DayCell({ cell, reminders, isToday, onDayClick }: DayCellProps) {
  const hasReminders = reminders.length > 0;

  return (
    <Box
      borderRadius="12px"
      border="2px solid"
      borderColor={isToday ? 'var(--color-primary-light)' : 'var(--color-border-light)'}
      bg={cell.isCurrentMonth ? 'white' : 'gray.50'}
      padding="0.5rem"
      height={{ base: '70px', md: '90px' }}
      cursor={hasReminders ? 'pointer' : 'default'}
      onClick={() => {
        if (hasReminders) {
          onDayClick(cell.date, reminders);
        }
      }}
      _hover={hasReminders ? { bg: 'gray.100', transform: 'scale(1.02)' } : undefined}
      transition="all 0.2s"
    >
      <Flex direction="column" align="center" justify="flex-start" height="100%" gap={2}>
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          fontWeight={cell.isCurrentMonth ? 'bold' : 'medium'}
          color={cell.isCurrentMonth ? 'gray.800' : 'gray.500'}
          lineHeight="1.2"
        >
          {cell.date.getDate()}
        </Text>
        {hasReminders && (
          <Badge colorPalette="green" variant="solid" size="sm">
            {reminders.length}
          </Badge>
        )}
      </Flex>
    </Box>
  );
}
