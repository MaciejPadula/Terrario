import { Box, Text } from "@chakra-ui/react";

interface QuickActionCardProps {
  icon: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export function QuickActionCard({ icon, title, description, onClick }: QuickActionCardProps) {
  return (
    <Box
      padding="1.5rem"
      bg="white"
      borderRadius="16px"
      border="2px solid var(--color-border-light)"
      _hover={{
        borderColor: "var(--color-primary-light)",
        bg: "var(--color-bg-secondary)",
      }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={onClick}
    >
      <Text fontSize="2rem" marginBottom="0.5rem">
        {icon}
      </Text>
      <Text
        fontSize="1.1rem"
        fontWeight="bold"
        color="var(--color-primary)"
      >
        {title}
      </Text>
      <Text fontSize="0.85rem" color="gray.600">
        {description}
      </Text>
    </Box>
  );
}
