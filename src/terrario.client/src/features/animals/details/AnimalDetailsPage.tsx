import { Box, VStack, Text, Spinner, Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAnimalDetails } from '../hooks/useAnimals';
import { AnimalDetailsHeader } from './components/AnimalDetailsHeader';
import { AnimalImage } from './components/AnimalImage';
import { AnimalInfo } from './components/AnimalInfo';
import { AnimalEvents } from './components/AnimalEvents';

export function AnimalDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: animal, isLoading, error } = useAnimalDetails(id!);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="400px">
        <Spinner size="xl" color="var(--color-primary)" />
      </Flex>
    );
  }

  if (error || !animal) {
    return (
      <Box padding="2rem">
        <Text color="red.500">{t('animals.failedToLoadAnimalDetails')}</Text>
      </Box>
    );
  }

  return (
    <VStack align="stretch" gap={6} maxWidth="1200px" margin="0 auto">
      <AnimalDetailsHeader />

      <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
        <AnimalImage imageUrl={animal.imageUrl} animalName={animal.name} />

        <VStack align="stretch" gap={4} flex="1">
          <AnimalInfo animal={animal} />
          <AnimalEvents />
        </VStack>
      </Flex>
    </VStack>
  );
}
