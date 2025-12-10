import { useState, useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Spinner,
  Grid,
} from '@chakra-ui/react';
import { MainLayout } from '../../shared/components/MainLayout';
import { apiClient } from '../../shared/api/client';
import { toaster } from '../../shared/toaster';
import type { RecentAnimal } from '../animals/shared/types';

export function HomePage() {
  const [recentAnimals, setRecentAnimals] = useState<RecentAnimal[]>([]);
  const [totalAnimalsCount, setTotalAnimalsCount] = useState(0);
  const [totalListsCount, setTotalListsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load recent animals, total count, and lists count
      const [recentResponse, allAnimalsResponse, listsResponse] = await Promise.all([
        apiClient.getRecentAnimals(8),
        apiClient.getAnimals(),
        apiClient.getLists()
      ]);
      
      setRecentAnimals(recentResponse.recentAnimals);
      setTotalAnimalsCount(allAnimalsResponse.totalCount);
      setTotalListsCount(listsResponse.totalCount);
    } catch {
      toaster.error({
        title: 'Błąd',
        description: 'Nie udało się pobrać danych',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 24) {
      return diffInHours === 0 ? 'przed chwilą' : `${diffInHours}h temu`;
    } else if (diffInDays < 7) {
      return `${diffInDays} dni temu`;
    } else {
      return date.toLocaleDateString('pl-PL');
    }
  };

  return (
    <MainLayout>
      <VStack align="stretch" gap={6}>
        {/* Header */}
        <Box>
          <Text fontSize="2rem" fontWeight="bold" color="#2d5016" marginBottom="0.5rem">
            🏠 Dashboard
          </Text>
          <Text fontSize="0.9rem" color="gray.600">
            Witaj w aplikacji Terrario - zarządzaj swoją kolekcją zwierząt
          </Text>
        </Box>

        {/* Stats Cards */}
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap={4}>
          {/* Animals Count */}
          <Box
            padding="1.5rem"
            bg="white"
            borderRadius="16px"
            border="2px solid #8bc34a"
            boxShadow="0 4px 12px rgba(0,0,0,0.1)"
          >
            <Text fontSize="2rem" marginBottom="0.5rem">🦎</Text>
            <Text fontSize="1.25rem" fontWeight="bold" marginBottom="0.5rem" color="#2d5016">
              Zwierzęta
            </Text>
            <Text color="gray.600" fontSize="2rem" fontWeight="bold">
              {totalAnimalsCount}
            </Text>
            <Text color="gray.500" fontSize="0.875rem">
              Aktywnych w kolekcji
            </Text>
          </Box>

          {/* Temperature - Placeholder */}
          <Box
            padding="1.5rem"
            bg="white"
            borderRadius="16px"
            border="2px solid #4caf50"
            boxShadow="0 4px 12px rgba(0,0,0,0.1)"
          >
            <Text fontSize="2rem" marginBottom="0.5rem">🌡️</Text>
            <Text fontSize="1.25rem" fontWeight="bold" marginBottom="0.5rem" color="#2d5016">
              Temperatura
            </Text>
            <Text color="gray.600" fontSize="2rem" fontWeight="bold">
              25°C
            </Text>
            <Text color="gray.500" fontSize="0.875rem">
              Średnia w terrariach
            </Text>
          </Box>

          {/* Lists */}
          <Box
            padding="1.5rem"
            bg="white"
            borderRadius="16px"
            border="2px solid #66bb6a"
            boxShadow="0 4px 12px rgba(0,0,0,0.1)"
          >
            <Text fontSize="2rem" marginBottom="0.5rem">📋</Text>
            <Text fontSize="1.25rem" fontWeight="bold" marginBottom="0.5rem" color="#2d5016">
              Listy
            </Text>
            <Text color="gray.600" fontSize="2rem" fontWeight="bold">
              {totalListsCount}
            </Text>
            <Text color="gray.500" fontSize="0.875rem">
              Utworzonych list
            </Text>
          </Box>
        </Grid>

        {/* Recent Animals Section */}
        <Box>
          <Text fontSize="1.5rem" fontWeight="bold" color="#2d5016" marginBottom="1rem">
            🕒 Ostatnio dodane zwierzęta
          </Text>

          {isLoading ? (
            <Box textAlign="center" padding="3rem">
              <Spinner size="xl" color="green.500" />
              <Text marginTop="1rem" color="gray.500">Ładowanie...</Text>
            </Box>
          ) : recentAnimals.length === 0 ? (
            <Box
              textAlign="center"
              padding="3rem"
              bg="white"
              borderRadius="16px"
              border="2px solid #e0e0e0"
            >
              <Text fontSize="3rem" marginBottom="1rem">🦎</Text>
              <Text fontSize="1.2rem" fontWeight="bold" color="gray.700" marginBottom="0.5rem">
                Brak zwierząt
              </Text>
              <Text color="gray.500">
                Dodaj swoje pierwsze zwierzę w sekcji "Moje zwierzęta"
              </Text>
            </Box>
          ) : (
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }} gap={4}>
              {recentAnimals.map((animal) => (
                <Box
                  key={animal.id}
                  padding="1.5rem"
                  bg="white"
                  borderRadius="16px"
                  border="2px solid #e0e0e0"
                  _hover={{ borderColor: '#8bc34a', transform: 'translateY(-4px)' }}
                  transition="all 0.2s"
                  cursor="pointer"
                >
                  {/* Image placeholder */}
                  <Box
                    width="100%"
                    height="120px"
                    bg="linear-gradient(135deg, #8bc34a 0%, #4caf50 100%)"
                    borderRadius="12px"
                    marginBottom="1rem"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="3rem"
                  >
                    🦎
                  </Box>

                  <VStack align="stretch" gap={1}>
                    <Text fontSize="1.1rem" fontWeight="bold" color="#2d5016">
                      {animal.name}
                    </Text>
                    
                    <Text fontSize="0.85rem" color="gray.700">
                      {animal.speciesCommonName}
                    </Text>

                    {animal.speciesScientificName && (
                      <Text fontSize="0.75rem" color="gray.500" fontStyle="italic">
                        {animal.speciesScientificName}
                      </Text>
                    )}

                    <HStack justify="space-between" marginTop="0.5rem">
                      <Text fontSize="0.7rem" color="gray.500" bg="gray.100" padding="0.25rem 0.5rem" borderRadius="6px">
                        {animal.categoryName}
                      </Text>
                      <Text fontSize="0.7rem" color="gray.400">
                        {formatDate(animal.createdAt)}
                      </Text>
                    </HStack>

                    <Text fontSize="0.75rem" color="gray.600" marginTop="0.25rem">
                      📋 {animal.animalListName}
                    </Text>
                  </VStack>
                </Box>
              ))}
            </Grid>
          )}
        </Box>

        {/* Quick Actions */}
        <Box>
          <Text fontSize="1.5rem" fontWeight="bold" color="#2d5016" marginBottom="1rem">
            ⚡ Szybkie akcje
          </Text>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap={4}>
            <Box
              padding="1.5rem"
              bg="white"
              borderRadius="16px"
              border="2px solid #e0e0e0"
              _hover={{ borderColor: '#8bc34a', bg: '#f5f5f5' }}
              transition="all 0.2s"
              cursor="pointer"
              onClick={() => window.location.href = '/animals'}
            >
              <Text fontSize="2rem" marginBottom="0.5rem">➕</Text>
              <Text fontSize="1.1rem" fontWeight="bold" color="#2d5016">
                Dodaj zwierzę
              </Text>
              <Text fontSize="0.85rem" color="gray.600">
                Dodaj nowe zwierzę do kolekcji
              </Text>
            </Box>

            <Box
              padding="1.5rem"
              bg="white"
              borderRadius="16px"
              border="2px solid #e0e0e0"
              _hover={{ borderColor: '#8bc34a', bg: '#f5f5f5' }}
              transition="all 0.2s"
              cursor="pointer"
              onClick={() => window.location.href = '/lists'}
            >
              <Text fontSize="2rem" marginBottom="0.5rem">📋</Text>
              <Text fontSize="1.1rem" fontWeight="bold" color="#2d5016">
                Zarządzaj listami
              </Text>
              <Text fontSize="0.85rem" color="gray.600">
                Twórz i edytuj listy zwierząt
              </Text>
            </Box>

            <Box
              padding="1.5rem"
              bg="white"
              borderRadius="16px"
              border="2px solid #e0e0e0"
              _hover={{ borderColor: '#8bc34a', bg: '#f5f5f5' }}
              transition="all 0.2s"
              cursor="pointer"
            >
              <Text fontSize="2rem" marginBottom="0.5rem">📊</Text>
              <Text fontSize="1.1rem" fontWeight="bold" color="#2d5016">
                Zobacz statystyki
              </Text>
              <Text fontSize="0.85rem" color="gray.600">
                Analizuj swoją kolekcję
              </Text>
            </Box>
          </Grid>
        </Box>
      </VStack>
    </MainLayout>
  );
}
