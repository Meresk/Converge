import { Card, CardContent, Typography, Box } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface RoomCardProps {
    name: string;
    isProtected: boolean;
    onClick: () => void;
}

export default function RoomCard({ name, isProtected, onClick }: RoomCardProps) {
    return (
        <Card
            onClick={onClick}
            elevation={10}
            sx={{
                height: '100%',
                cursor: 'pointer',
                bgcolor: '#1e1e1e',
                color: '#fff',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 14px 32px rgba(0, 255, 120, 0.3)',
                    bgcolor: '#263238',
                },
                '& svg': {
                    transition: 'color 0.3s ease',
                    color: isProtected ? '#ef5350' : '#66bb6a',
                },
            }}
        >
            <CardContent>
                <Typography
                    variant="h5"
                    component="div"
                    sx={{
                        fontWeight: 'bold',
                        mb: 1.5,
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                        userSelect: 'none',
                        textAlign: 'center',
                        color: '#e0e0e0',
                    }}
                >
                    {name}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 1,
                        fontWeight: 500,
                        userSelect: 'none',
                        mt: 2,
                    }}
                >
                    {isProtected ? (
                        <>
                            <LockIcon />
                            <Typography variant="body1" color="error.light">
                                Защищена паролем
                            </Typography>
                        </>
                    ) : (
                        <>
                            <LockOpenIcon />
                            <Typography variant="body1" color="success.light">
                                Открытая комната
                            </Typography>
                        </>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}