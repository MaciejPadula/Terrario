import { useRecentAnimals, useAnimalsCount } from "../../animals/hooks/useAnimals";
import { useAnimalListsCount } from "../../animal-lists/hooks/useAnimalListsQuery";

export function useDashboardData() {
  const { data: recentAnimals = [], isLoading: isLoadingRecent } = useRecentAnimals(4);
  const { data: totalAnimalsCount = 0, isLoading: isLoadingAnimals } = useAnimalsCount();
  const { data: totalListsCount = 0, isLoading: isLoadingLists } = useAnimalListsCount();

  const isLoading = isLoadingRecent || isLoadingAnimals || isLoadingLists;

  return {
    recentAnimals,
    totalAnimalsCount,
    totalListsCount,
    isLoading,
  };
}
