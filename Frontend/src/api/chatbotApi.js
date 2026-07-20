import api from "./axios";

export const chatbotApi = {
  sendMessage: (message, topic) => api.post("/chat", { message, topic }),
};