import { alpha, Box, Stack } from '@mui/material'
import { Header, SideMenu } from '../components'
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { MenuDTO } from 'logiflowerp-sdk'

export function LayoutHome() {

    const [selectedNode, setSelectedNode] = useState<MenuDTO | null>(null)
    useEffect(() => {
        localStorage.setItem('selectedNode', JSON.stringify(selectedNode))
    }, [selectedNode])

    return (
        <Box sx={{ display: 'flex' }}>
            <SideMenu
                selectedNode={selectedNode}
                setSelectedNode={setSelectedNode}
            />
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
                    <Box
                        sx={{
                            display: 'flex',
                            width: '100%'
                        }}
                    >
                        <Outlet />
                    </Box>
                </Stack>
            </Box>
        </Box>
    )
}
