import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { t } from "i18next";

export function SettingsPage() {
  const [notificationStatus, setNotificationStatus] = useState<string>("unknown");

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationStatus(Notification.permission);
    } else {
      setNotificationStatus("not-supported");
    }
  }, []);

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
    <Box p={6}>
      <VStack gap={6} align="stretch">
        <Heading as="h1" size="lg">
          {t("pages.settings")}
        </Heading>

        <Box>
          <Heading as="h2" size="md" mb={2}>
            {t("settings.notifications.title")}
          </Heading>
          <Text>{getNotificationStatusText()}</Text>
        </Box>
      </VStack>
    </Box>
  );
}