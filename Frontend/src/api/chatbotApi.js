// import api from "./axios";

// export const chatbotApi = {
//   sendMessage: (message, topic) => api.post("/chat", { message, topic }),
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