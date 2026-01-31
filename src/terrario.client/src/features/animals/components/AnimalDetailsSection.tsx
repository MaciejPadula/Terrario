import { Box, VStack, HStack, Text, Badge, NativeSelectRoot, NativeSelectField } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { formatShortDate } from '../../../shared/utils/dateFormatter';
import type { AnimalDetails } from '../shared/types';
import type { AnimalList } from '../../animal-lists/shared/types';

interface AnimalDetailsSectionProps {
  animal: AnimalDetails;
  isEditing: boolean;
  editedListId: string;
  setEditedListId: (id: string) => void;
  animalLists: AnimalList[];
}

export function AnimalDetailsSection(props: AnimalDetailsSectionProps) {
  const { t } = useTranslation();

  return (
    <Box>
      <VStack align="stretch" gap={3}>
        <HStack>
          <Text fontWeight="bold" minWidth="150px">
            {t('animals.commonName')}:
          </Text>
          <Text>{t(props.animal.speciesCommonName)}</Text>
        </HStack>

        <HStack>
          <Text fontWeight="bold" minWidth="150px">
            {t('animals.category')}
          </Text>
          <Badge colorPalette="blue" size="lg">
            {t(props.animal.categoryName)}
          </Badge>
        </HStack>

        <HStack>
          <Text fontWeight="bold" minWidth="150px">
            {t('animals.list')}:
          </Text>
          {props.isEditing ? (
            <NativeSelectRoot maxWidth="300px">
              <NativeSelectField
                value={props.editedListId}
                onChange={(e) => props.setEditedListId(e.target.value)}
              >
                {props.animalLists?.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
          ) : (
            <Text color="var(--color-primary)">{props.animal.animalListName || '-'}</Text>
          )}
        </HStack>

        <HStack>
          <Text fontWeight="bold" minWidth="150px">
            {t('animals.addedDate')}:
          </Text>
          <Text>{formatShortDate(props.animal.createdAt)}</Text>
        </HStack>
      </VStack>
    </Box>
  );
}