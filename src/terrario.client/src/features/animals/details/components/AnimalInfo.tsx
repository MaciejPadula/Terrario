import { Box, Card, VStack, HStack, Text, Badge } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { formatShortDate } from '../../../../shared/utils/dateFormatter';
import type { AnimalDetails } from '../../shared/types';

interface AnimalInfoProps {
  animal: AnimalDetails;
}

export function AnimalInfo({ animal }: AnimalInfoProps) {
  const { t } = useTranslation();

  return (
    <Card.Root bg="white" borderRadius="16px">
      <Card.Body padding="2rem">
        <VStack align="stretch" gap={4}>
          <HStack justify="space-between" align="start">
            <Box>
              <Text fontSize="2.5rem" fontWeight="bold" color="var(--color-primary)">
                {animal.name}
              </Text>
              <Text fontSize="1.2rem" color="gray.600" fontStyle="italic">
                {animal.speciesScientificName}
              </Text>
            </Box>
          </HStack>

          <Box>
            <VStack align="stretch" gap={3}>
              <HStack>
                <Text fontWeight="bold" minWidth="150px">
                  {t('animals.commonName')}:
                </Text>
                <Text>{t(animal.speciesCommonName)}</Text>
              </HStack>

              <HStack>
                <Text fontWeight="bold" minWidth="150px">
                  {t('animals.category')}
                </Text>
                <Badge colorPalette="blue" size="lg">
                  {t(animal.categoryName)}
                </Badge>
              </HStack>

              <HStack>
                <Text fontWeight="bold" minWidth="150px">
                  {t('animals.list')}:
                </Text>
                <Text color="var(--color-primary)">{animal.animalListName || '-'}</Text>
              </HStack>

              <HStack>
                <Text fontWeight="bold" minWidth="150px">
                  {t('animals.addedDate')}:
                </Text>
                <Text>{formatShortDate(animal.createdAt)}</Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
