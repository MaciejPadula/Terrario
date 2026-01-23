import { useTranslation } from 'react-i18next';
import { Box, Text, Spinner, Grid } from '@chakra-ui/react';
import { AnimalCard } from './AnimalCard';
import type { Animal } from '../shared/types';

interface AnimalGridProps {
  animals: Animal[];
  isLoading: boolean;
  onUpdateAnimal: (animalId: string, name: string) => Promise<void>;
  onDeleteAnimal: (animalId: string) => Promise<void>;
}

export function AnimalGrid({
  animals,
  isLoading,
  onUpdateAnimal,
  onDeleteAnimal,
}: AnimalGridProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Box textAlign="center" padding="3rem">
        <Spinner size="xl" color="green.500" />
        <Text marginTop="1rem" color="gray.500">{t('animals.loading')}</Text>
      </Box>
    );
  }

  if (animals.length === 0) {
    return (
      <Box textAlign="center" padding="3rem">
        <Text fontSize="3rem" marginBottom="1rem">🦎</Text>
        <Text fontSize="1.2rem" fontWeight="bold" color="gray.700" marginBottom="0.5rem">
          {t('animals.noAnimals')}
        </Text>
        <Text color="gray.500">
          {t('animals.addFirstAnimal')}
        </Text>
      </Box>
    );
  }

  return (
    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }} gap={4}>
      {animals.map((animal) => (
        <AnimalCard
          key={animal.id}
          animal={animal}
          onUpdate={onUpdateAnimal}
          onDelete={onDeleteAnimal}
        />
      ))}
    </Grid>
  );
}
