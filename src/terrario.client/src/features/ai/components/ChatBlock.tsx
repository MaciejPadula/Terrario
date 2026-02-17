import { Box, Flex, Icon } from "@chakra-ui/react";
import { Md3dRotation } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "./Chat";

type ChatBlockProps = {
  message: ChatMessage;
};

export function ChatBlock(props: ChatBlockProps) {
  return (
    <Box
      background={
        props.message.role === "user"
          ? "var(--color-primary-light)"
          : "var(--color-secondary-light)"
      }
      alignSelf={props.message.role === "user" ? "flex-end" : "flex-start"}
      padding="0.75rem"
      borderRadius="8px"
      maxW="85%"
      width="fit-content"
      wordBreak="break-word"
      overflow="visible"
      flexShrink={0}
      css={{
        "& p": { marginBottom: "0.5rem" },
        "& p:last-child": { marginBottom: 0 },
        "& ul, & ol": { marginLeft: "1.5rem", marginBottom: "0.5rem" },
      }}
    >
      {props.message.role === "system" ? (
        <Flex direction="row" alignItems="center" gap="0.5rem">
          {props.message.content}
          <Icon boxSize={6} color="green.500" marginBottom="0.5rem">
            <Md3dRotation />
          </Icon>
        </Flex>
      ) : (
        <ReactMarkdown>{props.message.content}</ReactMarkdown>
      )}
    </Box>
  );
}
