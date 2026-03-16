import { Badge, Box, Spinner, Table, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAnimalsRegistrationStatus } from "../hooks/useAnimals";

export function RegistrationStatusTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: animals = [], isLoading, isError } = useAnimalsRegistrationStatus();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <Spinner size="lg" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box py={4}>
        <Text color="red.500">{t("animals.registrationStatus.failedToLoad")}</Text>
      </Box>
    );
  }

  if (animals.length === 0) {
    return (
      <Box py={8} textAlign="center">
        <Text color="gray.500">{t("animals.registrationStatus.noAnimals")}</Text>
      </Box>
    );
  }

  return (
    <Table.Root variant="outline" size="md">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>{t("animals.registrationStatus.name")}</Table.ColumnHeader>
          <Table.ColumnHeader>{t("animals.registrationStatus.hasRegistration")}</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {animals.map((animal) => (
          <Table.Row
            key={animal.id}
            cursor="pointer"
            _hover={{ bg: "gray.50" }}
            onClick={() => navigate(`/animals/${animal.id}`)}
          >
            <Table.Cell fontWeight="medium">{animal.name}</Table.Cell>
            <Table.Cell>
              {animal.hasRegistrationData ? (
                <Badge colorPalette="green">{t("animals.registrationStatus.yes")}</Badge>
              ) : (
                <Badge colorPalette="red">{t("animals.registrationStatus.no")}</Badge>
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
