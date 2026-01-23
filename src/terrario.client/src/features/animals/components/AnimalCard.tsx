import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Text, VStack, HStack, Input, Button } from '@chakra-ui/react';
import type { Animal } from '../shared/types';
import { formatShortDate } from '../../../shared/utils/dateFormatter';

interface AnimalCardProps {
  animal: Animal;
  onUpdate: (animalId: string, name: string) => Promise<void>;
  onDelete: (animalId: string) => Promise<void>;
}

export function AnimalCard({ animal, onUpdate, onDelete }: AnimalCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(animal.name);

  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
    setEditName(animal.name);
  }, [animal.name]);

  const handleSaveEdit = useCallback(async () => {
    if (!editName.trim()) {
      return;
    }

    await onUpdate(animal.id, editName);
    setIsEditing(false);
  }, [animal.id, editName, onUpdate]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditName(animal.name);
  }, [animal.name]);

  const handleDelete = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(t('animals.confirmDeleteAnimal'))) {
      return;
    }
    await onDelete(animal.id);
  }, [animal.id, onDelete, t]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditName(animal.name);
  }, [animal.name]);

  return (
    <Box
      padding="1.5rem"
      bg="white"
      borderRadius="16px"
      border="2px solid var(--color-border-light)"
      _hover={{ borderColor: 'var(--color-primary-light)', cursor: 'pointer' }}
      transition="all 0.2s"
      onClick={() => !isEditing && navigate(`/animals/${animal.id}`)}
    >
      {isEditing ? (
        <VStack align="stretch" gap={2}>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            autoFocus
          />
          <HStack>
            <Button
              size="sm"
              colorPalette="green"
              onClick={handleSaveEdit}
              flex="1"
            >
              {t('animals.save')}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancelEdit}
              flex="1"
            >
              {t('animals.cancel')}
            </Button>
          </HStack>
        </VStack>
      ) : (
        <VStack align="stretch" gap={2}>
          <HStack justify="space-between">
            <Text fontSize="1.3rem" fontWeight="bold" color="var(--color-primary)">
              {animal.name}
            </Text>
            <HStack gap={1}>
              <Button
                size="xs"
                variant="ghost"
                onClick={handleEdit}
              >
                ✏️
              </Button>
              <Button
                size="xs"
                variant="ghost"
                colorPalette="red"
                onClick={handleDelete}
              >
                🗑️
              </Button>
            </HStack>
          </HStack>

          <VStack align="start" gap={1}>
            <Text fontSize="0.9rem" color="gray.700">
              <strong>{t('animals.species')}</strong> {t(animal.speciesCommonName)}
            </Text>
            {animal.speciesScientificName && (
              <Text fontSize="0.8rem" color="gray.500" fontStyle="italic">
                {animal.speciesScientificName}
              </Text>
            )}
            <Text fontSize="0.8rem" color="gray.600">
              <strong>{t('animals.category')}</strong> {t(animal.categoryName)}
            </Text>
            <Text fontSize="0.75rem" color="gray.400">
              {t('animals.added')} {formatShortDate(animal.createdAt)}
            </Text>
          </VStack>
        </VStack>
      )}
    </Box>
  );
}
