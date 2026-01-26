import { Box, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import type { PageDetails } from "../models/PageDetails";

export function PageHeader({ pageDetails }: { pageDetails: PageDetails }) {
  const { t } = useTranslation();

  return (
    <Box>
      <Text
        fontSize="1.5rem"
        fontWeight="bold"
        color="var(--color-primary)"
      >
        <span>{pageDetails.icon} </span>
        {t(pageDetails.nameKey)}
      </Text>
      {pageDetails.descriptionKey && (
        <Text fontSize="0.9rem" color="gray.600" display={{ base: "none", sm: "block" }}>
          {t(pageDetails.descriptionKey)}
        </Text>
      )}
    </Box>
  );
}
