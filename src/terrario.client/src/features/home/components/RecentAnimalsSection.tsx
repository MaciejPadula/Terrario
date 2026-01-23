import { Box, Grid, Skeleton, SkeletonText, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import type { RecentAnimal } from "../../animals/shared/types";
import { RecentAnimalCard } from "./RecentAnimalCard";

interface RecentAnimalsSectionProps {
  animals: RecentAnimal[];
  isLoading: boolean;
}

export function RecentAnimalsSection({ animals, isLoading }: RecentAnimalsSectionProps) {
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
            <Skeleton height="120px" borderRadius="12px" />
            <SkeletonText marginTop="1rem" noOfLines={2} />
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
        <RecentAnimalCard key={animal.id} animal={animal} />
      ))}
    </Grid>
  );
}
