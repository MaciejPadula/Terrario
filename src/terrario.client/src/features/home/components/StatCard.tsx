import { Box, Flex, Spinner, Text } from "@chakra-ui/react";

interface StatCardProps {
  icon: string;
  title: string;
  value: string | number;
  subtitle: string;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export function StatCard({ icon, title, value, subtitle, variant = 'secondary', isLoading }: StatCardProps) {
  return (
    <Box
      padding="1.5rem"
      bg="white"
      borderRadius="16px"
      border={`2px solid var(--color-primary-${variant === 'primary' ? 'light' : 'lighter'})`}
      boxShadow="var(--box-shadow-light)"
    >
      <Text fontSize="2rem" marginBottom="0.5rem">
        {icon}
      </Text>
      <Text
        fontSize="1.25rem"
        fontWeight="bold"
        marginBottom="0.5rem"
        color="var(--color-primary)"
      >
        {title}
      </Text>
      {isLoading ? (
        <Flex align="center" minHeight="2.25rem" marginBottom="0.25rem">
          <Spinner size="md" color="var(--color-primary)" />
        </Flex>
      ) : (
        <Text color="gray.600" fontSize="2rem" fontWeight="bold">
          {value}
        </Text>
      )}
      <Text color="gray.500" fontSize="0.875rem">
        {subtitle}
      </Text>
    </Box>
  );
}
