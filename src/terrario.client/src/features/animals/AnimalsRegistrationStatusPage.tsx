import { Box, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { AnimalsTabs } from "./components/AnimalsTabs";
import { RegistrationStatusTable } from "./components/RegistrationStatusTable";

export function AnimalsRegistrationStatusPage() {
  const { t } = useTranslation();

  return (
    <VStack align="stretch" gap={6}>
      <AnimalsTabs />
      <Box>
        <RegistrationStatusTable />
      </Box>
    </VStack>
  );
}
