import { useState } from "react";
import Button from "../../components/ui/Button";

export default function ChatInput({ onSend, disabled = false }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <input
        className="chat-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask anything…"
        disabled={disabled}
      />
      <Button type="submit" disabled={disabled || !value.trim()}>Send</Button>
    </form>
  );
}
