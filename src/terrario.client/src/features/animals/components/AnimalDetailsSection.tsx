import { Box, VStack, HStack, Text, Badge, NativeSelectRoot, NativeSelectField } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { formatShortDate } from '../../../shared/utils/dateFormatter';
import type { AnimalDetails } from '../shared/types';
import type { AnimalList } from '../../animal-lists/shared/types';

import { AnimalGender } from '../shared/types';

interface AnimalDetailsSectionProps {
  animal: AnimalDetails;
  isEditing: boolean;
  editedListId: string;
  setEditedListId: (id: string) => void;
  editedGender?: AnimalGender;
  setEditedGender?: (gender: AnimalGender) => void;
  animalLists: AnimalList[];
}

export function AnimalDetailsSection(props: AnimalDetailsSectionProps) {
  const { t } = useTranslation();

  return (
    <Box>
      <VStack align="stretch" gap={3}>
        <HStack>
          <Text fontWeight="bold" minWidth="150px">
            {t('animals.gender')}:
          </Text>
          {props.isEditing && props.setEditedGender ? (
            <NativeSelectRoot maxWidth="200px">
              <NativeSelectField
                value={props.editedGender}
                onChange={e => props.setEditedGender(Number(e.target.value))}
              >
                <option value={AnimalGender.Unknown}>{t('animals.genderUnknown')}</option>
                <option value={AnimalGender.Male}>{t('animals.genderMale')}</option>
                <option value={AnimalGender.Female}>{t('animals.genderFemale')}</option>
              </NativeSelectField>
            </NativeSelectRoot>
          ) : (
            <Text>
              {props.animal.gender === 1
                ? t('animals.genderMale')
                : props.animal.gender === 2
                  ? t('animals.genderFemale')
                  : t('animals.genderUnknown')}
            </Text>
          )}
        </HStack>
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