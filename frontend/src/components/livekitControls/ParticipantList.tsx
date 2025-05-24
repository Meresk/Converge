// components/ParticipantList.tsx
import React from "react";
import { useParticipants } from "@livekit/components-react";

interface ParticipantListProps {
    visible: boolean;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({ visible }) => {
    const participants = useParticipants();

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
                {participants.length === 0 ? (
                    <div style={{ fontStyle: "italic", color: "#999" }}>
                        Участников нет
                    </div>
                ) : (
                    participants.map((participant) => (
                        <div
                            key={participant.sid}
                            style={{
                                marginBottom: "8px",
                                padding: "6px 8px",
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                borderRadius: "6px",
                                wordBreak: "break-word",
                                maxWidth: "100%",
                                overflowWrap: "break-word",
                                fontSize: "0.9rem",
                                lineHeight: "1.4",
                            }}
                        >
                            {participant.identity}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
