import { Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import type { AnimalDetails } from "../shared/types";

interface AnimalNameSectionProps {
  animal: AnimalDetails;
  isEditing: boolean;
  editedName: string;
  setEditedName: (name: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export function AnimalNameSection({
  animal,
  isEditing,
  editedName,
  setEditedName,
  onEdit,
  onSave,
  onCancel,
  isSaving,
}: AnimalNameSectionProps) {
  const { t } = useTranslation();

  return (
    <VStack justify="space-between" align="start">
      <HStack justify="space-between" align="center" width={"100%"}>
        {isEditing ? (
          <>
            <Input
              name="animal-name"
              autoComplete="off"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              fontSize="2.5rem"
              fontWeight="bold"
              color="var(--color-primary)"
              border="1px solid var(--color-primary)"
              _focus={{ border: "2px solid var(--color-primary)" }}
            />

            <HStack>
              <Button
                colorScheme="green"
                size="sm"
                onClick={onSave}
                loading={isSaving}
              >
                <Text display={{ base: "none", md: "inline" }}>
                  {t("common.save")}
                </Text>
                <Text display={{ base: "inline", md: "none" }}>✓</Text>
              </Button>
              <Button colorScheme="gray" size="sm" onClick={onCancel}>
                <Text display={{ base: "none", md: "inline" }}>
                  {t("common.cancel")}
                </Text>
                <Text display={{ base: "inline", md: "none" }}>✕</Text>
              </Button>
            </HStack>
          </>
        ) : (
          <>
            <Text
              fontSize="2.5rem"
              fontWeight="bold"
              color="var(--color-primary)"
              as={"span"}
            >
              {animal.name}
            </Text>
            <Button colorScheme="blue" size="sm" onClick={onEdit}>
              <Text display={{ base: "none", md: "inline" }}>
                {t("common.edit")}
              </Text>
              <Text display={{ base: "inline", md: "none" }}>✏️</Text>
            </Button>
          </>
        )}
      </HStack>

      <Text fontSize="1.2rem" color="gray.600" fontStyle="italic">
        {animal.speciesScientificName}
      </Text>
    </VStack>
  );
}
