import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Text, 
  VStack, 
  HStack, 
  Input,
  Button,
  Spinner,
  Grid
} from '@chakra-ui/react';
import { apiClient } from '../../../shared/api/client';
import type { Species, Category } from '../shared/types';
import { toaster } from '../../../shared/toaster';

interface SpeciesSelectorProps {
  onSelect: (species: Species) => void;
  onClose: () => void;
}

export function SpeciesSelector({ onSelect, onClose }: SpeciesSelectorProps) {
  const { t } = useTranslation();
  const [species, setSpecies] = useState<Species[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadSpecies = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getSpecies(
        selectedCategoryId || undefined,
        searchTerm || undefined
      );
      setSpecies(response.species);
    } catch {
      toaster.error({
        title: 'Błąd',
        description: 'Nie udało się pobrać gatunków',
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategoryId, searchTerm]);

  useEffect(() => {
    loadSpecies();
  }, [loadSpecies]);

  const loadData = async () => {
    try {
      const categoriesResponse = await apiClient.getSpeciesCategories();
      setCategories(categoriesResponse.categories);
    } catch {
      toaster.error({
        title: 'Błąd',
        description: 'Nie udało się pobrać kategorii',
      });
    }
  };

  const handleSelectSpecies = (selectedSpecies: Species) => {
    onSelect(selectedSpecies);
  };

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="var(--overlay-dark)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="1000"
    >
      <Box
        bg="white"
        borderRadius="16px"
        padding="2rem"
        maxWidth="800px"
        width="90%"
        maxHeight="80vh"
        overflow="auto"
      >
        <HStack justify="space-between" marginBottom="1.5rem">
          <Text fontSize="1.5rem" fontWeight="bold" color="var(--color-primary)">
            Wybierz gatunek
          </Text>
          <Button variant="ghost" onClick={onClose} size="sm">
            ✕
          </Button>
        </HStack>

        {/* Search */}
        <Input
          placeholder="Szukaj gatunku..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          marginBottom="1rem"
        />

        {/* Categories */}
        <HStack gap={2} marginBottom="1.5rem" flexWrap="wrap">
          <Button
            size="sm"
            variant={selectedCategoryId === '' ? 'solid' : 'outline'}
            colorPalette="green"
            onClick={() => setSelectedCategoryId('')}
          >
            {t('common.all')}
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={selectedCategoryId === category.id ? 'solid' : 'outline'}
              colorPalette="green"
              onClick={() => setSelectedCategoryId(category.id)}
            >
              {category.icon || '🦗'} {t(category.name)}
            </Button>
          ))}
        </HStack>

        {/* Species List */}
        {isLoading ? (
          <Box textAlign="center" padding="2rem">
            <Spinner size="xl" color="green.500" />
            <Text marginTop="1rem" color="gray.500">{t('common.loading')}</Text>
          </Box>
        ) : species.length === 0 ? (
          <Box textAlign="center" padding="2rem">
            <Text fontSize="2rem" marginBottom="0.5rem">🔍</Text>
            <Text color="gray.500">{t('species.noSpeciesFound')}</Text>
          </Box>
        ) : (
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={3}>
            {species.map((sp) => (
              <Box
                key={sp.id}
                padding="1rem"
                border="2px solid var(--color-border-light)"
                borderRadius="12px"
                cursor="pointer"
                _hover={{ borderColor: 'var(--color-primary-light)', bg: 'var(--color-bg-secondary)' }}
                transition="all 0.2s"
                onClick={() => handleSelectSpecies(sp)}
              >
                <HStack gap={2} marginBottom="0.5rem">
                  <Text fontSize="1.5rem">🦎</Text>
                  <VStack align="start" gap={0} flex="1">
                    <Text fontWeight="bold" fontSize="0.9rem" color="var(--color-primary)">
                      {t(sp.commonName)}
                    </Text>
                    {sp.scientificName && (
                      <Text fontSize="0.75rem" color="gray.500" fontStyle="italic">
                        {sp.scientificName}
                      </Text>
                    )}
                  </VStack>
                </HStack>
                
                <HStack gap={3} fontSize="0.7rem" color="gray.600">
                  {sp.careLevel && (
                    <Text>🏆 {t(sp.careLevel)}</Text>
                  )}
                  {sp.adultSizeCm && (
                    <Text>📏 {sp.adultSizeCm}cm</Text>
                  )}
                  {sp.lifespanYears && (
                    <Text>⏱️ {sp.lifespanYears}lat</Text>
                  )}
                </HStack>
              </Box>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
