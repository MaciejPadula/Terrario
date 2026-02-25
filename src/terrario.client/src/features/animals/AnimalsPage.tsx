import { Box, Button, Flex, VStack } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useAnimalListsQuery } from "../animal-lists/hooks/useAnimalListsQuery";
import { AnimalCreateForm } from "./components/AnimalCreateForm";
import { AnimalFilters } from "./components/AnimalFilters";
import { AnimalGrid } from "./components/AnimalGrid";
import {
  useAnimals
} from "./hooks/useAnimals";

export function AnimalsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedListId = searchParams.get("listId") || "";
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: animalLists = [] } = useAnimalListsQuery();
  const { data: animals = [], isLoading: isLoadingAnimals } = useAnimals(
    selectedListId || undefined,
    undefined,
    searchTerm || undefined,
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleListChange = useCallback((listId: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (listId) {
      newParams.set('listId', listId);
    } else {
      newParams.delete('listId');
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  return (
    <VStack align="stretch" gap={6}>
      <Flex direction={['column', 'row']} gap={4} justifyContent={'space-between'} alignItems={['stretch', 'center']}>
        <Button
          colorPalette="green"
          onClick={() => setShowCreateForm(!showCreateForm)}
          width={{ base: "100%", md: "auto" }}
        >
          {showCreateForm ? t("common.cancel") : `➕ ${t("animals.addNewAnimal")}`}
        </Button>
      </Flex>

      {showCreateForm && (
        <Box marginTop={2}>
          <AnimalCreateForm 
            onClose={() => setShowCreateForm(false)} 
            defaultListId={selectedListId}
          />
        </Box>
      )}

      <AnimalFilters
        searchTerm={searchTerm}
        selectedListId={selectedListId}
        animalLists={animalLists}
        onSearchChange={handleSearchChange}
        onListChange={handleListChange}
      />

      <AnimalGrid
        animals={animals}
        isLoading={isLoadingAnimals}
      />
    </VStack>
  );
}
