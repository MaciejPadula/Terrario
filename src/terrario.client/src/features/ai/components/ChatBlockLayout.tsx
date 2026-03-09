import { Box } from "@chakra-ui/react";
import type { ChatMessage } from "./Chat";

type ChatBlockLayoutProps = {
  children: React.ReactNode;
  message: ChatMessage;
};

export function ChatBlockLayout(props: ChatBlockLayoutProps) {
  return (
    <Box
      background={
        props.message.role === "user" ? "var(--color-primary-light)" : "#eaeaea"
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
      {props.children}
    </Box>
  );
}
