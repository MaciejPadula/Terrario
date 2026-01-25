import { Badge, Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { formatShortDate } from "../../../shared/utils/dateFormatter";
import type { Animal } from "../shared/types";

interface AnimalCardProps {
  animal: Animal;
}

export function AnimalCard({ animal }: AnimalCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [imageFailed, setImageFailed] = useState(false);

  const shouldShowImage = useMemo(
    () => !!animal.imageUrl && !imageFailed,
    [animal.imageUrl, imageFailed],
  );

  return (
    <Box
      padding="1.5rem"
      bg="white"
      borderRadius="16px"
      border="2px solid var(--color-border-light)"
      _hover={{ borderColor: "var(--color-primary-light)", cursor: "pointer" }}
      transition="all 0.2s"
      onClick={() => navigate(`/animals/${animal.id}`)}
    >
      <Box
        width="100%"
        height="140px"
        bg="var(--gradient-button-primary)"
        borderRadius="12px"
        marginBottom="1rem"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="3rem"
        overflow="hidden"
      >
        {shouldShowImage ? (
          <img
            src={animal.imageUrl}
            alt={animal.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={() => setImageFailed(true)}
          />
        ) : (
          "🦎"
        )}
      </Box>

      <VStack align="stretch" gap={2}>
        <HStack justify="space-between">
          <Text
            fontSize="1.3rem"
            fontWeight="bold"
            color="var(--color-primary)"
          >
            {animal.name}
          </Text>
        </HStack>

        <VStack align="start" gap={2}>
          <VStack gap={0} align="start">
            <Text fontSize="0.9rem" color="gray.700">
              {t(animal.speciesCommonName)}
            </Text>
            <Text fontSize="0.8rem" color="gray.500" fontStyle="italic">
              {animal.speciesScientificName}
            </Text>
          </VStack>

          <HStack justify="space-between" width="100%">
            <Badge color="gray.500">{t(animal.categoryName)}</Badge>
            <Text fontSize="0.75rem" color="gray.500">
              {formatShortDate(animal.createdAt)}
            </Text>
          </HStack>
          <Text fontSize="0.9rem" color="gray.600">
            📋 {animal.animalListName}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
}
