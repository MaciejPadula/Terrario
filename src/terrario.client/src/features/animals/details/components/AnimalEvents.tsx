import { Box, Card, HStack, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { formatShortDateFromDate } from '../../../../shared/utils/dateFormatter';

interface AnimalEvent {
  id: string;
  type: string;
  date: Date;
  notes?: string;
}

interface AnimalEventsProps {
  events?: AnimalEvent[];
}

export function AnimalEvents({ events = [] }: AnimalEventsProps) {
  const { t } = useTranslation();

  return (
    <Card.Root bg="white" borderRadius="16px">
      <Card.Body padding="2rem">
        <VStack align="stretch" gap={4}>
          <HStack>
            <Text fontSize="1.5rem" fontWeight="bold" color="var(--color-primary)">
              📅 {t('animals.events')}
            </Text>
          </HStack>

          {events.length === 0 ? (
            <Box
              padding="3rem"
              textAlign="center"
              bg="gray.50"
              borderRadius="12px"
              border="2px dashed"
              borderColor="gray.300"
            >
              <VStack gap={3}>
                <Text fontSize="3rem">📋</Text>
                <Text color="gray.600" fontSize="1.1rem" fontWeight="medium">
                  Wydarzenia będą dostępne wkrótce
                </Text>
                <Text color="gray.500" fontSize="0.9rem">
                  Tutaj pojawią się wpisy kalendarzowe takie jak karmienie, linienie i inne wydarzenia związane ze zwierzakiem
                </Text>
              </VStack>
            </Box>
          ) : (
            <VStack align="stretch" gap={3}>
              {events.map((event) => (
                <Box
                  key={event.id}
                  padding="1rem"
                  bg="gray.50"
                  borderRadius="8px"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Text fontWeight="bold">{event.type}</Text>
                  <Text fontSize="0.9rem" color="gray.600">{formatShortDateFromDate(event.date)}</Text>
                  {event.notes && <Text fontSize="0.85rem" color="gray.500">{event.notes}</Text>}
                </Box>
              ))}
            </VStack>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
