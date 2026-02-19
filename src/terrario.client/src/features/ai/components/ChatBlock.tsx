import { Box, Flex, Icon, Heading, Text, Code, List } from "@chakra-ui/react";
import { Md3dRotation } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "./Chat";

type ChatBlockProps = {
  message: ChatMessage;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const markdownComponents: any = {
  h1: ({ children }: { children: React.ReactNode }) => (
    <Heading as="h1" size="2xl" mb={3}>
      {children}
    </Heading>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <Heading as="h2" size="xl" mb={2}>
      {children}
    </Heading>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <Heading as="h3" size="lg" mb={2}>
      {children}
    </Heading>
  ),
  h4: ({ children }: { children: React.ReactNode }) => (
    <Heading as="h4" size="md" mb={2}>
      {children}
    </Heading>
  ),
  h5: ({ children }: { children: React.ReactNode }) => (
    <Heading as="h5" size="sm" mb={1}>
      {children}
    </Heading>
  ),
  h6: ({ children }: { children: React.ReactNode }) => (
    <Heading as="h6" size="xs" mb={1}>
      {children}
    </Heading>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <Text mb={2} css={{ "&:last-child": { marginBottom: 0 } }}>
      {children}
    </Text>
  ),
  code: ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const isInline = !className;
    return isInline ? (
      <Code
        px={1}
        py={0.5}
        borderRadius="md"
        bg="var(--color-bg-secondary)"
      >
        {children}
      </Code>
    ) : (
      <Code
        display="block"
        p={3}
        borderRadius="md"
        bg="var(--color-bg-secondary)"
        overflowX="auto"
        mb={2}
      >
        {children}
      </Code>
    );
  },
  ul: ({ children }: { children: React.ReactNode }) => (
    <List.Root as="ul" ml={6} mb={2} listStyleType="disc" listStylePosition="outside">
      {children}
    </List.Root>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <List.Root as="ol" ml={6} mb={2} listStyleType="decimal" listStylePosition="outside">
      {children}
    </List.Root>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <List.Item mb={1}>
      {children}
    </List.Item>
  ),
};

export function ChatBlock(props: ChatBlockProps) {
  return (
    <Box
      background={
        props.message.role === "user"
          ? "var(--color-primary-light)"
          : "#eaeaea"
      }
      alignSelf={props.message.role === "user" ? "flex-end" : "flex-start"}
      padding="0.75rem"
      borderRadius="8px"
      maxW="85%"
      width="fit-content"
      wordBreak="break-word"
      overflow="visible"
      flexShrink={0}
    >
      {props.message.role === "system" ? (
        <Flex direction="row" alignItems="center" gap="0.5rem">
          {props.message.content}
          <Icon boxSize={6} color="green.500" marginBottom="0.5rem">
            <Md3dRotation />
          </Icon>
        </Flex>
      ) : (
        <ReactMarkdown components={markdownComponents}>
          {props.message.content}
        </ReactMarkdown>
      )}
    </Box>
  );
}
