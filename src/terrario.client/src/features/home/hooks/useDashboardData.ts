import { useRecentAnimals, useAnimalsCount, useAnimalsRegistrationStatus } from "../../animals/hooks/useAnimals";
import { useAnimalListsCount } from "../../animal-lists/hooks/useAnimalListsQuery";

export function useDashboardData() {
  const { data: recentAnimals = [], isLoading: isLoadingRecent } = useRecentAnimals(4);
  const { data: totalAnimalsCount = 0, isLoading: isLoadingAnimals } = useAnimalsCount();
  const { data: totalListsCount = 0, isLoading: isLoadingLists } = useAnimalListsCount();
  const { data: registrationStatuses = [], isLoading: isLoadingRegistration } = useAnimalsRegistrationStatus();

  const missingRegistrationCount = registrationStatuses.filter((a) => !a.hasRegistrationData).length;

  const isLoading = isLoadingRecent || isLoadingAnimals || isLoadingLists || isLoadingRegistration;

  return {
    recentAnimals,
    totalAnimalsCount,
    totalListsCount,
    missingRegistrationCount,
    isLoading,
    isLoadingRecentAnimals: isLoadingRecent,
    isLoadingAnimalsCount: isLoadingAnimals,
    isLoadingListsCount: isLoadingLists,
    isLoadingRegistration,
  };
}
