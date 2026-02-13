import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";

import type {
  ChatOutput,
  KeyboardButton,
} from "@/features/framework-ide/lib/scibotSdk";

type ChatPreviewProps = {
  outputs: ChatOutput[];
  onButtonClick: (btn: KeyboardButton) => void;
  onSendMessage: (text: string) => void;
};

export const ChatPreview = ({
  outputs,
  onButtonClick,
  onSendMessage,
}: ChatPreviewProps) => {
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [outputs]);

  const handleSend = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      const text = inputValue.trim();
      if (!text) return;
      onSendMessage(text);
      setInputValue("");
    },
    [inputValue, onSendMessage],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <>
      <div className="ide-preview-body">
        <div className="tg-chat" ref={chatRef}>
          {outputs.map((output, idx) => (
            <OutputBubble
              key={idx}
              output={output}
              onButtonClick={onButtonClick}
            />
          ))}
        </div>
      </div>
      <div className="chat-input-area">
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="chat-send" onClick={() => handleSend()}>
          ➤
        </button>
      </div>
    </>
  );
};

type OutputBubbleProps = {
  output: ChatOutput;
  onButtonClick: (btn: KeyboardButton) => void;
};

const OutputBubble = ({ output, onButtonClick }: OutputBubbleProps) => {
  if (output.type === "error") {
    return (
      <div
        className="tg-msg"
        style={{
          borderColor: "rgba(244,114,182,.2)",
          background: "rgba(244,114,182,.06)",
        }}
      >
        <span style={{ color: "var(--ac4)" }}>{output.text}</span>
      </div>
    );
  }

  if (output.type === "user") {
    return <div className="tg-msg user">{output.text}</div>;
  }

  return (
    <>
      <div className="tg-msg" style={{ whiteSpace: "pre-wrap" }}>
        {output.text}
      </div>
      {output.buttons?.map((row, ri) => (
        <div key={ri} className="tg-btn-row">
          {row.map((btn, bi) => (
            <button
              key={bi}
              className="tg-btn"
              onClick={() => onButtonClick(btn)}
            >
              {btn.text}
            </button>
          ))}
        </div>
      ))}
    </>
  );
};
