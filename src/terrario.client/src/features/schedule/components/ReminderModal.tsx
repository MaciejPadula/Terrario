import {
  DialogRoot,
  DialogBackdrop,
  DialogPositioner,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
} from '@chakra-ui/react';
import { Badge, Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { Reminder } from '../../reminders/hooks/useReminders';

interface ReminderModalProps {
  isOpen: boolean;
  date: Date | null;
  reminders: Reminder[];
  onClose: () => void;
}

export function ReminderModal({ isOpen, date, reminders, onClose }: ReminderModalProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  if (!date) return null;

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent maxWidth={{ base: '90%', md: '600px' }}>
          <DialogHeader>
            <DialogTitle>
              {new Intl.DateTimeFormat(i18n.language || 'en', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }).format(date)}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <VStack align="stretch" gap={3}>
              {reminders.map((r) => {
                const time = new Date(r.reminderDateTime).toLocaleTimeString(i18n.language || 'en', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                const hasAnimal = !!r.animalId;

                return (
                  <Box
                    key={r.id}
                    padding="1rem"
                    borderRadius="12px"
                    border="1px solid"
                    borderColor="var(--color-border-light)"
                    bg={r.isActive ? 'white' : 'gray.50'}
                    opacity={r.isActive ? 1 : 0.8}
                    cursor={hasAnimal ? 'pointer' : 'default'}
                    onClick={() => {
                      if (hasAnimal) {
                        onClose();
                        navigate(`/animals/${r.animalId}`);
                      }
                    }}
                    _hover={hasAnimal ? { bg: 'gray.100', transform: 'translateY(-2px)', boxShadow: 'md' } : undefined}
                    transition="all 0.2s"
                  >
                    <Flex justify="space-between" align="start" marginBottom={2}>
                      <VStack align="start" gap={1} flex="1">
                        <Text fontWeight="bold" color="gray.800">
                          {r.title}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {time}
                        </Text>
                      </VStack>
                      <Badge
                        colorPalette={r.isActive ? 'green' : 'gray'}
                        variant="subtle"
                      >
                        {r.isActive ? t('schedule.active') : t('schedule.inactive')}
                      </Badge>
                    </Flex>

                    {r.description && (
                      <Text fontSize="sm" color="gray.700" marginTop={2}>
                        {r.description}
                      </Text>
                    )}

                    {r.animalName && (
                      <Flex align="center" gap={2} marginTop={2}>
                        <Text fontSize="sm" color="gray.600">
                          🦎 {r.animalName}
                        </Text>
                      </Flex>
                    )}

                    {r.isRecurring && r.recurrencePattern && (
                      <Flex align="center" gap={2} marginTop={2}>
                        <Badge colorPalette="blue" variant="subtle" size="sm">
                          🔁 {r.recurrencePattern}
                        </Badge>
                      </Flex>
                    )}
                  </Box>
                );
              })}
            </VStack>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline" onClick={onClose}>
                {t('common.close')}
              </Button>
            </DialogActionTrigger>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
}
