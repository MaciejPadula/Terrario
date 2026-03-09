import { Button, Flex, Group, Input } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../shared/api/client";
import { ChatBlock } from "./ChatBlock";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatMessageDto } from "../shared/types";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const MessagePartType = {
  Skill: 1,
  Text: 2,
} as const;

type MessagePartType = (typeof MessagePartType)[keyof typeof MessagePartType];

interface MessagePart {
  type: MessagePartType;
  body: string;
}

interface ChatProps {
  conversationId: string | null;
  initialMessages?: ChatMessageDto[];
}

export function Chat({ conversationId, initialMessages }: ChatProps) {
  const { t } = useTranslation();

  const startMessage: ChatMessage = {
    role: "assistant",
    content: t("ai.welcomeMessage"),
  };

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([startMessage]);
  const [isStreaming, setIsStreaming] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setMessages(
        initialMessages.map((m) => ({
          role: m.role as ChatMessage["role"],
          content: m.content,
        })),
      );
    } else {
      setMessages([startMessage]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, initialMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  function addSkillRunMessage(skillName: string) {
    updateLastMessageContent(() => skillName, "system");
  }

  function addTextMessage(text: string) {
    updateLastMessageContent(old => old + text, "assistant");
  }

  function updateLastMessageContent(updateFn: (oldValue: string) => string, role: 'assistant' | 'system') {
    setMessages((prev) => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage && lastMessage.role === role) {
        // Append to the last message of the same role
        return [
          ...prev.slice(0, -1),
          { role, content: updateFn(lastMessage.content) },
        ];
      }
      // If the last message isn't from the assistant, add a new one
      return [...prev, { role, content: updateFn("") }];
    });
  }

  async function handle() {
    if (!inputValue.trim() || isStreaming) return;

    setMessages((prev) => [...prev, { role: "user", content: inputValue }]);
    const query = inputValue;
    setInputValue("");
    setIsStreaming(true);

    try {
      await listenForChanges(query, (data: MessagePart) => {
        if (!data.body || data.body == "\n") return;

        if (data.type === MessagePartType.Skill) {
          addSkillRunMessage(data.body);
        } else if (data.type === MessagePartType.Text) {
          addTextMessage(data.body);
        }
      });

      // Invalidate conversations list to refresh title/updatedAt
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    } finally {
      setIsStreaming(false);
    }
  }

  async function listenForChanges<T>(query: string, onData: (data: T) => void) {
    try {
      const response = await apiClient.rawRequest("/api/assistant/query", {
        method: "POST",
        body: JSON.stringify({
          query,
          conversationId: conversationId ?? undefined,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("API error:", response.status);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            const jsonData = JSON.parse(data);
            onData(jsonData);
          }
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  return (
    <Flex direction="column" height="100%" overflow="hidden">
      <Flex flex={"1"} direction="column" gap="0.5rem" overflowY="auto">
        {messages.map((msg, index) => {
          if (msg.role === "system") {
            const hasFollowingAssistant = messages
              .slice(index + 1)
              .some((m) => m.role === "assistant");
            if (hasFollowingAssistant) return null;
          }
          return <ChatBlock key={index} message={msg} />;
        })}
        {isStreaming && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </Flex>
      <Group attached w="full" pt="4" pb="2" bg="var(--color-bg-light)">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          ref={inputRef}
          placeholder={t("ai.inputPlaceholder")}
          disabled={isStreaming}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handle();
            }
          }}
        />
        <Button onClick={() => handle()} disabled={isStreaming}>
          {isStreaming ? t("ai.sending") : t("ai.send")}
        </Button>
      </Group>
    </Flex>
  );
}
