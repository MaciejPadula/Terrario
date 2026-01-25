import { Box, Flex, Grid, Spinner, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import type { Animal } from "./shared/types";
import { AnimalCard } from "./components/AnimalCard";

interface RecentAnimalsSectionProps {
  animals: Animal[];
  isLoading: boolean;
}

export function RecentAnimalsSection({
  animals,
  isLoading,
}: RecentAnimalsSectionProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Grid
        templateColumns={{
          base: "1fr",
          md: "1fr 1fr",
          lg: "1fr 1fr 1fr 1fr",
        }}
        gap={4}
      >
        {Array.from({ length: 4 }).map((_, idx) => (
          <Box
            key={idx}
            padding="1rem"
            bg="white"
            borderRadius="16px"
            border="2px solid var(--color-border-light)"
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              minHeight="160px"
              gap={3}
            >
              <Spinner size="lg" color="var(--color-primary)" />
              <Text color="gray.500" fontSize="0.9rem">
                {t("common.loading")}
              </Text>
            </Flex>
          </Box>
        ))}
      </Grid>
    );
  }

  if (animals.length === 0) {
    return (
      <Box
        textAlign="center"
        padding="3rem"
        bg="white"
        borderRadius="16px"
        border="2px solid var(--color-border-light)"
      >
        <Text fontSize="3rem" marginBottom="1rem">
          🦎
        </Text>
        <Text
          fontSize="1.2rem"
          fontWeight="bold"
          color="gray.700"
          marginBottom="0.5rem"
        >
          {t("home.noAnimals")}
        </Text>
        <Text color="gray.500">{t("home.addFirstAnimal")}</Text>
      </Box>
    );
  }

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        md: "1fr 1fr",
        lg: "1fr 1fr 1fr 1fr",
      }}
      gap={4}
    >
      {animals.map((animal) => (
        <AnimalCard key={animal.id} animal={animal} />
      ))}
    </Grid>
  );
}
