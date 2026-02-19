import { Box, Flex } from "@chakra-ui/react";

export function TypingIndicator() {
  return (
    <Box
      background="var(--color-secondary-light)"
      alignSelf="flex-start"
      padding="0.75rem"
      borderRadius="8px"
      maxW="85%"
      width="fit-content"
      flexShrink={0}
    >
      <Flex direction="row" alignItems="center" gap="0.5rem">
        <Box fontSize="1.5rem">🤖</Box>
        <Flex gap="0.25rem" alignItems="center">
          <Box
            width="8px"
            height="8px"
            borderRadius="50%"
            bg="var(--color-primary)"
            css={{
              animation: "typingBounce 1.4s infinite ease-in-out",
              animationDelay: "0s",
              "@keyframes typingBounce": {
                "0%, 60%, 100%": {
                  transform: "translateY(0)",
                },
                "30%": {
                  transform: "translateY(-8px)",
                },
              },
            }}
          />
          <Box
            width="8px"
            height="8px"
            borderRadius="50%"
            bg="var(--color-primary)"
            css={{
              animation: "typingBounce 1.4s infinite ease-in-out",
              animationDelay: "0.2s",
              "@keyframes typingBounce": {
                "0%, 60%, 100%": {
                  transform: "translateY(0)",
                },
                "30%": {
                  transform: "translateY(-8px)",
                },
              },
            }}
          />
          <Box
            width="8px"
            height="8px"
            borderRadius="50%"
            bg="var(--color-primary)"
            css={{
              animation: "typingBounce 1.4s infinite ease-in-out",
              animationDelay: "0.4s",
              "@keyframes typingBounce": {
                "0%, 60%, 100%": {
                  transform: "translateY(0)",
                },
                "30%": {
                  transform: "translateY(-8px)",
                },
              },
            }}
          />
        </Flex>
      </Flex>
    </Box>
  );
}
