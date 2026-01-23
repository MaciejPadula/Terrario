import { Box, Card, VStack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface AnimalImageProps {
  imageUrl?: string;
  animalName: string;
}

export function AnimalImage({ imageUrl, animalName }: AnimalImageProps) {
  const { t } = useTranslation();

  return (
    <Card.Root
      width={{ base: '100%', lg: '400px' }}
      bg="white"
      borderRadius="16px"
      overflow="hidden"
    >
      <Card.Body padding="0">
        <Box
          width="100%"
          height="400px"
          bg="gray.100"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={animalName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <VStack gap={3}>
              <Text fontSize="6rem">🦎</Text>
              <Text color="gray.500" fontSize="0.9rem">
                {t('animals.noImageAvailable')}
              </Text>
            </VStack>
          )}
        </Box>
      </Card.Body>
    </Card.Root>
  );
}
