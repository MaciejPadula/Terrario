import { Box, Flex, Spinner, Text } from "@chakra-ui/react";

interface StatCardProps {
  icon: string;
  title: string;
  value: string | number;
  subtitle: string;
  variant?: 'primary' | 'secondary' | 'warning';
  isLoading?: boolean;
}

function getBorderColor(variant?: string) {
  if (variant === 'primary') return 'var(--color-primary-light)';
  if (variant === 'warning') return 'var(--chakra-colors-orange-300)';
  return 'var(--color-primary-lighter)';
}

export function StatCard(props: StatCardProps) {
  return (
    <Box
      padding="1.5rem"
      bg={props.variant === 'warning' ? 'orange.50' : 'white'}
      borderRadius="16px"
      border={`2px solid ${getBorderColor(props.variant)}`}
      boxShadow="var(--box-shadow-light)"
    >
      <Text fontSize="2rem" marginBottom="0.5rem">
        {props.icon}
      </Text>
      <Text
        fontSize="1.25rem"
        fontWeight="bold"
        marginBottom="0.5rem"
        color="var(--color-primary)"
      >
        {props.title}
      </Text>
      {props.isLoading ? (
        <Flex align="center" minHeight="2.25rem" marginBottom="0.25rem">
          <Spinner size="md" color="var(--color-primary)" />
        </Flex>
      ) : (
        <Text color="gray.600" fontSize="2rem" fontWeight="bold">
          {props.value}
        </Text>
      )}
      <Text color="gray.500" fontSize="0.875rem">
        {props.subtitle}
      </Text>
    </Box>
  );
}
