import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { t } from "i18next";
import { useMemo } from "react";

export function SettingsPage() {
  const notificationStatus = useMemo<string>(
    () =>
      "Notification" in window ? Notification.permission : "not-supported",
    [],
  );

  const getNotificationStatusText = () => {
    switch (notificationStatus) {
      case "granted":
        return t("settings.notifications.enabled");
      case "denied":
        return t("settings.notifications.disabled");
      case "default":
        return t("settings.notifications.default");
      case "not-supported":
        return t("settings.notifications.notSupported");
      default:
        return t("settings.notifications.unknown");
    }
  };

  return (
    <VStack gap={6} align="stretch">
      <Box>
        <Heading as="h2" size="md" mb={2}>
          {t("settings.notifications.title")}
        </Heading>
        <Text>{getNotificationStatusText()}</Text>
      </Box>
    </VStack>
  );
}
