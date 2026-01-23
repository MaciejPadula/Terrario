import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  VStack,
  Text,
  HStack,
  Input,
  Spinner,
} from '@chakra-ui/react';
import { useUploadAnimalImage, useDeleteAnimalImage } from '../hooks/useAnimalImage';
import { toaster } from '../../../shared/toaster';

interface AnimalImageUploadProps {
  animalId: string;
  currentImageUrl?: string;
  onImageChange?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function AnimalImageUpload({ animalId, currentImageUrl, onImageChange }: AnimalImageUploadProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploadMutation = useUploadAnimalImage();
  const deleteMutation = useDeleteAnimalImage();

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toaster.error({
        title: t('animals.image.invalidFileType'),
        description: t('animals.image.allowedTypes'),
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toaster.error({
        title: t('animals.image.fileTooLarge'),
        description: t('animals.image.maxSize'),
      });
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [t]);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    try {
      await uploadMutation.mutateAsync({ animalId, file: selectedFile });
      toaster.success({
        title: t('animals.image.uploadSuccess'),
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onImageChange?.();
    } catch (error) {
      toaster.error({
        title: t('animals.image.uploadError'),
        description: error instanceof Error ? error.message : t('common.unexpectedError'),
      });
    }
  }, [selectedFile, animalId, uploadMutation, t, onImageChange]);

  const handleDelete = useCallback(async () => {
    if (!confirm(t('animals.image.confirmDelete'))) return;

    try {
      await deleteMutation.mutateAsync(animalId);
      toaster.success({
        title: t('animals.image.deleteSuccess'),
      });
      onImageChange?.();
    } catch (error) {
      toaster.error({
        title: t('animals.image.deleteError'),
        description: error instanceof Error ? error.message : t('common.unexpectedError'),
      });
    }
  }, [animalId, deleteMutation, t, onImageChange]);

  const handleCancel = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const isLoading = uploadMutation.isPending || deleteMutation.isPending;

  return (
    <VStack align="stretch" gap={3} width="100%">
      {previewUrl && (
        <Box
          borderRadius="8px"
          overflow="hidden"
          border="2px solid var(--color-primary-light)"
        >
          <img
            src={previewUrl}
            alt="Preview"
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
        </Box>
      )}

      {selectedFile ? (
        <VStack align="stretch" gap={2}>
          <Text fontSize="sm" color="gray.600">
            {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </Text>
          <HStack>
            <Button
              onClick={handleUpload}
              colorPalette="green"
              flex="1"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" /> : t('animals.image.upload')}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              flex="1"
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
          </HStack>
        </VStack>
      ) : (
        <VStack align="stretch" gap={2}>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={isLoading}
            display="none"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            colorPalette="blue"
            variant="outline"
            disabled={isLoading}
          >
            {t('animals.image.selectFile')}
          </Button>

          {currentImageUrl && (
            <Button
              onClick={handleDelete}
              colorPalette="red"
              variant="ghost"
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" /> : t('animals.image.deleteImage')}
            </Button>
          )}

          <Text fontSize="xs" color="gray.500" textAlign="center">
            {t('animals.image.fileRequirements')}
          </Text>
        </VStack>
      )}
    </VStack>
  );
}
