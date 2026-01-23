import { useTranslation } from 'react-i18next';
import { Box, Text } from '@chakra-ui/react';

export function AnimalListEmpty() {
  const { t } = useTranslation();

  return (
    <Box
      background="white"
      padding="3rem"
      borderRadius="16px"
      boxShadow="var(--box-shadow-light)"
      textAlign="center"
    >
      <Text fontSize="4rem" marginBottom="1rem">📋</Text>
      <Text color="gray.500" fontSize="1.125rem">
        {t('animalLists.noListsYet')}
      </Text>
      <Text color="gray.400" fontSize="0.875rem" marginTop="0.5rem">
        {t('animalLists.clickNewList')}
      </Text>
    </Box>
  );
}
