import { Box, VStack } from "@chakra-ui/react";
import { AnimalsTabs } from "./components/AnimalsTabs";
import { RegistrationStatusTable } from "./components/RegistrationStatusTable";

export function AnimalsRegistrationStatusPage() {
  return (
    <VStack align="stretch" gap={6}>
      <AnimalsTabs />
      <Box>
        <RegistrationStatusTable />
      </Box>
    </VStack>
  );
}
