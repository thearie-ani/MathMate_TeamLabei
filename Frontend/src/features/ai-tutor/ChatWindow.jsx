import ChatMessage from "./ChatMessage";

export default function ChatWindow({ messages = [] }) {
  return (
    <div className="chat-window">
      {messages.length === 0 ? (
        <p className="chat-empty">Ask your AI tutor anything…</p>
      ) : (
        messages.map((msg, i) => <ChatMessage key={i} message={msg} />)
      )}
    </div>
  );
}
