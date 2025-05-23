// components/CustomChat.tsx
import React, { useEffect, useRef, useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import {getToken} from "../../services/auth/storage.ts";
import SendIcon from '@mui/icons-material/Send';

interface ChatMessage {
    sender: string;
    message: string;
    timestamp: string;
}

interface CustomChatProps {
    visible: boolean;
}

export const CustomChat: React.FC<CustomChatProps> = ({ visible }) => {
    const room = useRoomContext();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const jwtToken = getToken();

    useEffect(() => {
        const handleDataReceived = (payload: Uint8Array, participant: any) => {
            const text = new TextDecoder().decode(payload);
            const parsed = JSON.parse(text);

            if (parsed.type === "chat-message") {
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: participant.name || "Неизвестный",
                        message: parsed.message,
                        timestamp: new Date().toLocaleTimeString(),
                    },
                ]);
            }
        };

        room.on("dataReceived", handleDataReceived);
        return () => {
            room.off("dataReceived", handleDataReceived);
        };
    }, [room]);

    const sendMessage = async () => {
        if (input.trim() === "") return;

        const data = JSON.stringify({
            type: "chat-message",
            message: input,
        });

        await room.localParticipant.publishData(
            new TextEncoder().encode(data),
            { reliable: true }
        );

        setMessages((prev) => [
            ...prev,
            {
                sender: "Вы",
                message: input,
                timestamp: new Date().toLocaleTimeString(),
            },
        ]);

        setInput("");
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!visible) return null;

    return (
        <div
            style={{
                position: "absolute",
                right: "0px",
                top: "8px",
                bottom: "calc(var(--lk-control-bar-height) + 8px)",
                width: "300px",
                backgroundColor: "#1e1e1e",
                color: "#f1f1f1",
                display: "flex",
                flexDirection: "column",
                zIndex: 5,
                borderRadius: "12px",
                boxShadow: "0 0 15px rgba(0,0,0,0.5)",
                overflow: "hidden",

            }}
        >
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "10px",
                }}
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        style={{
                            marginBottom: "8px",
                            padding: "6px 8px",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            borderRadius: "6px",
                            wordBreak: "break-word", // ключевая строка!
                            maxWidth: "100%", // ограничивает ширину в пределах контейнера
                            overflowWrap: "break-word",
                            fontSize: "0.9rem",
                            lineHeight: "1.4",
                        }}
                    >
                        {msg.message}
                        <div style={{ fontSize: "0.7rem", color: "#aaa", marginTop: "4px", textAlign: "right" }}>
                            {msg.timestamp}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            {jwtToken && (
                <div
                    style={{
                        display: "flex",
                        borderTop: "1px solid #444",
                        padding: "8px",
                        backgroundColor: "#2c2c2c",
                        gap: "8px",
                    }}
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Введите сообщение..."
                        style={{
                            flexGrow: 1,
                            minWidth: 0, // ключевая строка!
                            padding: "8px",
                            border: "none",
                            borderRadius: "4px",
                            backgroundColor: "#3c3c3c",
                            color: "#fff",
                        }}
                    />

                    <button
                        onClick={sendMessage}
                        style={{
                            flexShrink: 0,
                            padding: "8px",
                            backgroundColor: "#2ecc71",
                            border: "none",
                            borderRadius: "4px",
                            color: "white",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        aria-label="Отправить сообщение"
                    >
                        <SendIcon />
                    </button>
                </div>
            )}
        </div>

    );
};
