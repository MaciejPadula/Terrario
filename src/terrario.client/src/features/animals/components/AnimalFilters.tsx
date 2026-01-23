import {
  Flex,
  Input,
  NativeSelectField,
  NativeSelectRoot
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import type { AnimalList } from "../../animal-lists/shared/types";

interface AnimalFiltersProps {
  searchTerm: string;
  selectedListId: string;
  animalLists: AnimalList[];
  onSearchChange: (value: string) => void;
  onListChange: (listId: string) => void;
}

export function AnimalFilters({
  searchTerm,
  selectedListId,
  animalLists,
  onSearchChange,
  onListChange,
}: AnimalFiltersProps) {
  const { t } = useTranslation();

  return (
    <Flex gap={3} direction={["column", "row"]}>
      <Input
        placeholder={t("animals.searchAnimals")}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <NativeSelectRoot>
        <NativeSelectField
          value={selectedListId}
          onChange={(e) => onListChange(e.target.value)}
          placeholder={t("animals.allLists")}
        >
          {animalLists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name}
            </option>
          ))}
        </NativeSelectField>
      </NativeSelectRoot>
    </Flex>
  );
}
