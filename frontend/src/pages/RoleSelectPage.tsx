import { useNavigate } from "react-router-dom";
import { Box, Typography, useMediaQuery } from "@mui/material";
import teacherImg from "../assets/teacherw.png";
import studentImg from "../assets/studentw.png";
import {getToken, isTokenValid} from "../services/auth/storage.ts";
import { useTheme } from "@mui/material/styles";
import {getUserRole} from "../services/auth/authService.ts";

export default function RoleSelectPage() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const onSelectTeacher = () => {
        const token = getToken();
        if (!token || !isTokenValid()) {
            navigate("/login");
        }
        const role = getUserRole();

        if (role == "teacher") {
            navigate("/teacher");
        }
        else if (role == "admin") {
            navigate("/admin");
        }
    };

    const onSelectStudent = () => navigate("/student");

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
            }}
        >
            <Typography variant="h4" align="center" gutterBottom>
                Кто вы?
            </Typography>

            <Box
                display="flex"
                flexDirection={isSmallScreen ? "column" : "row"}
                alignItems="center"
                justifyContent="center"
                gap={4}
                mt={2}
                flexWrap="wrap"
            >
                <RoleCard
                    onClick={onSelectTeacher}
                    imgSrc={teacherImg}
                    label="Преподаватель"
                />
                <RoleCard
                    onClick={onSelectStudent}
                    imgSrc={studentImg}
                    label="Студент"
                />
            </Box>
        </Box>
    );
}

function RoleCard({ onClick, imgSrc, label }: { onClick: () => void, imgSrc: string, label: string }) {
    return (
        <Box
            onClick={onClick}
            sx={{
                textAlign: "center",
                cursor: "pointer",
                '& img': {
                    width: { xs: 150, sm: 180, md: 200 },
                    height: { xs: 150, sm: 180, md: 200 },
                    objectFit: 'cover',
                    transition: 'transform 0.3s',
                    borderRadius: 2,
                },
                '&:hover img': {
                    transform: 'scale(1.05)',
                },
            }}
        >
            <img src={imgSrc} alt={label} />
            <Typography mt={1} color="#ffffff" fontSize={{ xs: "1.2rem", sm: "1.5rem" }}>
                {label}
            </Typography>
        </Box>
    );
}
