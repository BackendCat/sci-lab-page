/* ═══ Shared chat preview wrapper ═══
 * Provides the scroll-to-bottom chat container + message input area.
 * Used by FlowSpec ChatPreview and Framework ChatPreview.
 */

import { type FormEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";

type ChatShellProps = {
  children: ReactNode;
  /** Dependency that triggers auto-scroll (e.g. messages array) */
  scrollDep: unknown;
  onSendMessage: (text: string) => void;
};

export const ChatShell = ({ children, scrollDep, onSendMessage }: ChatShellProps) => {
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [scrollDep]);

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
          {children}
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
