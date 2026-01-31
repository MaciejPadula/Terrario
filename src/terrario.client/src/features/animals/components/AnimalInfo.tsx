import { Card, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useUpdateAnimal, useDeleteAnimal } from '../hooks/useAnimals';
import { useAnimalListsQuery } from '../../animal-lists/hooks/useAnimalListsQuery';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toaster } from '../../../shared/toaster';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { AnimalNameSection } from './AnimalNameSection';
import { AnimalDetailsSection } from './AnimalDetailsSection';
import type { AnimalDetails } from '../shared/types';

interface AnimalInfoProps {
  animal: AnimalDetails;
}

export function AnimalInfo(props: AnimalInfoProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(props.animal.name);
  const [editedListId, setEditedListId] = useState(props.animal.animalListId);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: animalLists } = useAnimalListsQuery();
  const updateAnimalMutation = useUpdateAnimal();
  const deleteAnimalMutation = useDeleteAnimal();

  const handleEdit = () => {
    setIsEditing(true);
    setEditedName(props.animal.name);
    setEditedListId(props.animal.animalListId);
  };

  const handleSave = async () => {
    try {
      await updateAnimalMutation.mutateAsync({
        id: props.animal.id,
        data: {
          name: editedName,
          speciesId: props.animal.speciesId,
          animalListId: editedListId,
          imageUrl: props.animal.imageUrl,
        },
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['animals', 'details', props.animal.id] });
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
    setEditedName(props.animal.name);
    setEditedListId(props.animal.animalListId);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAnimalMutation.mutateAsync(props.animal.id);
      toaster.success({
        title: t('animals.animalDeleted'),
      });
      navigate('/animals');
    } catch {
      toaster.error({
        title: t('animals.failedToDeleteAnimal'),
      });
    }
  };

  return (
    <Card.Root bg="white" borderRadius="16px">
      <Card.Body padding="2rem">
        <VStack align="stretch" gap={4}>
          <AnimalNameSection
            animal={props.animal}
            isEditing={isEditing}
            editedName={editedName}
            setEditedName={setEditedName}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={updateAnimalMutation.isPending}
            onDelete={handleDelete}
          />
          <AnimalDetailsSection
            animal={props.animal}
            isEditing={isEditing}
            editedListId={editedListId}
            setEditedListId={setEditedListId}
            animalLists={animalLists || []}
          />
        </VStack>
      </Card.Body>
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title={t('animals.confirmDeleteAnimal')}
        description={t('animals.confirmDeleteAnimal', { name: props.animal.name })}
        confirmText={t('common.delete')}
        onConfirm={confirmDelete}
        isLoading={deleteAnimalMutation.isPending}
      />
    </Card.Root>
  );
}
