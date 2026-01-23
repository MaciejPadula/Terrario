import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { toaster } from "../../../shared/toaster";
import { AnimalFilters } from "../components/AnimalFilters";
import { AnimalGrid } from "../components/AnimalGrid";
import { AnimalCreateForm } from "../components/AnimalCreateForm";
import {
  useAnimals,
  useDeleteAnimal,
  useUpdateAnimal,
} from "../hooks/useAnimals";
import { useAnimalListsQuery } from "../../animal-lists/hooks/useAnimalListsQuery";

export function AnimalsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [selectedListId, setSelectedListId] = useState<string>(
    () => searchParams.get("listId") || "",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: animalLists = [] } = useAnimalListsQuery();
  const { data: animals = [], isLoading: isLoadingAnimals } = useAnimals(
    selectedListId || undefined,
    undefined,
    searchTerm || undefined,
  );

  const updateAnimalMutation = useUpdateAnimal();
  const deleteAnimalMutation = useDeleteAnimal();

  const handleUpdateAnimal = useCallback(
    async (animalId: string, name: string) => {
      if (!name.trim()) {
        toaster.error({
          title: t("common.error"),
          description: t("animals.nameCannotBeEmpty"),
        });
        return;
      }

      const animal = animals.find((a) => a.id === animalId);
      if (!animal) return;

      try {
        await updateAnimalMutation.mutateAsync({
          id: animalId,
          data: {
            name,
            speciesId: animal.speciesId,
            animalListId: animal.animalListId,
            imageUrl: animal.imageUrl,
          },
        });

        toaster.success({
          title: t("common.success"),
          description: t("animals.animalUpdated"),
        });
      } catch {
        toaster.error({
          title: t("common.error"),
          description: t("animals.failedToUpdateAnimal"),
        });
      }
    },
    [t, animals, updateAnimalMutation],
  );

  const handleDeleteAnimal = useCallback(
    async (animalId: string) => {
      try {
        await deleteAnimalMutation.mutateAsync(animalId);
        toaster.success({
          title: t("common.success"),
          description: t("animals.animalDeleted"),
        });
      } catch {
        toaster.error({
          title: t("common.error"),
          description: t("animals.failedToDeleteAnimal"),
        });
      }
    },
    [t, deleteAnimalMutation],
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleListChange = useCallback((listId: string) => {
    setSelectedListId(listId);
  }, []);

  return (
    <VStack align="stretch" gap={6}>
      <Flex direction={['column', 'row']} gap={4} justifyContent={'space-between'} alignItems={['stretch', 'center']}>
        <Box>
          <Text
            fontSize="2rem"
            fontWeight="bold"
            color="var(--color-primary)"
            marginBottom="0.5rem"
          >
            🦎 {t("animals.myAnimals")}
          </Text>
          <Text fontSize="0.9rem" color="gray.600">
            {t("animals.manageCollection")}
          </Text>
        </Box>
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
        onUpdateAnimal={handleUpdateAnimal}
        onDeleteAnimal={handleDeleteAnimal}
      />
    </VStack>
  );
}
