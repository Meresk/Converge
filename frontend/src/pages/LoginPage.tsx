import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    InputAdornment,
    IconButton,
    Paper,
    Fade
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import type { LoginParams } from "../services/auth/types.ts";
import { saveToken } from "../services/auth/storage.ts";
import { loginRequest } from "../services/auth/authService.ts";

export default function LoginPage() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await loginRequest({ login, password } as LoginParams);
            saveToken(data.token);
            navigate("/teacher");
        } catch {
            setError("Неверный логин или пароль");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: { xs: 3, sm: 4 },
                    width: '100%',
                    maxWidth: 400,
                    borderRadius: 3,
                    backgroundColor: '#1e1e1e',
                    color: '#fff',
                    boxShadow: '0px 10px 25px rgba(0,0,0,0.3)',
                }}
            >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <LockIcon sx={{ fontSize: 48, color: '#2196f3' }} />
                    <Typography variant="h5" fontWeight={600} mt={1}>
                        Вход в систему
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Логин"
                        fullWidth
                        margin="normal"
                        required
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        autoComplete="username"
                        autoFocus
                        variant="filled"
                        InputProps={{ sx: { color: '#fff' } }}
                        InputLabelProps={{ sx: { color: '#aaa' } }}
                    />

                    <TextField
                        label="Пароль"
                        fullWidth
                        margin="normal"
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        variant="filled"
                        InputProps={{
                            sx: { color: '#fff' },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ color: '#ccc' }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        InputLabelProps={{ sx: { color: '#aaa' } }}
                    />

                    <Fade in={!!error}>
                        <Typography
                            color="error"
                            variant="body2"
                            sx={{ mt: 2, textAlign: 'center' }}
                        >
                            {error}
                        </Typography>
                    </Fade>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        sx={{
                            mt: 4,
                            py: 1.5,
                            fontWeight: 600,
                            letterSpacing: 0.5,
                            boxShadow: '0 4px 12px rgba(33,150,243,0.4)',
                            '@media (max-width: 600px)': {
                                py: 1,
                            }
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
