import { alpha, Box, Stack } from '@mui/material';
import { Header, SideMenu } from '../components';
import { Outlet } from 'react-router-dom';

export function Dashboard() {
    return (
        <Box sx={{ display: 'flex' }}>
            <SideMenu />
            <Box
                component='main'
                sx={(theme) => ({
                    flexGrow: 1,
                    backgroundColor: alpha(theme.palette.background.default, 1),
                    overflow: 'auto',
                })}
            >
                <Stack
                    spacing={2}
                    sx={{
                        alignItems: 'center',
                        mx: 3,
                        pb: 5,
                        mt: { xs: 8, md: 0 },
                    }}
                >
                    <Header />
                    <Outlet />
                </Stack>
            </Box>
        </Box>
    )
}
