import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Box, Text, VStack, Input, Button, NativeSelectRoot, NativeSelectField } from "@chakra-ui/react";
import { toaster } from "../../../shared/toaster";
import { SpeciesSelector } from "../../species/components/SpeciesSelector";
import { useCreateAnimal } from "../hooks/useAnimals";
import type { Species } from "../../species/shared/types";
import { useAnimalListsQuery } from "../../animal-lists/hooks/useAnimalListsQuery";

interface AnimalCreateFormProps {
  onClose: () => void;
  defaultListId?: string;
}

export function AnimalCreateForm({ onClose, defaultListId }: AnimalCreateFormProps) {
  const { t } = useTranslation();
  const { data: animalLists = [] } = useAnimalListsQuery();
  const createAnimalMutation = useCreateAnimal();
  
  const [name, setName] = useState("");
  const [selectedList, setSelectedList] = useState(defaultListId || "");
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [showSpeciesSelector, setShowSpeciesSelector] = useState(false);

  const handleSelectSpecies = useCallback((species: Species) => {
    setSelectedSpecies(species);
    setShowSpeciesSelector(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!name.trim() || !selectedSpecies || !selectedList) {
      toaster.error({
        title: t("animals.validationError"),
        description: t("animals.fillAllFields"),
      });
      return;
    }

    try {
      await createAnimalMutation.mutateAsync({
        name,
        speciesId: selectedSpecies.id,
        animalListId: selectedList,
      });

      toaster.success({
        title: t("common.success"),
        description: t("animals.animalAdded"),
      });

      setName("");
      setSelectedSpecies(null);
      setSelectedList(defaultListId || "");
      onClose();
    } catch {
      toaster.error({
        title: t("common.error"),
        description: t("animals.failedToAddAnimal"),
      });
    }
  }, [name, selectedSpecies, selectedList, t, createAnimalMutation, onClose, defaultListId]);

  return (
    <>
      <Box
        padding="1.5rem"
        bg="white"
        borderRadius="16px"
        border="2px solid var(--color-primary-light)"
        boxShadow="var(--box-shadow-light)"
      >
        <VStack gap={4} align="stretch">
          <Text fontSize="1rem" fontWeight="bold" color="var(--color-primary)">
            ➕ {t("animals.addNewAnimal")}
          </Text>

          <Box>
            <Text fontSize="0.875rem" fontWeight="medium" marginBottom="0.5rem">
              {t("common.name")} *
            </Text>
            <Input
              placeholder={t("animals.animalNamePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>

          <Box>
            <Text fontSize="0.875rem" fontWeight="medium" marginBottom="0.5rem">
              {t("animals.selectList")} *
            </Text>
            <NativeSelectRoot>
              <NativeSelectField
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}
                placeholder={t("animals.selectList")}
              >
                {animalLists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
          </Box>

          <Box>
            <Text fontSize="0.875rem" fontWeight="medium" marginBottom="0.5rem">
              {t("animals.selectSpecies")} *
            </Text>
            <Button
              onClick={() => setShowSpeciesSelector(true)}
              variant="outline"
              colorPalette="green"
              width="100%"
              justifyContent="flex-start"
            >
              {selectedSpecies
                ? `🦎 ${selectedSpecies.commonName}`
                : t("animals.selectSpecies")}
            </Button>
          </Box>

          <Box 
            borderTop="1px solid var(--color-border-light)" 
            paddingTop="1rem"
            display="flex"
            justifyContent="flex-end"
            gap={3}
          >
            <Button
              onClick={onClose}
              variant="ghost"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              colorPalette="green"
              loading={createAnimalMutation.isPending}
              disabled={!name.trim() || !selectedSpecies || !selectedList}
            >
              {t("animals.addAnimal")}
            </Button>
          </Box>
        </VStack>
      </Box>

      {showSpeciesSelector && (
        <SpeciesSelector
          onSelect={handleSelectSpecies}
          onClose={() => setShowSpeciesSelector(false)}
        />
      )}
    </>
  );
}
