export interface ChatMessageDto {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface ConversationDto {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetConversationsResponse {
  conversations: ConversationDto[];
  totalCount: number;
}

export interface GetConversationResponse {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessageDto[];
}

export interface CreateConversationRequest {
  title?: string;
}

export interface CreateConversationResponse {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateConversationRequest {
  title: string;
}

export interface UpdateConversationResponse {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeleteConversationResponse {
  message: string;
}
