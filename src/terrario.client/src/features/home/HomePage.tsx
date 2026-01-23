import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Box, Text, VStack, Grid } from "@chakra-ui/react";
import { useDashboardData } from "./hooks/useDashboardData";
import { StatCard } from "./components/StatCard";
import { RecentAnimalsSection } from "./components/RecentAnimalsSection";
import { QuickActionCard } from "./components/QuickActionCard";

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { recentAnimals, totalAnimalsCount, totalListsCount, isLoading } = useDashboardData();

  return (
    <VStack align="stretch" gap={6}>
      {/* Header */}
      <Box>
        <Text
          fontSize="2rem"
          fontWeight="bold"
          color="var(--color-primary)"
          marginBottom="0.5rem"
        >
          🏠 {t("home.dashboard")}
        </Text>
        <Text fontSize="0.9rem" color="gray.600">
          {t("home.welcomeMessage")}
        </Text>
      </Box>

      {/* Stats Cards */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={4}>
        <StatCard
          icon="🦎"
          title={t("home.animals")}
          value={totalAnimalsCount}
          subtitle={t("home.activeInCollection")}
          variant="primary"
        />
        
        <StatCard
          icon="🌡️"
          title={t("home.temperature")}
          value="25°C"
          subtitle={t("home.averageInTerrariums")}
        />
        
        <StatCard
          icon="📋"
          title={t("home.lists")}
          value={totalListsCount}
          subtitle={t("home.createdLists")}
        />
      </Grid>

      {/* Recent Animals Section */}
      <Box>
        <Text
          fontSize="1.5rem"
          fontWeight="bold"
          color="var(--color-primary)"
          marginBottom="1rem"
        >
          🕒 {t("home.recentlyAddedAnimals")}
        </Text>
        
        <RecentAnimalsSection animals={recentAnimals} isLoading={isLoading} />
      </Box>

      {/* Quick Actions */}
      <Box>
        <Text
          fontSize="1.5rem"
          fontWeight="bold"
          color="var(--color-primary)"
          marginBottom="1rem"
        >
          ⚡ {t("quickActions.title")}
        </Text>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={4}>
          <QuickActionCard
            icon="➕"
            title={t("quickActions.addAnimal")}
            description={t("quickActions.addAnimalDesc")}
            onClick={() => navigate("/animals")}
          />
          
          <QuickActionCard
            icon="📋"
            title={t("quickActions.manageLists")}
            description={t("quickActions.manageListsDesc")}
            onClick={() => navigate("/lists")}
          />
          
          <QuickActionCard
            icon="📊"
            title={t("quickActions.viewStats")}
            description={t("quickActions.viewStatsDesc")}
          />
        </Grid>
      </Box>
    </VStack>
  );
}
