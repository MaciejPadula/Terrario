import { useState, useEffect, useCallback } from 'react';
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

export function AnimalListsPage() {
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
        title: 'Błąd',
        description: 'Nie udało się pobrać list zwierząt',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      toaster.error({
        title: 'Błąd',
        description: 'Nazwa listy jest wymagana',
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
        title: 'Sukces',
        description: 'Lista została utworzona',
      });
      
      // Reset form and refresh lists
      setNewListName('');
      setNewListDescription('');
      setShowCreateForm(false);
      await fetchLists();
    } catch {
      toaster.error({
        title: 'Błąd',
        description: 'Nie udało się utworzyć listy',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
        title: 'Błąd',
        description: 'Nazwa listy jest wymagana',
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
        title: 'Sukces',
        description: 'Lista została zaktualizowana',
      });
      
      handleCancelEdit();
      await fetchLists();
    } catch {
      toaster.error({
        title: 'Błąd',
        description: 'Nie udało się zaktualizować listy',
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
        title: 'Sukces',
        description: 'Lista została usunięta',
      });
      
      setDeletingListId(null);
      await fetchLists();
    } catch {
      toaster.error({
        title: 'Błąd',
        description: 'Nie udało się usunąć listy',
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
          <Text marginTop="1rem" color="gray.500">Ładowanie list...</Text>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box padding="2rem">
      <HStack justify="space-between" marginBottom="1.5rem">
        <Text fontSize="1.5rem" fontWeight="bold" color="#2d5016">
          Moje Listy Zwierząt
        </Text>
        <Button
          colorPalette="green"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Anuluj' : '+ Nowa Lista'}
        </Button>
      </HStack>

      {/* Create Form */}
      {showCreateForm && (
        <Box
          background="white"
          padding="1.5rem"
          borderRadius="16px"
          boxShadow="0 4px 12px rgba(0,0,0,0.1)"
          marginBottom="1.5rem"
          border="2px solid #8bc34a"
        >
          <Text fontSize="1.125rem" fontWeight="bold" marginBottom="1rem" color="#2d5016">
            Utwórz nową listę
          </Text>
          <VStack gap={4} align="stretch">
            <Box>
              <Text fontSize="0.875rem" fontWeight="medium" marginBottom="0.5rem">
                Nazwa listy *
              </Text>
              <Input
                placeholder="np. Moje pająki, Gady, Płazy..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                maxLength={100}
              />
            </Box>
            <Box>
              <Text fontSize="0.875rem" fontWeight="medium" marginBottom="0.5rem">
                Opis (opcjonalnie)
              </Text>
              <Textarea
                placeholder="Krótki opis listy..."
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
                Anuluj
              </Button>
              <Button
                colorPalette="green"
                onClick={handleCreateList}
                loading={isCreating}
                disabled={!newListName.trim()}
              >
                Utwórz listę
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
          boxShadow="0 4px 12px rgba(0,0,0,0.1)"
          textAlign="center"
        >
          <Text fontSize="4rem" marginBottom="1rem">📋</Text>
          <Text color="gray.500" fontSize="1.125rem">
            Nie masz jeszcze żadnych list zwierząt.
          </Text>
          <Text color="gray.400" fontSize="0.875rem" marginTop="0.5rem">
            Kliknij "Nowa Lista" aby utworzyć swoją pierwszą listę.
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
              boxShadow="0 4px 12px rgba(0,0,0,0.1)"
              border={editingList?.id === list.id ? '2px solid #8bc34a' : '2px solid transparent'}
              _hover={{ borderColor: '#8bc34a' }}
              transition="all 0.2s ease"
            >
              {/* Edit Mode */}
              {editingList?.id === list.id ? (
                <VStack gap={4} align="stretch">
                  <Text fontSize="1rem" fontWeight="bold" color="#2d5016">
                    Edytuj listę
                  </Text>
                  <Box>
                    <Text fontSize="0.875rem" fontWeight="medium" marginBottom="0.5rem">
                      Nazwa listy *
                    </Text>
                    <Input
                      placeholder="Nazwa listy..."
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      maxLength={100}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="0.875rem" fontWeight="medium" marginBottom="0.5rem">
                      Opis (opcjonalnie)
                    </Text>
                    <Textarea
                      placeholder="Krótki opis listy..."
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      maxLength={500}
                      rows={2}
                    />
                  </Box>
                  <HStack justify="flex-end" gap={3}>
                    <Button variant="ghost" onClick={handleCancelEdit}>
                      Anuluj
                    </Button>
                    <Button
                      colorPalette="green"
                      onClick={handleUpdateList}
                      loading={isUpdating}
                      disabled={!editName.trim()}
                    >
                      Zapisz zmiany
                    </Button>
                  </HStack>
                </VStack>
              ) : deletingListId === list.id ? (
                /* Delete Confirmation */
                <VStack gap={4} align="stretch">
                  <HStack gap={2}>
                    <Text fontSize="1.5rem">⚠️</Text>
                    <Text fontSize="1rem" fontWeight="bold" color="red.600">
                      Potwierdź usunięcie
                    </Text>
                  </HStack>
                  <Text color="gray.600" fontSize="0.875rem">
                    Czy na pewno chcesz usunąć listę "{list.name}"? 
                    Ta operacja jest nieodwracalna i usunie wszystkie zwierzęta z tej listy.
                  </Text>
                  <HStack justify="flex-end" gap={3}>
                    <Button variant="ghost" onClick={handleCancelDelete}>
                      Anuluj
                    </Button>
                    <Button
                      colorPalette="red"
                      onClick={handleConfirmDelete}
                      loading={isDeleting}
                    >
                      Usuń listę
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
                        <Text fontSize="1.25rem" fontWeight="bold" color="#2d5016">
                          {list.name}
                        </Text>
                      </HStack>
                      {list.description && (
                        <Text color="gray.600" fontSize="0.875rem" marginBottom="0.5rem">
                          {list.description}
                        </Text>
                      )}
                      <Text color="gray.400" fontSize="0.75rem">
                        Utworzono: {formatDate(list.createdAt)}
                        {list.updatedAt && ` • Zaktualizowano: ${formatDate(list.updatedAt)}`}
                      </Text>
                    </Box>
                    <HStack gap={2}>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        title="Edytuj listę"
                        onClick={() => handleStartEdit(list)}
                      >
                        ✏️ Edytuj
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        colorPalette="red"
                        title="Usuń listę"
                        onClick={() => handleStartDelete(list.id)}
                      >
                        ❌ Usuń
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
                    🦎 Zobacz zwierzęta z tej listy
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
