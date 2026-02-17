import { useState, useCallback } from "react";
import { Flex } from "@chakra-ui/react";
import { Chat } from "./components/Chat";
import { ChatTopBar } from "./components/ChatTopBar";
import {
  useConversations,
  useConversation,
  useCreateConversation,
  useDeleteConversation,
} from "./hooks/useConversations";

export function AssistantPage() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const { data: conversations = [], isLoading } = useConversations();
  const { data: activeConversation } = useConversation(activeConversationId);
  const createConversation = useCreateConversation();
  const deleteConversation = useDeleteConversation();

  const handleNewConversation = useCallback(async () => {
    const result = await createConversation.mutateAsync({});
    setActiveConversationId(result.id);
  }, [createConversation]);

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
  }, []);

  const handleDeleteConversation = useCallback(
    async (id: string) => {
      await deleteConversation.mutateAsync(id);
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
    },
    [deleteConversation, activeConversationId]
  );

  return (
    <Flex
      direction="column"
      height="calc(100vh - 6rem)"
      overflow="hidden"
      borderRadius="16px"
      border="1px solid var(--color-border)"
    >
      <ChatTopBar
        conversations={conversations}
        activeConversationId={activeConversationId}
        isLoading={isLoading}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />
      <Chat
        conversationId={activeConversationId}
        initialMessages={activeConversation?.messages}
      />
    </Flex>
  );
}
