import { Code, Heading, List, Text } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import { ChatBlockLayout } from "./ChatBlockLayout";
import type { ChatMessage } from "./Chat";

type ChatBlockTextProps = {
  message: ChatMessage;
};

export function ChatBlockText(props: ChatBlockTextProps) {
  return (
    <ChatBlockLayout message={props.message}>
      <ReactMarkdown components={markdownComponents}>
        {props.message.content}
      </ReactMarkdown>
    </ChatBlockLayout>
  );
}

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
  code: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    const isInline = !className;
    return isInline ? (
      <Code px={1} py={0.5} borderRadius="md" bg="var(--color-bg-secondary)">
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
    <List.Root
      as="ul"
      ml={6}
      mb={2}
      listStyleType="disc"
      listStylePosition="outside"
    >
      {children}
    </List.Root>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <List.Root
      as="ol"
      ml={6}
      mb={2}
      listStyleType="decimal"
      listStylePosition="outside"
    >
      {children}
    </List.Root>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <List.Item mb={1}>{children}</List.Item>
  ),
};
