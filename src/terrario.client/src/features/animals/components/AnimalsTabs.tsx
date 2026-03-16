import { Box, HStack } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function AnimalsTabs() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { label: t("animals.tabs.myAnimals"), path: "/animals" },
    { label: t("animals.tabs.registrationStatus"), path: "/animals/registration-status" },
  ];

  return (
    <HStack gap={0} borderBottom="2px solid" borderColor="gray.200">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <Box
            key={tab.path}
            as="button"
            px={5}
            py={2.5}
            fontSize="sm"
            fontWeight="medium"
            color={isActive ? "var(--color-primary)" : "gray.500"}
            borderBottom="2px solid"
            borderColor={isActive ? "var(--color-primary)" : "transparent"}
            mb="-2px"
            transition="color 0.15s, border-color 0.15s"
            _hover={{ color: "var(--color-primary)" }}
            onClick={() => navigate(tab.path)}
            whiteSpace="nowrap"
            cursor={'pointer'}
          >
            {tab.label}
          </Box>
        );
      })}
    </HStack>
  );
}
