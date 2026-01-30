import { Card, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useUpdateAnimal } from '../hooks/useAnimals';
import { useAnimalListsQuery } from '../../animal-lists/hooks/useAnimalListsQuery';
import { useQueryClient } from '@tanstack/react-query';
import { toaster } from '../../../shared/toaster';
import { AnimalNameSection } from './AnimalNameSection';
import { AnimalDetailsSection } from './AnimalDetailsSection';
import type { AnimalDetails } from '../shared/types';

interface AnimalInfoProps {
  animal: AnimalDetails;
}

export function AnimalInfo({ animal }: AnimalInfoProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(animal.name);
  const [editedListId, setEditedListId] = useState(animal.animalListId);

  const { data: animalLists } = useAnimalListsQuery();
  const updateAnimalMutation = useUpdateAnimal();

  const handleEdit = () => {
    setIsEditing(true);
    setEditedName(animal.name);
    setEditedListId(animal.animalListId);
  };

  const handleSave = async () => {
    try {
      await updateAnimalMutation.mutateAsync({
        id: animal.id,
        data: {
          name: editedName,
          speciesId: animal.speciesId,
          animalListId: editedListId,
          imageUrl: animal.imageUrl,
        },
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['animals', 'details', animal.id] });
      toaster.success({
        title: t('animals.animalUpdated'),
      });
    } catch {
      toaster.error({
        title: t('animals.failedToUpdateAnimal'),
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName(animal.name);
    setEditedListId(animal.animalListId);
  };

  return (
    <Card.Root bg="white" borderRadius="16px">
      <Card.Body padding="2rem">
        <VStack align="stretch" gap={4}>
          <AnimalNameSection
            animal={animal}
            isEditing={isEditing}
            editedName={editedName}
            setEditedName={setEditedName}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={updateAnimalMutation.isPending}
          />
          <AnimalDetailsSection
            animal={animal}
            isEditing={isEditing}
            editedListId={editedListId}
            setEditedListId={setEditedListId}
            animalLists={animalLists || []}
          />
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
