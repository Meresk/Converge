import React from "react";
import { useParticipants } from "@livekit/components-react";
import { Person } from "@mui/icons-material"; // MUI иконка пользователя

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
                                display: "flex",
                                alignItems: "center",
                                padding: "10px",
                                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                                fontSize: "0.95rem",
                                gap: "10px",
                            }}
                        >
                            <Person style={{ color: "#2ecc71" }} />
                            <span style={{ wordBreak: "break-word", flex: 1 }}>
                                {participant.identity}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
