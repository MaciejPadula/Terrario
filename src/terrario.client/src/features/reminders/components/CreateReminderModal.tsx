import {
  DialogRoot,
  DialogTrigger,
  DialogBackdrop,
  DialogPositioner,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
} from '@chakra-ui/react';
import { Button, Input, Textarea, VStack, HStack, Field, Box } from '@chakra-ui/react';
import { NativeSelectField, NativeSelectRoot } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api/client';

interface CreateReminderModalProps {
  animalId?: string;
  trigger?: React.ReactNode;
}

export function CreateReminderModal({ animalId, trigger }: CreateReminderModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reminderDateTime: '',
    isRecurring: false,
    recurrencePattern: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createReminderMutation = useMutation({
    mutationFn: (data: typeof formData & { animalId?: string }) =>
      apiClient.createReminder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      if (animalId) {
        queryClient.invalidateQueries({ queryKey: ['reminders', 'animal', animalId] });
      }
      setIsOpen(false);
      setFormData({
        title: '',
        description: '',
        reminderDateTime: '',
        isRecurring: false,
        recurrencePattern: '',
      });
      setErrors({});
    },
    onError: (error: Error & { errors?: Record<string, string> }) => {
      if (error.errors) {
        setErrors(error.errors);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.title.trim()) {
      setErrors({ title: t('reminders.titleRequired') });
      return;
    }

    if (!formData.reminderDateTime) {
      setErrors({ reminderDateTime: t('reminders.dateTimeRequired') });
      return;
    }

    const reminderDateTime = new Date(formData.reminderDateTime);
    if (reminderDateTime <= new Date()) {
      setErrors({ reminderDateTime: t('reminders.dateTimeInFuture') });
      return;
    }

    createReminderMutation.mutate({
      ...formData,
      animalId: animalId,
    });
  };

  const defaultTrigger = (
    <Button colorPalette="green" size="sm">
      <Box display={{ base: 'inline', md: 'none' }}>+</Box>
      <Box display={{ base: 'none', md: 'inline' }}>{t('reminders.createReminder')}</Box>
    </Button>
  );

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{t('reminders.createReminder')}</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <VStack gap={4} align="stretch">
                <Field.Root invalid={!!errors.title}>
                  <Field.Label>{t('reminders.title')} *</Field.Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={t('reminders.titlePlaceholder')}
                  />
                  <Field.ErrorText>{errors.title}</Field.ErrorText>
                </Field.Root>

                <Field.Root>
                  <Field.Label>{t('reminders.description')}</Field.Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={t('reminders.descriptionPlaceholder')}
                    rows={3}
                  />
                </Field.Root>

                <Field.Root invalid={!!errors.reminderDateTime}>
                  <Field.Label>{t('reminders.dateTime')} *</Field.Label>
                  <Input
                    type="datetime-local"
                    value={formData.reminderDateTime}
                    onChange={(e) => setFormData({ ...formData, reminderDateTime: e.target.value })}
                  />
                  <Field.ErrorText>{errors.reminderDateTime}</Field.ErrorText>
                </Field.Root>

                <Field.Root>
                  <HStack gap={2}>
                    <input
                      type="checkbox"
                      checked={formData.isRecurring}
                      onChange={(e) =>
                        setFormData({ ...formData, isRecurring: e.target.checked })
                      }
                    />
                    <Field.Label mb={0}>{t('reminders.isRecurring')}</Field.Label>
                  </HStack>
                </Field.Root>

                {formData.isRecurring && (
                  <Field.Root>
                    <Field.Label>{t('reminders.recurrencePattern')}</Field.Label>
                    <NativeSelectRoot>
                      <NativeSelectField
                        value={formData.recurrencePattern}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            recurrencePattern: e.target.value,
                          })
                        }
                      >
                        <option value="">{t('reminders.selectPattern')}</option>
                        <option value="daily">{t('reminders.daily')}</option>
                        <option value="weekly">{t('reminders.weekly')}</option>
                        <option value="monthly">{t('reminders.monthly')}</option>
                        <option value="yearly">{t('reminders.yearly')}</option>
                      </NativeSelectField>
                    </NativeSelectRoot>
                  </Field.Root>
                )}
              </VStack>
            </DialogBody>
            <DialogFooter>
              <HStack gap={3}>
                <DialogActionTrigger asChild>
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                </DialogActionTrigger>
                <Button
                  type="submit"
                  colorPalette="green"
                  loading={createReminderMutation.isPending}
                >
                  {t('reminders.create')}
                </Button>
              </HStack>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
}