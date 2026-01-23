import { Box, Text, VStack, HStack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { RecentAnimal } from "../../animals/shared/types";
import { formatRelativeDate } from "../../../shared/utils/dateFormatter";

interface RecentAnimalCardProps {
  animal: RecentAnimal;
}

export function RecentAnimalCard({ animal }: RecentAnimalCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [imageFailed, setImageFailed] = useState(false);

  const shouldShowImage = useMemo(() => !!animal.imageUrl && !imageFailed, [animal.imageUrl, imageFailed]);

  const handleClick = () => {
    navigate(`/animals/${animal.id}`);
  };

  return (
    <Box
      padding="1.5rem"
      bg="white"
      borderRadius="16px"
      border="2px solid var(--color-border-light)"
      _hover={{
        borderColor: "var(--color-primary-light)",
        transform: "translateY(-4px)",
      }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={handleClick}
    >
      <Box
        width="100%"
        height="120px"
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

      <VStack align="stretch" gap={1}>
        <Text
          fontSize="1.1rem"
          fontWeight="bold"
          color="var(--color-primary)"
        >
          {animal.name}
        </Text>

        <Text fontSize="0.85rem" color="gray.700">
          {t(animal.speciesCommonName)}
        </Text>

        {animal.speciesScientificName && (
          <Text
            fontSize="0.75rem"
            color="gray.500"
            fontStyle="italic"
          >
            {animal.speciesScientificName}
          </Text>
        )}

        <HStack justify="space-between" marginTop="0.5rem">
          <Text
            fontSize="0.7rem"
            color="gray.500"
            bg="gray.100"
            padding="0.25rem 0.5rem"
            borderRadius="6px"
          >
            {t(animal.categoryName)}
          </Text>
          <Text fontSize="0.7rem" color="gray.400">
            {formatRelativeDate(animal.createdAt)}
          </Text>
        </HStack>

        <Text fontSize="0.75rem" color="gray.600" marginTop="0.25rem">
          📋 {animal.animalListName}
        </Text>
      </VStack>
    </Box>
  );
}
