import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogPositioner,
  Button,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const { t } = useTranslation();

  const handleConfirm = () => {
    props.onConfirm();
    props.onClose();
  };

  return (
    <DialogRoot open={props.isOpen} onOpenChange={(e) => !e.open && props.onClose()}>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Text>{props.description}</Text>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={props.onClose}>
            {props.cancelText || t('common.cancel')}
          </Button>
          <Button
            colorPalette="red"
            onClick={handleConfirm}
            loading={props.isLoading}
          >
            {props.confirmText || t('common.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
}