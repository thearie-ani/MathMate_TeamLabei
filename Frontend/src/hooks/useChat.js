import { useState } from "react";
import { chatbotApi } from "../api/chatbotApi";

export function useChat(topic) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const { data } = await chatbotApi.sendMessage(text, topic);
      // defensive: handles answer / response / reply, whichever FastAPI actually uses
      const reply = data.answer ?? data.response ?? data.reply ?? "No response received.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
}