// import client from "./client";

// // path confirmed: POST /api/chat/  (chatbotRoutes.js mounted at /api/chat)
// export const sendChatMessage = async (message) => {
//   const res = await client.post("/chat", { message }); // ⚠️ body shape still a guess
//   return res.data; // ⚠️ response shape still a guess
// };


import api from "./axios";

export const chatbotApi = {
  sendMessage: (message, topic, imageFile = null) => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("message", message);
      formData.append("topic", topic);
      formData.append("image", imageFile);

      return api.post("/chat", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    return api.post("/chat", { message, topic });
  },
};