import { Box, Card, VStack, Text, Separator } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { AnimalImageUpload } from './AnimalImageUpload';

interface AnimalImageProps {
  imageUrl?: string;
  animalName: string;
  animalId: string;
}

export function AnimalImage(props: AnimalImageProps) {
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
          {props.imageUrl ? (
            <img
              src={props.imageUrl}
              alt={props.animalName}
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

        <Separator />

        <Box padding="1rem">
          <AnimalImageUpload
            animalId={props.animalId}
            currentImageUrl={props.imageUrl}
          />
        </Box>
      </Card.Body>
    </Card.Root>
  );
}
