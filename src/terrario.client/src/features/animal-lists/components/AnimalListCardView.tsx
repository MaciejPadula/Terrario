import { Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../shared/utils/dateFormatter";
import type { AnimalList } from "../shared/types";

interface AnimalListCardViewProps {
  list: AnimalList;
  onEdit: () => void;
  onDelete: () => void;
}

export function AnimalListCardView({
  list,
  onEdit,
  onDelete,
}: AnimalListCardViewProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <VStack align="stretch" gap={3}>
      <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
        <Text fontSize="1.25rem" fontWeight="bold" color="var(--color-primary)">
          {list.name}
        </Text>

        <Flex>
          <Button
            size="sm"
            variant="ghost"
            title={t("tooltips.editList")}
            onClick={onEdit}
          >
            ✏️ {t("animalLists.edit")}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            colorPalette="red"
            title={t("tooltips.deleteList")}
            onClick={onDelete}
          >
            ❌ {t("animalLists.delete")}
          </Button>
        </Flex>
      </Flex>

      {list.description && (
        <Text color="gray.600" fontSize="0.875rem" marginBottom="0.5rem">
          {list.description}
        </Text>
      )}
      <Text color="gray.400" fontSize="0.75rem">
        {t("animalLists.created")} {formatDate(list.createdAt)}
        {list.updatedAt &&
          ` • ${t("animalLists.updated")} ${formatDate(list.updatedAt)}`}
      </Text>

      <Button
        size="sm"
        colorPalette="green"
        variant="outline"
        onClick={() => navigate(`/animals?listId=${list.id}`)}
      >
        🦎 {t("animalLists.viewAnimalsInList")}
      </Button>
    </VStack>
  );
}
