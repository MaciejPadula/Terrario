import { Box, Button, Flex, IconButton, Spinner, Text } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  MdAdd,
  MdExpandMore,
  MdDelete,
  MdChatBubbleOutline,
} from "react-icons/md";
import type { ConversationDto } from "../shared/types";

interface ChatTopBarProps {
  conversations: ConversationDto[];
  activeConversationId: string | null;
  isLoading: boolean;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export function ChatTopBar({
  conversations,
  activeConversationId,
  isLoading,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}: ChatTopBarProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <Box
      ref={dropdownRef}
      position="relative"
      borderBottom="1px solid var(--color-border)"
      bg="var(--color-bg-secondary)"
    >
      <Flex align="center" gap="0.5rem" px="3" py="2">
        {/* Conversation selector toggle */}
        <Button
          variant="ghost"
          size="sm"
          flex="1"
          justifyContent="space-between"
          onClick={() => setIsOpen((prev) => !prev)}
          fontWeight="normal"
          overflow="hidden"
        >
          <Flex align="center" gap="0.5rem" overflow="hidden">
            <MdChatBubbleOutline size={16} />
            <Text truncate fontSize="sm">
              {activeConversation?.title ?? t("ai.selectConversation")}
            </Text>
          </Flex>
          <Box
            transition="transform 0.2s"
            transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
            flexShrink={0}
          >
            <MdExpandMore size={18} />
          </Box>
        </Button>

        {/* New conversation button */}
        <IconButton
          aria-label={t("ai.newConversation")}
          size="sm"
          bg="var(--color-primary-light)"
          color="white"
          _hover={{ bg: "var(--color-primary-lighter)" }}
          onClick={() => {
            onNewConversation();
            setIsOpen(false);
          }}
          flexShrink={0}
        >
          <MdAdd size={18} />
        </IconButton>
      </Flex>

      {/* Dropdown panel */}
      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          right="0"
          zIndex="dropdown"
          bg="var(--color-bg-primary)"
          border="1px solid var(--color-border)"
          borderTop="none"
          borderRadius="0 0 12px 12px"
          boxShadow="var(--box-shadow-light)"
          maxH="300px"
          overflowY="auto"
          p="0.5rem"
        >
          {isLoading ? (
            <Flex justify="center" py="1.5rem">
              <Spinner size="sm" color="var(--color-primary-light)" />
            </Flex>
          ) : conversations.length === 0 ? (
            <Text
              fontSize="sm"
              color="var(--color-text-secondary)"
              textAlign="center"
              py="1.5rem"
            >
              {t("ai.noConversations")}
            </Text>
          ) : (
            <Flex direction="column" gap="0.25rem">
              {conversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId;
                return (
                  <Flex
                    key={conversation.id}
                    align="center"
                    gap="0.5rem"
                    px="0.75rem"
                    py="0.5rem"
                    borderRadius="8px"
                    cursor="pointer"
                    bg={isActive ? "var(--color-primary-light)" : "transparent"}
                    color={isActive ? "white" : "var(--color-text-primary)"}
                    _hover={{
                      bg: isActive
                        ? "var(--color-primary-light)"
                        : "var(--color-bg-tertiary)",
                    }}
                    transition="all 0.15s ease"
                    onClick={() => {
                      onSelectConversation(conversation.id);
                      setIsOpen(false);
                    }}
                  >
                    <Box flexShrink={0}>
                      <MdChatBubbleOutline size={14} />
                    </Box>
                    <Text flex="1" fontSize="sm" truncate>
                      {conversation.title}
                    </Text>
                    <IconButton
                      aria-label={t("ai.deleteConversation")}
                      size="2xs"
                      variant="ghost"
                      color={isActive ? "white" : "var(--color-text-secondary)"}
                      _hover={{ color: "red.500", bg: "red.50" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                      }}
                    >
                      <MdDelete size={12} />
                    </IconButton>
                  </Flex>
                );
              })}
            </Flex>
          )}
        </Box>
      )}
    </Box>
  );
}
