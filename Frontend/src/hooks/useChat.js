import { useState } from 'react';

/**
 * Hook to manage AI Tutor chat state.
 */
export function useChat(initialMessages = []) {
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (text, aiResponseSimulator = null) => {
    if (!text.trim()) return;

    // 1. Add user message
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);

    // 2. Set bot typing state
    setIsTyping(true);

    try {
      // If we have an API simulator or actual API call:
      if (aiResponseSimulator) {
        const aiResponseText = await aiResponseSimulator(text);
        const aiMsg = { id: Date.now() + 1, sender: 'ai', text: aiResponseText };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        // Fallback dummy response
        setTimeout(() => {
          const aiMsg = { id: Date.now() + 1, sender: 'ai', text: "This is a simulated AI response to: " + text };
          setMessages(prev => [...prev, aiMsg]);
          setIsTyping(false);
        }, 1500);
        return; // wait for setTimeout
      }
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg = { id: Date.now() + 1, sender: 'ai', text: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return { messages, isTyping, sendMessage };
}
