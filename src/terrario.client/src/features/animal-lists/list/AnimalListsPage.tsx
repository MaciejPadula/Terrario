import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Text, 
  VStack, 
  HStack, 
  Input, 
  Textarea, 
  Button,
  Spinner
} from '@chakra-ui/react';
import { apiClient } from '../../../shared/api/client';
import type { AnimalList, CreateListRequest, UpdateListRequest } from '../shared/types';
import { toaster } from '../../../shared/toaster';
import { MainLayout } from '../../../shared/components/MainLayout';
import { formatDate } from '../../../shared/utils/dateFormatter';

export function AnimalListsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [lists, setLists] = useState<AnimalList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');

  // Edit state
  const [editingList, setEditingList] = useState<AnimalList | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete state
  const [deletingListId, setDeletingListId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLists = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getLists();
      setLists(response.lists);
    } catch {
      toaster.error({
        title: t('common.error'),
        description: t('animalLists.failedToLoadLists'),
      });
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      toaster.error({
        title: t('common.error'),
        description: t('animalLists.listNameRequired'),
      });
      return;
    }

    try {
      setIsCreating(true);
      const request: CreateListRequest = {
        name: newListName.trim(),
        description: newListDescription.trim() || undefined,
      };
      
      await apiClient.createList(request);
      
      toaster.success({
        title: t('animalLists.success'),
        description: t('animalLists.listCreated'),
      });
      
      // Reset form and refresh lists
      setNewListName('');
      setNewListDescription('');
      setShowCreateForm(false);
      await fetchLists();
    } catch {
      toaster.error({
        title: t('common.error'),
        description: t('animalLists.failedToCreateList'),
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Edit handlers
  const handleStartEdit = (list: AnimalList) => {
    setEditingList(list);
    setEditName(list.name);
    setEditDescription(list.description || '');
  };

  const handleCancelEdit = () => {
    setEditingList(null);
    setEditName('');
    setEditDescription('');
  };

  const handleUpdateList = async () => {
    if (!editingList || !editName.trim()) {
      toaster.error({
        title: t('common.error'),
        description: t('animalLists.listNameRequired'),
      });
      return;
    }

    try {
      setIsUpdating(true);
      const request: UpdateListRequest = {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
      };
      
      await apiClient.updateList(editingList.id, request);
      
      toaster.success({
        title: t('animalLists.success'),
        description: t('animalLists.listUpdated'),
      });
      
      handleCancelEdit();
      await fetchLists();
    } catch {
      toaster.error({
        title: t('common.error'),
        description: t('animalLists.failedToUpdateList'),
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete handlers
  const handleStartDelete = (listId: string) => {
    setDeletingListId(listId);
  };

  const handleCancelDelete = () => {
    setDeletingListId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingListId) return;

    try {
      setIsDeleting(true);
      await apiClient.deleteList(deletingListId);
      
      toaster.success({
        title: t('animalLists.success'),
        description: t('animalLists.listDeleted'),
      });
      
      setDeletingListId(null);
      await fetchLists();
    } catch {
      toaster.error({
        title: t('common.error'),
        description: t('animalLists.failedToDeleteList'),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <Box padding="2rem" textAlign="center">
          <Spinner size="xl" color="green.500" />
          <Text marginTop="1rem" color="gray.500">{t('animalLists.loadingLists')}</Text>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box padding="2rem">
      <HStack justify="space-between" marginBottom="1.5rem">
        <Text fontSize="1.5rem" fontWeight="bold" color="var(--color-primary)">
          {t('animalLists.myAnimalLists')}
        </Text>
        <Button
          colorPalette="green"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? t('animalLists.cancel') : t('animalLists.newList')}
        </Button>
      </HStack>

      {/* Create Form */}
      {showCreateForm && (
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
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                maxLength={100}
              />
            </Box>
            <Box>
              <Text fontSize="0.875rem" fontWeight="medium" marginBottom="0.5rem">
                {t('animalLists.descriptionOptional')}
              </Text>
              <Textarea
                placeholder={t('animalLists.descriptionPlaceholder')}
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
                maxLength={500}
                rows={3}
              />
            </Box>
            <HStack justify="flex-end" gap={3}>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewListName('');
                  setNewListDescription('');
                }}
              >
                {t('animalLists.cancel')}
              </Button>
              <Button
                colorPalette="green"
                onClick={handleCreateList}
                loading={isCreating}
                disabled={!newListName.trim()}
              >
                {t('animalLists.createList')}
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}

      {/* Lists */}
      {lists.length === 0 ? (
        <Box
          background="white"
          padding="3rem"
          borderRadius="16px"
          boxShadow="var(--box-shadow-light)"
          textAlign="center"
        >
          <Text fontSize="4rem" marginBottom="1rem">📋</Text>
          <Text color="gray.500" fontSize="1.125rem">
            {t('animalLists.noListsYet')}
          </Text>
          <Text color="gray.400" fontSize="0.875rem" marginTop="0.5rem">
            {t('animalLists.clickNewList')}
          </Text>
        </Box>
      ) : (
        <VStack gap={4} align="stretch">
          {lists.map((list) => (
            <Box
              key={list.id}
              background="white"
              padding="1.5rem"
              borderRadius="16px"
              boxShadow="var(--box-shadow-light)"
              border={editingList?.id === list.id ? '2px solid var(--color-primary-light)' : '2px solid transparent'}
              _hover={{ borderColor: 'var(--color-primary-light)' }}
              transition="all 0.2s ease"
            >
              {/* Edit Mode */}
              {editingList?.id === list.id ? (
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
                    <Button variant="ghost" onClick={handleCancelEdit}>
                      {t('common.cancel')}
                    </Button>
                    <Button
                      colorPalette="green"
                      onClick={handleUpdateList}
                      loading={isUpdating}
                      disabled={!editName.trim()}
                    >
                      {t('animalLists.saveChanges')}
                    </Button>
                  </HStack>
                </VStack>
              ) : deletingListId === list.id ? (
                /* Delete Confirmation */
                <VStack gap={4} align="stretch">
                  <HStack gap={2}>
                    <Text fontSize="1.5rem">⚠️</Text>
                    <Text fontSize="1rem" fontWeight="bold" color="red.600">
                      {t('animalLists.confirmDeletion')}
                    </Text>
                  </HStack>
                  <Text color="gray.600" fontSize="0.875rem">
                    {t('animalLists.confirmDeleteMessage', { name: list.name })}
                  </Text>
                  <HStack justify="flex-end" gap={3}>
                    <Button variant="ghost" onClick={handleCancelDelete}>
                      {t('common.cancel')}
                    </Button>
                    <Button
                      colorPalette="red"
                      onClick={handleConfirmDelete}
                      loading={isDeleting}
                    >
                      {t('animalLists.deleteList')}
                    </Button>
                  </HStack>
                </VStack>
              ) : (
                /* Normal View */
                <VStack align="stretch" gap={3}>
                  <HStack justify="space-between" align="flex-start">
                    <Box flex="1">
                      <HStack gap={2} marginBottom="0.5rem">
                        <Text fontSize="1.5rem">📋</Text>
                        <Text fontSize="1.25rem" fontWeight="bold" color="var(--color-primary)">
                          {list.name}
                        </Text>
                      </HStack>
                      {list.description && (
                        <Text color="gray.600" fontSize="0.875rem" marginBottom="0.5rem">
                          {list.description}
                        </Text>
                      )}
                      <Text color="gray.400" fontSize="0.75rem">
                        {t('animalLists.created')} {formatDate(list.createdAt)}
                        {list.updatedAt && ` • ${t('animalLists.updated')} ${formatDate(list.updatedAt)}`}
                      </Text>
                    </Box>
                    <HStack gap={2}>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        title={t('tooltips.editList')}
                        onClick={() => handleStartEdit(list)}
                      >
                        ✏️ {t('animalLists.edit')}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        colorPalette="red"
                        title={t('tooltips.deleteList')}
                        onClick={() => handleStartDelete(list.id)}
                      >
                        ❌ {t('animalLists.delete')}
                      </Button>
                    </HStack>
                  </HStack>
                  
                  {/* View Animals Button */}
                  <Button
                    size="sm"
                    colorPalette="green"
                    variant="outline"
                    onClick={() => navigate(`/animals?listId=${list.id}`)}
                  >
                    🦎 {t('animalLists.viewAnimalsInList')}
                  </Button>
                </VStack>
              )}
            </Box>
          ))}
        </VStack>
      )}
    </Box>
    </MainLayout>
  );
}
