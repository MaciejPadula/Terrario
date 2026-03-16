import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Card,
  Badge,
  FileUpload,
} from '@chakra-ui/react';
import { useUploadLegalAttachment, useDeleteLegalAttachment } from '../hooks/useAnimalLegalAttachments';
import { apiClient } from '../../../shared/api/client';
import { toaster } from '../../../shared/toaster';
import type { LegalAttachment } from '../shared/types';

interface AnimalLegalAttachmentsUploadProps {
  animalId: string;
  attachments: LegalAttachment[];
  onAttachmentsChange?: () => void;
}

const ACCEPT = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileTypeLabel(contentType: string): string {
  if (contentType === 'application/pdf') return 'PDF';
  if (contentType.startsWith('image/')) return contentType.split('/')[1].toUpperCase();
  return contentType;
}

export function AnimalLegalAttachmentsUpload({
  animalId,
  attachments,
  onAttachmentsChange,
}: AnimalLegalAttachmentsUploadProps) {
  const { t } = useTranslation();
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [fileUploadKey, setFileUploadKey] = useState(0);

  const uploadMutation = useUploadLegalAttachment();
  const deleteMutation = useDeleteLegalAttachment();

  const isUploading = uploadMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  const handleUploadAll = useCallback(async () => {
    if (pendingFiles.length === 0) return;

    for (const file of pendingFiles) {
      try {
        await uploadMutation.mutateAsync({ animalId, file });
      } catch (error) {
        toaster.error({
          title: t('animals.legalAttachments.uploadError'),
          description: `${file.name}: ${error instanceof Error ? error.message : t('common.unexpectedError')}`,
        });
        return;
      }
    }

    toaster.success({ title: t('animals.legalAttachments.uploadSuccess') });
    // Reset FileUpload component by changing key
    setFileUploadKey((k) => k + 1);
    setPendingFiles([]);
    onAttachmentsChange?.();
  }, [pendingFiles, animalId, uploadMutation, t, onAttachmentsChange]);

  const handleDelete = useCallback(
    async (attachmentId: string) => {
      if (!confirm(t('animals.legalAttachments.confirmDelete'))) return;

      try {
        await deleteMutation.mutateAsync({ attachmentId, animalId });
        toaster.success({ title: t('animals.legalAttachments.deleteSuccess') });
        onAttachmentsChange?.();
      } catch (error) {
        toaster.error({
          title: t('animals.legalAttachments.deleteError'),
          description: error instanceof Error ? error.message : t('common.unexpectedError'),
        });
      }
    },
    [animalId, deleteMutation, t, onAttachmentsChange],
  );

  const handleDownload = useCallback(async (downloadUrl: string, fileName: string) => {
    try {
      const response = await apiClient.rawRequest(downloadUrl);
      if (!response.ok) throw new Error(response.statusText);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      anchor.click();
      // Revoke after a tick so the browser has time to start reading the blob
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      toaster.error({
        title: t('animals.legalAttachments.downloadError'),
        description: error instanceof Error ? error.message : t('common.unexpectedError'),
      });
    }
  }, [t]);

  return (
    <Card.Root bg="white" borderRadius="16px" width="100%">
      <Card.Body padding="1.5rem">
        <VStack align="stretch" gap={4}>
          {/* Header */}
          <VStack align="start" gap={0}>
            <Text fontWeight="600" fontSize="1rem" color="var(--color-text-primary)">
              {t('animals.legalAttachments.title')}
            </Text>
            <Text fontSize="0.8rem" color="var(--color-text-secondary)">
              {t('animals.legalAttachments.description')}
            </Text>
          </VStack>

          {/* File picker */}
          <FileUpload.Root
            key={fileUploadKey}
            maxFiles={10}
            maxFileSize={MAX_FILE_SIZE}
            accept={ACCEPT}
            onFileChange={({ acceptedFiles }) => setPendingFiles(acceptedFiles)}
            onFileReject={({ files }) => {
              files.forEach(({ file, errors }) => {
                const isTooLarge = errors.some((e) => e.includes('TOO_LARGE'));
                toaster.error({
                  title: file.name,
                  description: isTooLarge
                    ? t('animals.legalAttachments.maxSize')
                    : t('animals.legalAttachments.allowedTypes'),
                });
              });
            }}
            disabled={isUploading}
          >
            <FileUpload.HiddenInput />
            <FileUpload.Dropzone padding="1.5rem" w="100%">
              <VStack gap={2}>
                <Text fontSize="0.875rem" color="var(--color-text-secondary)">
                  {t('animals.legalAttachments.dropzone')}
                </Text>
                <FileUpload.Trigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="var(--color-primary)"
                    color="var(--color-primary)"
                  >
                    {t('animals.legalAttachments.browse')}
                  </Button>
                </FileUpload.Trigger>
                <Text fontSize="0.75rem" color="var(--color-text-secondary)">
                  {t('animals.legalAttachments.fileRequirements')}
                </Text>
              </VStack>
            </FileUpload.Dropzone>
            <FileUpload.Context>
              {({ acceptedFiles }) =>
                acceptedFiles.length > 0 ? (
                  <FileUpload.ItemGroup>
                    {acceptedFiles.map((file) => (
                      <FileUpload.Item key={file.name} file={file}>
                        <FileUpload.ItemName flex="1" fontSize="0.875rem" />
                        <FileUpload.ItemSizeText fontSize="0.75rem" color="var(--color-text-secondary)" />
                        <FileUpload.ItemDeleteTrigger asChild>
                          <Button size="xs" variant="ghost" color="red.500">✕</Button>
                        </FileUpload.ItemDeleteTrigger>
                      </FileUpload.Item>
                    ))}
                  </FileUpload.ItemGroup>
                ) : null
              }
            </FileUpload.Context>
          </FileUpload.Root>

          {pendingFiles.length > 0 && (
            <Button
              onClick={handleUploadAll}
              loading={isUploading}
              colorPalette="blue"
              size="sm"
            >
              {t('animals.legalAttachments.uploadCount', { count: pendingFiles.length })}
            </Button>
          )}

          {/* Already uploaded attachments */}
          {attachments.length > 0 && (
            <VStack align="stretch" gap={2}>
              <Text fontSize="0.8rem" fontWeight="600" color="var(--color-text-secondary)">
                {t('animals.legalAttachments.uploaded')}
              </Text>
              {attachments.map((attachment) => (
                <HStack
                  key={attachment.id}
                  padding="0.75rem 1rem"
                  borderRadius="8px"
                  border="1px solid var(--color-border)"
                  bg="var(--color-bg-secondary)"
                  justify="space-between"
                  align="center"
                >
                  <HStack gap={3} flex="1" minWidth={0}>
                    <Badge
                      size="sm"
                      variant="subtle"
                      colorScheme={attachment.contentType === 'application/pdf' ? 'red' : 'blue'}
                      flexShrink={0}
                    >
                      {getFileTypeLabel(attachment.contentType)}
                    </Badge>
                    <VStack align="start" gap={0} flex="1" minWidth={0}>
                      <Text
                        fontSize="0.875rem"
                        fontWeight="500"
                        color="var(--color-text-primary)"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        width="100%"
                      >
                        {attachment.fileName}
                      </Text>
                      <Text fontSize="0.75rem" color="var(--color-text-secondary)">
                        {formatFileSize(attachment.fileSizeBytes)}
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack gap={2} flexShrink={0}>
                    <Button
                      size="xs"
                      variant="ghost"
                      color="var(--color-primary)"
                      onClick={() => handleDownload(attachment.downloadUrl, attachment.fileName)}
                    >
                      {t('common.download')}
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      color="red.500"
                      onClick={() => handleDelete(attachment.id)}
                      loading={deleteMutation.isPending}
                      disabled={isUploading || isDeleting}
                    >
                      {t('common.delete')}
                    </Button>
                  </HStack>
                </HStack>
              ))}
            </VStack>
          )}

          {attachments.length === 0 && pendingFiles.length === 0 && (
            <Box
              padding="1rem"
              textAlign="center"
              borderRadius="8px"
              bg="var(--color-bg-secondary)"
            >
              <Text fontSize="0.875rem" color="var(--color-text-secondary)">
                {t('animals.legalAttachments.noAttachments')}
              </Text>
            </Box>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

