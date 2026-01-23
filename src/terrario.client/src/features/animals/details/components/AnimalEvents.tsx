import { Box, Card, Text, VStack, Badge, Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useRemindersByAnimal } from '../../../reminders/hooks/useRemindersByAnimal';
import { CreateReminderModal } from '../../../reminders/components/CreateReminderModal';

export function AnimalEvents() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: reminders = [], isLoading } = useRemindersByAnimal(id!);

  return (
    <Card.Root bg="white" borderRadius="16px">
      <Card.Body padding="2rem">
        <VStack align="stretch" gap={4}>
          <Flex justify="space-between" align="center">
            <Text fontSize="1.5rem" fontWeight="bold" color="var(--color-primary)">
              ⏰ {t('reminders.title')}
            </Text>
            <CreateReminderModal animalId={id} />
          </Flex>

          {isLoading ? (
            <Box padding="3rem" textAlign="center">
              <Text color="gray.500">{t('common.loading')}</Text>
            </Box>
          ) : reminders.length === 0 ? (
            <Box
              padding="3rem"
              textAlign="center"
              bg="gray.50"
              borderRadius="12px"
              border="2px dashed"
              borderColor="gray.300"
            >
              <VStack gap={3}>
                <Text fontSize="3rem">⏰</Text>
                <Text color="gray.600" fontSize="1.1rem" fontWeight="medium">
                  {t('reminders.noRemindersYet')}
                </Text>
                <Text color="gray.500" fontSize="0.9rem">
                  {t('reminders.description')}
                </Text>
              </VStack>
            </Box>
          ) : (
            <VStack align="stretch" gap={3}>
              {reminders.map((reminder) => (
                <Box
                  key={reminder.id}
                  padding="1rem"
                  bg="gray.50"
                  borderRadius="8px"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Flex justify="space-between" align="start" gap={3}>
                    <VStack align="start" gap={1} flex="1">
                      <Text fontWeight="bold">{reminder.title}</Text>
                      {reminder.description && (
                        <Text fontSize="0.9rem" color="gray.600">{reminder.description}</Text>
                      )}
                      <Text fontSize="0.85rem" color="gray.500">
                        {new Date(reminder.reminderDateTime).toLocaleString()}
                      </Text>
                    </VStack>
                    <VStack align="end" gap={1}>
                      {reminder.isRecurring && (
                        <Badge colorPalette="blue" size="sm">
                          {reminder.recurrencePattern ? t(`reminders.${reminder.recurrencePattern.toLowerCase()}`) : t('reminders.recurring')}
                        </Badge>
                      )}
                    </VStack>
                  </Flex>
                </Box>
              ))}
            </VStack>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
