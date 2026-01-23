import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Text, VStack, HStack, Input, Textarea, Button } from '@chakra-ui/react';
import { toaster } from '../../../shared/toaster';
import { useCreateAnimalList } from '../hooks/useAnimalListsQuery';

interface AnimalListCreateFormProps {
  onClose: () => void;
}

export function AnimalListCreateForm({ onClose }: AnimalListCreateFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const createMutation = useCreateAnimalList();

  const handleSubmit = async () => {
    if (!name.trim()) {
      toaster.error({
        title: t('common.error'),
        description: t('animalLists.listNameRequired'),
      });
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      toaster.success({
        title: t('animalLists.success'),
        description: t('animalLists.listCreated'),
      });

      setName('');
      setDescription('');
      onClose();
    } catch {
      toaster.error({
        title: t('common.error'),
        description: t('animalLists.failedToCreateList'),
      });
    }
  };

  return (
    <Box
      background="white"
      padding="1.5rem"
      borderRadius="16px"
      boxShadow="0 4px 12px var(--shadow-light)"
      marginBottom="1.5rem"
      border="2px solid var(--color-primary-light)"
    >
      <Text fontSize="1.125rem" fontWeight="bold" marginBottom="1rem" color="var(--color-primary)">
        {t('animalLists.createNewList')}
      </Text>
      <VStack gap={4} align="stretch">
        <Box>
          <Text fontSize="0.875rem" fontWeight="medium" marginBottom="0.5rem">
            {t('animalLists.listName')} *
          </Text>
          <Input
            placeholder={t('animalLists.listNamePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
          />
        </Box>
        <Box>
          <Text fontSize="0.875rem" fontWeight="medium" marginBottom="0.5rem">
            {t('animalLists.descriptionOptional')}
          </Text>
          <Textarea
            placeholder={t('animalLists.descriptionPlaceholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={3}
          />
        </Box>
        <HStack justify="flex-end" gap={3}>
          <Button variant="ghost" onClick={onClose}>
            {t('animalLists.cancel')}
          </Button>
          <Button
            colorPalette="green"
            onClick={handleSubmit}
            loading={createMutation.isPending}
            disabled={!name.trim()}
          >
            {t('animalLists.createList')}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
