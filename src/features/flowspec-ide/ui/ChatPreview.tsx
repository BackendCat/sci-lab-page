import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";

import type { ChatMessage } from "@/features/flowspec-ide/lib/renderer";
import type { FlowMedia } from "@/features/flowspec-ide/lib/parser";

type ChatPreviewProps = {
  messages: ChatMessage[];
  onButtonClick: (target: string) => void;
  onSendMessage: (text: string) => void;
};

export const ChatPreview = ({
  messages,
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
  }, [messages]);

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
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
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

type MessageBubbleProps = {
  message: ChatMessage;
  onButtonClick: (target: string) => void;
};

const MessageBubble = ({ message, onButtonClick }: MessageBubbleProps) => {
  if (message.type === "error") {
    return (
      <div
        className="tg-msg"
        style={{
          borderColor: "rgba(244,114,182,.2)",
          background: "rgba(244,114,182,.06)",
        }}
      >
        <span style={{ color: "var(--ac4)" }}>{message.content}</span>
      </div>
    );
  }

  if (message.type === "user") {
    return <div className="tg-msg user">{message.content}</div>;
  }

  return (
    <>
      {message.media && message.media.map((m, i) => (
        <MediaBubble key={`${message.id}-m${i}`} media={m} />
      ))}
      {message.texts ? (
        message.texts.map((text, i) => (
          <div key={`${message.id}-t${i}`} className="tg-msg">
            {text}
          </div>
        ))
      ) : (
        message.content && <div className="tg-msg">{message.content}</div>
      )}
      {message.buttons && message.buttons.length > 0 && (
        <div className="tg-btn-row">
          {message.buttons.map((btn, i) => (
            <button
              key={`${message.id}-b${i}`}
              className="tg-btn"
              onClick={() => onButtonClick(btn.target)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

const MediaBubble = ({ media }: { media: FlowMedia }) => {
  switch (media.type) {
    case "image":
      return (
        <div className="tg-msg tg-media">
          <div className="tg-media-img">
            <img src={media.url} alt={media.caption ?? "image"} />
          </div>
          {media.caption && <div className="tg-media-caption">{media.caption}</div>}
        </div>
      );
    case "audio":
      return (
        <div className="tg-msg tg-media">
          <div className="tg-media-audio">
            <div className="tg-audio-icon">&#9835;</div>
            <div className="tg-audio-info">
              <div className="tg-audio-title">{media.caption ?? "Audio message"}</div>
              <div className="tg-audio-bar">
                <div className="tg-audio-progress" />
              </div>
              <div className="tg-audio-time">Audio</div>
            </div>
          </div>
        </div>
      );
    case "video":
      return (
        <div className="tg-msg tg-media">
          <div className="tg-media-video">
            <div className="tg-video-placeholder">
              <span className="tg-video-play">&#9654;</span>
            </div>
          </div>
          {media.caption && <div className="tg-media-caption">{media.caption}</div>}
        </div>
      );
    case "document":
      return (
        <div className="tg-msg tg-media">
          <div className="tg-media-doc">
            <div className="tg-doc-icon">&#128196;</div>
            <div className="tg-doc-info">
              <div className="tg-doc-name">{media.caption ?? "Document"}</div>
              <div className="tg-doc-size">PDF, 2.4 MB</div>
            </div>
          </div>
        </div>
      );
    case "location":
      return (
        <div className="tg-msg tg-media">
          <div className="tg-media-location">
            <div className="tg-location-map">
              <span className="tg-location-pin">&#128205;</span>
            </div>
            {media.caption && <div className="tg-media-caption">{media.caption}</div>}
          </div>
        </div>
      );
    case "sticker":
      return (
        <div className="tg-sticker">
          <span style={{ fontSize: "3rem" }}>{media.url}</span>
        </div>
      );
    default:
      return null;
  }
};
