import { Box, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import type { PageDetails } from "../models/PageDetails";

export function PageHeader(props: { pageDetails: PageDetails }) {
  const { t } = useTranslation();

  return (
    <Box>
      <Text
        fontSize="1.5rem"
        fontWeight="bold"
        color="var(--color-primary)"
      >
        <span>{props.pageDetails.icon} </span>
        {t(props.pageDetails.nameKey)}
      </Text>
      {props.pageDetails.descriptionKey && (
        <Text fontSize="0.9rem" color="gray.600" display={{ base: "none", sm: "block" }}>
          {t(props.pageDetails.descriptionKey)}
        </Text>
      )}
    </Box>
  );
}
