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
  onDelete: () => void;
}

export function AnimalNameSection(props: AnimalNameSectionProps) {
  const { t } = useTranslation();

  return (
    <VStack justify="space-between" align="start">
      <HStack justify="space-between" align="center" width={"100%"}>
        {props.isEditing ? (
          <>
            <Input
              name="animal-name"
              autoComplete="off"
              value={props.editedName}
              onChange={(e) => props.setEditedName(e.target.value)}
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
                onClick={props.onSave}
                loading={props.isSaving}
              >
                <Text display={{ base: "none", md: "inline" }}>
                  {t("common.save")}
                </Text>
                <Text display={{ base: "inline", md: "none" }}>✓</Text>
              </Button>
              <Button colorScheme="gray" size="sm" onClick={props.onCancel}>
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
              {props.animal.name}
            </Text>
            <HStack>
              <Button colorScheme="blue" size="sm" onClick={props.onEdit}>
                <Text display={{ base: "none", md: "inline" }}>
                  {t("common.edit")}
                </Text>
                <Text display={{ base: "inline", md: "none" }}>✏️</Text>
              </Button>
              <Button colorScheme="red" size="sm" onClick={props.onDelete}>
                <Text display={{ base: "none", md: "inline" }}>
                  {t("common.delete")}
                </Text>
                <Text display={{ base: "inline", md: "none" }}>🗑️</Text>
              </Button>
            </HStack>
          </>
        )}
      </HStack>

      <Text fontSize="1.2rem" color="gray.600" fontStyle="italic">
        {props.animal.speciesScientificName}
      </Text>
    </VStack>
  );
}
