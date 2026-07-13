import { delay, conversations, buildTutorReply } from "./mockApi";

export const sendMessage = async (message, conversationId) => {
  const reply = buildTutorReply(message);
  return delay({
    data: {
      conversationId: conversationId ?? "default",
      reply,
    },
  });
};

export const getConversations = async () => delay({ data: conversations });
