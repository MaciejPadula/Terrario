import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import type { AnimalList } from '../shared/types';
import { AnimalListCardView } from './AnimalListCardView';
import { AnimalListCardEdit } from './AnimalListCardEdit';
import { AnimalListCardDelete } from './AnimalListCardDelete';

type CardMode = 'view' | 'edit' | 'delete';

interface AnimalListCardProps {
  list: AnimalList;
}

export function AnimalListCard({ list }: AnimalListCardProps) {
  const [mode, setMode] = useState<CardMode>('view');

  const handleEditSuccess = () => setMode('view');
  const handleDeleteSuccess = () => setMode('view');
  const handleCancel = () => setMode('view');

  return (
    <Box
      background="white"
      padding="1.5rem"
      borderRadius="16px"
      boxShadow="var(--box-shadow-light)"
      border={mode === 'edit' ? '2px solid var(--color-primary-light)' : '2px solid transparent'}
      _hover={{ borderColor: 'var(--color-primary-light)' }}
      transition="all 0.2s ease"
    >
      {mode === 'edit' && (
        <AnimalListCardEdit
          list={list}
          onCancel={handleCancel}
          onSuccess={handleEditSuccess}
        />
      )}
      
      {mode === 'delete' && (
        <AnimalListCardDelete
          list={list}
          onCancel={handleCancel}
          onSuccess={handleDeleteSuccess}
        />
      )}
      
      {mode === 'view' && (
        <AnimalListCardView
          list={list}
          onEdit={() => setMode('edit')}
          onDelete={() => setMode('delete')}
        />
      )}
    </Box>
  );
}
