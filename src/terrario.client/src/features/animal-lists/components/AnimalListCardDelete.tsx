import { useTranslation } from 'react-i18next';
import { Text, VStack, HStack, Button } from '@chakra-ui/react';
import { toaster } from '../../../shared/toaster';
import { useDeleteAnimalList } from '../hooks/useAnimalListsQuery';
import type { AnimalList } from '../shared/types';

interface AnimalListCardDeleteProps {
  list: AnimalList;
  onCancel: () => void;
  onSuccess: () => void;
}

export function AnimalListCardDelete(props: AnimalListCardDeleteProps) {
  const { t } = useTranslation();
  const deleteMutation = useDeleteAnimalList();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(props.list.id);

      toaster.success({
        title: t('animalLists.success'),
        description: t('animalLists.listDeleted'),
      });

      props.onSuccess();
    } catch {
      toaster.error({
        title: t('common.error'),
        description: t('animalLists.failedToDeleteList'),
      });
    }
  };

  return (
    <VStack gap={4} align="stretch">
      <HStack gap={2}>
        <Text fontSize="1.5rem">⚠️</Text>
        <Text fontSize="1rem" fontWeight="bold" color="red.600">
          {t('animalLists.confirmDeletion')}
        </Text>
      </HStack>
      <Text color="gray.600" fontSize="0.875rem">
        {t('animalLists.confirmDeleteMessage', { name: props.list.name })}
      </Text>
      <HStack justify="flex-end" gap={3}>
        <Button variant="ghost" onClick={props.onCancel}>
          {t('common.cancel')}
        </Button>
        <Button
          colorPalette="red"
          onClick={handleDelete}
          loading={deleteMutation.isPending}
        >
          {t('animalLists.deleteList')}
        </Button>
      </HStack>
    </VStack>
  );
}
