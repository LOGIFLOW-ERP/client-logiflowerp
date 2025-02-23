import { alpha, Box, Stack } from '@mui/material';
import { Header, SideMenu } from '../components';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { IMenu } from '@shared/domain';

export function Dashboard() {

    const [selectedNode, setSelectedNode] = useState<IMenu | null>(null)

    return (
        <Box sx={{ display: 'flex' }}>
            <SideMenu selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
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
                    <Header selectedNode={selectedNode} />
                    <Outlet />
                </Stack>
            </Box>
        </Box>
    )
}
