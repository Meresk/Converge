import { Box, Button, Typography, Modal, Fade, TextField, MenuItem } from '@mui/material';

interface CreateUserModalProps {
    open: boolean;
    onClose: () => void;
    onCreate: () => void;
    login: string;
    setLogin: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    roleId: number | '';
    setRoleId: (value: number | '') => void;
    loginError: boolean;
    setLoginError: (value: boolean) => void;
    passwordError: boolean;
    setPasswordError: (value: boolean) => void;
}

const roles = [
    { id: 1, name: 'Администратор' },
    { id: 2, name: 'Преподаватель' },
    { id: 3, name: 'Студент' },
];

export default function CreateUserModal({
                                            open,
                                            onClose,
                                            onCreate,
                                            login,
                                            setLogin,
                                            password,
                                            setPassword,
                                            roleId,
                                            setRoleId,
                                            loginError,
                                            setLoginError,
                                            passwordError,
                                            setPasswordError,
                                        }: CreateUserModalProps) {
    return (
        <Modal open={open} onClose={onClose} closeAfterTransition>
            <Fade in={open}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: 420 },
                        bgcolor: '#1e1e1e',
                        color: 'white',
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                        p: 4,
                        outline: 'none',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <Typography variant="h6" mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        👤 Создание нового пользователя
                    </Typography>

                    <TextField
                        fullWidth
                        label="Логин*"
                        variant="outlined"
                        value={login}
                        onChange={(e) => {
                            setLogin(e.target.value);
                            if (loginError && e.target.value.trim()) {
                                setLoginError(false);
                            }
                        }}
                        margin="normal"
                        error={loginError}
                        helperText={loginError ? 'Логин не может быть пустым' : ''}
                        InputLabelProps={{
                            sx: { color: loginError ? 'error.main' : '#bbb' },
                        }}
                        InputProps={{
                            sx: {
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: loginError ? 'error.main' : '#555',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: loginError ? 'error.main' : '#888',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: loginError ? 'error.main' : 'primary.main',
                                },
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Пароль*"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (passwordError && e.target.value.trim()) {
                                setPasswordError(false);
                            }
                        }}
                        margin="normal"
                        error={passwordError}
                        helperText={passwordError ? 'Пароль не может быть пустым' : ''}
                        InputLabelProps={{
                            sx: { color: passwordError ? 'error.main' : '#bbb' },
                        }}
                        InputProps={{
                            sx: {
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: passwordError ? 'error.main' : '#555',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: passwordError ? 'error.main' : '#888',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: passwordError ? 'error.main' : 'primary.main',
                                },
                            },
                        }}
                    />

                    <TextField
                        select
                        fullWidth
                        label="Роль"
                        value={roleId}
                        onChange={(e) => setRoleId(Number(e.target.value))}
                        margin="normal"
                        InputLabelProps={{
                            sx: { color: '#bbb' },
                        }}
                        InputProps={{
                            sx: {
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#555',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#888',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main',
                                },
                            },
                        }}
                    >
                        {roles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                                {role.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={onClose}
                            sx={{
                                borderColor: '#777',
                                color: '#ccc',
                                '&:hover': {
                                    borderColor: '#aaa',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                },
                            }}
                        >
                            Отмена
                        </Button>
                        <Button
                            variant="contained"
                            onClick={onCreate}
                            color="primary"
                            sx={{
                                fontWeight: 'bold',
                                boxShadow: '0 2px 8px rgba(46,204,113,0.7)', // эмеральд
                                backgroundColor: '#2ecc71',
                                '&:hover': {
                                    backgroundColor: '#27ae60',
                                    boxShadow: '0 4px 12px rgba(39,174,96,0.9)',
                                },
                            }}
                        >
                            Создать
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
}
