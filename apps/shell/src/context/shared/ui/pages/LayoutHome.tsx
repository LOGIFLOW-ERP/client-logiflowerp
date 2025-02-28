import { alpha, Box, Stack } from '@mui/material'
import { Header, SideMenu } from '../components'
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { IMenu } from '@shared/domain'

export function LayoutHome() {
    
    const __selectedPage = localStorage.getItem('selectedPage')
    const _selectedPage = __selectedPage ? JSON.parse(__selectedPage) as IMenu : null

    const [selectedNode, setSelectedNode] = useState<IMenu | null>(null)
    useEffect(() => {
        localStorage.setItem('selectedNode', JSON.stringify(selectedNode))
    }, [selectedNode])
    const [selectedPage, setSelectedPage] = useState<IMenu | null>(_selectedPage)

    return (
        <Box sx={{ display: 'flex' }}>
            <SideMenu
                selectedNode={selectedNode}
                setSelectedNode={setSelectedNode}
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
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
                    <Header selectedNode={selectedNode} selectedPage={selectedPage} />
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
