import {useParticipants} from "@livekit/components-react";

export function ParticipantList() {
    const participants = useParticipants();

    return (
        <div style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 20,
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
            maxHeight: "50vh",
            overflowY: "auto",
            fontSize: "14px"
        }}>
            <div style={{ fontWeight: "bold", marginBottom: "6px" }}>Участники:</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {participants.map((p) => (
                    <li key={p.sid}>{p.identity}</li>
                ))}
            </ul>
        </div>
    );
}
