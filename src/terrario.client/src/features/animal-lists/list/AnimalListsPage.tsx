import {
  Box,
  Button,
  Flex,
  Spinner,
  Text,
  VStack
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimalListCard } from "../components/AnimalListCard";
import { AnimalListCreateForm } from "../components/AnimalListCreateForm";
import { AnimalListEmpty } from "../components/AnimalListEmpty";
import { useAnimalListsQuery } from "../hooks/useAnimalListsQuery";

export function AnimalListsPage() {
  const { t } = useTranslation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: lists = [], isLoading } = useAnimalListsQuery();

  if (isLoading) {
    return (
      <Box padding="2rem" textAlign="center">
        <Spinner size="xl" color="green.500" />
        <Text marginTop="1rem" color="gray.500">
          {t("animalLists.loadingLists")}
        </Text>
      </Box>
    );
  }

  return (
    <VStack align="stretch" gap={6}>
      <Flex direction={['column', 'row']} justify="space-between" align={'center'} gap={4}>
        <Text
          fontSize={{ base: "1.75rem", md: "2rem" }}
          fontWeight="bold"
          color="var(--color-primary)"
          lineHeight="1.2"
        >
          {t("animalLists.myAnimalLists")}
        </Text>
        <Button
          colorPalette="green"
          width={{ base: "100%", md: "auto" }}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? t("animalLists.cancel") : t("animalLists.newList")}
        </Button>
      </Flex>

      {showCreateForm && (
        <Box marginTop={2}>
          <AnimalListCreateForm onClose={() => setShowCreateForm(false)} />
        </Box>
      )}

      {lists.length === 0 && !showCreateForm ? (
        <AnimalListEmpty />
      ) : lists.length > 0 ? (
        <VStack gap={4} align="stretch" marginTop={2}>
          {lists.map((list) => (
            <AnimalListCard key={list.id} list={list} />
          ))}
        </VStack>
      ) : null}
    </VStack>
  );
}
