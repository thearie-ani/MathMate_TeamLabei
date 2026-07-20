import client from "./client";

// path confirmed: POST /api/chat/  (chatbotRoutes.js mounted at /api/chat)
export const sendChatMessage = async (message) => {
  const res = await client.post("/chat", { message }); // ⚠️ body shape still a guess
  return res.data; // ⚠️ response shape still a guess
};