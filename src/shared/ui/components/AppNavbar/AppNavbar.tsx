import AppBar from '@mui/material/AppBar'
import { useState } from 'react'
import { styled } from '@mui/material/styles'
import MuiToolbar from '@mui/material/Toolbar'
import { tabsClasses } from '@mui/material/Tabs'
import Stack from '@mui/material/Stack'
import MenuButton from './MenuButton'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { SideMenuMobile } from './SideMenuMobile'
import { MenuDTO } from 'logiflowerp-sdk'
// import { useLocation } from 'react-router-dom'
import { NavbarBreadcrumbs } from '../Header/NavbarBreadcrumbs'

const Toolbar = styled(MuiToolbar)({
    width: '100%',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'center',
    gap: '12px',
    flexShrink: 0,
    [`& ${tabsClasses.flexContainer}`]: {
        gap: '8px',
        p: '8px',
        pb: 0,
    },
})

interface IProps {
    setSelectedNode: React.Dispatch<React.SetStateAction<MenuDTO | null>>
    selectedNode: MenuDTO | null
}

export function AppNavbar({ setSelectedNode, selectedNode }: IProps) {
    const [open, setOpen] = useState(false)
    // const location = useLocation()

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen)
    }

    return (
        <AppBar
            position='fixed'
            sx={{
                display: { xs: 'auto', md: 'none' },
                boxShadow: 0,
                bgcolor: 'background.paper',
                backgroundImage: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider',
                top: 'var(--template-frame-height, 0px)',
            }}
        >
            <Toolbar variant='regular'>
                <Stack
                    direction='row'
                    sx={{
                        alignItems: 'center',
                        flexGrow: 1,
                        width: '100%',
                        gap: 1,
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ justifyContent: 'center', mr: 'auto' }}
                    >
                        <NavbarBreadcrumbs />
                    </Stack>
                    <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuRoundedIcon />
                    </MenuButton>
                    <SideMenuMobile
                        open={open}
                        toggleDrawer={toggleDrawer}
                        setSelectedNode={setSelectedNode}
                        selectedNode={selectedNode}
                    />
                </Stack>
            </Toolbar>
        </AppBar>
    )
}