import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Spinner,
  Grid,
} from '@chakra-ui/react';
import { MainLayout } from '../../../shared/components/MainLayout';
import { apiClient } from '../../../shared/api/client';
import { toaster } from '../../../shared/toaster';
import { SpeciesSelector } from '../../species/components/SpeciesSelector';
import type { Animal } from '../shared/types';
import type { AnimalList } from '../../animal-lists/shared/types';
import type { Species } from '../../species/shared/types';
import { formatShortDate } from '../../../shared/utils/dateFormatter';

export function AnimalsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [animalLists, setAnimalLists] = useState<AnimalList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showSpeciesSelector, setShowSpeciesSelector] = useState(false);
  
  // Filter states
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Create form states
  const [newAnimalName, setNewAnimalName] = useState('');
  const [selectedList, setSelectedList] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    loadData();
    
    // Set initial filter from URL params
    const listIdFromUrl = searchParams.get('listId');
    if (listIdFromUrl) {
      setSelectedListId(listIdFromUrl);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadAnimals();
  }, [selectedListId, searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      const [listsResponse] = await Promise.all([
        apiClient.getLists()
      ]);
      setAnimalLists(listsResponse.lists);
      
      if (listsResponse.lists.length > 0 && !selectedList) {
        setSelectedList(listsResponse.lists[0].id);
      }
    } catch {
      toaster.error({
        title: t('common.error'),
        description: t('animals.failedToLoadLists'),
      });
    }
  };

  const loadAnimals = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getAnimals(
        selectedListId || undefined,
        undefined,
        searchTerm || undefined
      );
      setAnimals(response.animals);
    } catch {
      toaster.error({
        title: t('common.error'),
        description: t('animals.failedToLoadAnimals'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAnimal = async () => {
    if (!newAnimalName.trim() || !selectedSpecies || !selectedList) {
      toaster.error({
        title: t('animals.validationError'),
        description: t('animals.fillAllFields'),
      });
      return;
    }

    try {
      setIsCreating(true);
      await apiClient.createAnimal({
        name: newAnimalName,
        speciesId: selectedSpecies.id,
        animalListId: selectedList,
      });

      toaster.success({
        title: t('common.success'),
        description: t('animals.animalAdded'),
      });

      setNewAnimalName('');
      setSelectedSpecies(null);
      loadAnimals();
    } catch {
      toaster.error({
        title: t('common.error'),
        description: t('animals.failedToAddAnimal'),
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectSpecies = (species: Species) => {
    setSelectedSpecies(species);
    setShowSpeciesSelector(false);
  };

  const handleStartEdit = (animal: Animal) => {
    setEditingId(animal.id);
    setEditName(animal.name);
  };

  const handleSaveEdit = async (animalId: string, animal: Animal) => {
    if (!editName.trim()) {
      toaster.error({
        title: t('common.error'),
        description: t('animals.nameCannotBeEmpty'),
      });
      return;
    }

    try {
      await apiClient.updateAnimal(animalId, {
        name: editName,
        speciesId: animal.speciesId,
        animalListId: animal.animalListId,
        imageUrl: animal.imageUrl,
      });

      toaster.success({
        title: t('common.success'),
        description: t('animals.animalUpdated'),
      });

      setEditingId(null);
      loadAnimals();
    } catch {
      toaster.error({
        title: t('common.error'),
        description: t('animals.failedToUpdateAnimal'),
      });
    }
  };

  const handleDelete = async (animalId: string) => {
    if (!confirm(t('animals.confirmDeleteAnimal'))) {
      return;
    }

    try {
      await apiClient.deleteAnimal(animalId);
      toaster.success({
        title: t('common.success'),
        description: t('animals.animalDeleted'),
      });
      loadAnimals();
    } catch {
      toaster.error({
        title: t('common.error'),
        description: t('animals.failedToDeleteAnimal'),
      });
    }
  };

  return (
    <MainLayout>
      <VStack align="stretch" gap={6}>
        <Box>
          <Text fontSize="2rem" fontWeight="bold" color="var(--color-primary)" marginBottom="0.5rem">
            🦎 {t('animals.myAnimals')}
          </Text>
          <Text fontSize="0.9rem" color="gray.600">
            {t('animals.manageCollection')}
          </Text>
        </Box>

        {/* Create form */}
        <Box
          padding="1.5rem"
          bg="white"
          borderRadius="16px"
          border="2px solid var(--color-border-light)"
        >
          <Text fontSize="1.2rem" fontWeight="bold" color="var(--color-primary)" marginBottom="1rem">
            ➕ {t('animals.addNewAnimal')}
          </Text>
          <VStack gap={3} align="stretch">
            <Input
              placeholder={t('animals.animalNamePlaceholder')}
              value={newAnimalName}
              onChange={(e) => setNewAnimalName(e.target.value)}
            />
            
            <Box>
              <select
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border-light)',
                  fontSize: '1rem',
                }}
              >
                <option value="">{t('animals.selectList')}</option>
                {animalLists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
            </Box>

            <Button
              onClick={() => setShowSpeciesSelector(true)}
              variant="outline"
              colorPalette="green"
              width="100%"
            >
              {selectedSpecies ? `🦎 ${selectedSpecies.commonName}` : t('animals.selectSpecies')}
            </Button>

            <Button
              onClick={handleCreateAnimal}
              colorPalette="green"
              width="100%"
              loading={isCreating}
            >
              {t('animals.addAnimal')}
            </Button>
          </VStack>
        </Box>

        {/* Filters */}
        <HStack gap={3}>
          <Input
            placeholder={t('animals.searchAnimals')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            flex="1"
          />
          <Box width="250px">
            <select
              value={selectedListId}
              onChange={(e) => setSelectedListId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid var(--color-border-light)',
                fontSize: '1rem',
              }}
            >
              <option value="">{t('animals.allLists')}</option>
              {animalLists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
          </Box>
        </HStack>

        {/* Animals List */}
        {isLoading ? (
          <Box textAlign="center" padding="3rem">
            <Spinner size="xl" color="green.500" />
            <Text marginTop="1rem" color="gray.500">{t('animals.loading')}</Text>
          </Box>
        ) : animals.length === 0 ? (
          <Box textAlign="center" padding="3rem">
            <Text fontSize="3rem" marginBottom="1rem">🦎</Text>
            <Text fontSize="1.2rem" fontWeight="bold" color="gray.700" marginBottom="0.5rem">
              {t('animals.noAnimals')}
            </Text>
            <Text color="gray.500">
              {t('animals.addFirstAnimal')}
            </Text>
          </Box>
        ) : (
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }} gap={4}>
            {animals.map((animal) => (
              <Box
                key={animal.id}
                padding="1.5rem"
                bg="white"
                borderRadius="16px"
                border="2px solid var(--color-border-light)"
                _hover={{ borderColor: 'var(--color-primary-light)' }}
                transition="all 0.2s"
              >
                {editingId === animal.id ? (
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
                        onClick={() => handleSaveEdit(animal.id, animal)}
                        flex="1"
                      >
                        {t('animals.save')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
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
                          onClick={() => handleStartEdit(animal)}
                        >
                          ✏️
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          colorPalette="red"
                          onClick={() => handleDelete(animal.id)}
                        >
                          🗑️
                        </Button>
                      </HStack>
                    </HStack>

                    <VStack align="start" gap={1}>
                      <Text fontSize="0.9rem" color="gray.700">
                        <strong>{t('animals.species')}</strong> {animal.speciesCommonName}
                      </Text>
                      {animal.speciesScientificName && (
                        <Text fontSize="0.8rem" color="gray.500" fontStyle="italic">
                          {animal.speciesScientificName}
                        </Text>
                      )}
                      <Text fontSize="0.8rem" color="gray.600">
                        <strong>{t('animals.category')}</strong> {animal.categoryName}
                      </Text>
                      <Text fontSize="0.75rem" color="gray.400">
                        {t('animals.added')} {formatShortDate(animal.createdAt)}
                      </Text>
                    </VStack>
                  </VStack>
                )}
              </Box>
            ))}
          </Grid>
        )}
      </VStack>

      {/* Species Selector Modal */}
      {showSpeciesSelector && (
        <SpeciesSelector
          onSelect={handleSelectSpecies}
          onClose={() => setShowSpeciesSelector(false)}
        />
      )}
    </MainLayout>
  );
}
