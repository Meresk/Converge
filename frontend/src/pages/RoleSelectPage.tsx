import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import teacherImg from "../assets/teacherw.png";
import studentImg from "../assets/studentw.png";
import {getToken} from "../services/auth/storage.ts";

export default function RoleSelectPage() {
    const navigate = useNavigate();

    const onSelectTeacher = () => {
        const token = getToken()
        if (token == null) {
            navigate("/login");
        } else {
            navigate("/teacher");
        }

    }
    const onSelectStudent = () => navigate("/student");

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1>Кто вы?</h1>
            <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
                <Box
                    onClick={onSelectTeacher}
                    sx={{
                        textAlign: "center",
                        cursor: "pointer",
                        '& img': {
                            width: 200,
                            height: 200,
                            objectFit: 'cover',
                            transition: 'transform 0.3s',
                        },
                        '&:hover img': {
                            transform: 'scale(1.1)',
                        },
                    }}
                >
                    <img src={teacherImg} alt="Преподаватель" />
                    <div style={{ marginTop: '0.5rem', color: '#ffffff', fontSize: '1.5rem' }}>
                        Преподаватель
                    </div>
                </Box>

                <Box
                    onClick={onSelectStudent}
                    sx={{
                        textAlign: "center",
                        cursor: "pointer",
                        '& img': {
                            width: 200,
                            height: 200,
                            objectFit: 'cover',
                            transition: 'transform 0.3s',
                        },
                        '&:hover img': {
                            transform: 'scale(1.1)',
                        },
                    }}
                >
                    <img src={studentImg} alt="Студент" />
                    <div style={{ marginTop: '0.5rem', color: '#ffffff', fontSize: '1.5rem' }}>
                        Студент
                    </div>
                </Box>
            </div>
        </div>
    );
}
