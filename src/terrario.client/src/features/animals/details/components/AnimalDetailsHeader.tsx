import { HStack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function AnimalDetailsHeader() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <HStack>
      <Text
        as="button"
        onClick={() => navigate('/animals')}
        fontSize="1.2rem"
        color="var(--color-primary)"
        _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
      >
        ← {t('animals.backToAnimals')}
      </Text>
    </HStack>
  );
}
