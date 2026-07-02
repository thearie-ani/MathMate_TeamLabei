import api from "./axios";

export const sendMessage = (message, conversationId) =>
  api.post("/tutor/chat", { message, conversationId });

export const getConversations = () =>
  api.get("/tutor/conversations");
