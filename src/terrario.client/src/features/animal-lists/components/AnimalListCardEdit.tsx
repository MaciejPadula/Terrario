import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Text, VStack, HStack, Input, Textarea, Button } from '@chakra-ui/react';
import { toaster } from '../../../shared/toaster';
import { useUpdateAnimalList } from '../hooks/useAnimalListsQuery';
import type { AnimalList } from '../shared/types';

interface AnimalListCardEditProps {
  list: AnimalList;
  onCancel: () => void;
  onSuccess: () => void;
}

export function AnimalListCardEdit({ list, onCancel, onSuccess }: AnimalListCardEditProps) {
  const { t } = useTranslation();
  const [editName, setEditName] = useState(list.name);
  const [editDescription, setEditDescription] = useState(list.description || '');
  const updateMutation = useUpdateAnimalList();

  const handleUpdate = async () => {
    if (!editName.trim()) {
      toaster.error({
        title: t('common.error'),
        description: t('animalLists.listNameRequired'),
      });
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: list.id,
        data: {
          name: editName.trim(),
          description: editDescription.trim() || undefined,
        },
      });

      toaster.success({
        title: t('animalLists.success'),
        description: t('animalLists.listUpdated'),
      });

      onSuccess();
    } catch {
      toaster.error({
        title: t('common.error'),
        description: t('animalLists.failedToUpdateList'),
      });
    }
  };

  return (
    <VStack gap={4} align="stretch">
      <Text fontSize="1rem" fontWeight="bold" color="var(--color-primary)">
        {t('animalLists.editList')}
      </Text>
      <Box>
        <Text fontSize="0.875rem" fontWeight="medium" marginBottom="0.5rem">
          {t('animalLists.listName')} *
        </Text>
        <Input
          placeholder={t('animalLists.listName')}
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          maxLength={100}
        />
      </Box>
      <Box>
        <Text fontSize="0.875rem" fontWeight="medium" marginBottom="0.5rem">
          {t('animalLists.descriptionOptional')}
        </Text>
        <Textarea
          placeholder={t('animalLists.descriptionPlaceholder')}
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          maxLength={500}
          rows={2}
        />
      </Box>
      <HStack justify="flex-end" gap={3}>
        <Button variant="ghost" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button
          colorPalette="green"
          onClick={handleUpdate}
          loading={updateMutation.isPending}
          disabled={!editName.trim()}
        >
          {t('animalLists.saveChanges')}
        </Button>
      </HStack>
    </VStack>
  );
}
