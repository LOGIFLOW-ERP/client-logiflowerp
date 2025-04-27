import { lazy, MouseEvent, useState } from 'react'
import { MenuButton } from './MenuButton'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import {
    styled,
    MenuItem,
    Menu,
    listClasses,
    paperClasses,
    dividerClasses,
    Divider,
    ListItemText,
    ListItemIcon,
    listItemIconClasses,
    CircularProgress
} from '@mui/material'
import { useSignOutMutation } from '@shared/api'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@shared/ui/hooks'
import { AuthUserDTO } from 'logiflowerp-sdk'
const SettingsDialog = lazy(() => import('./SettingsDialog').then(m => ({ default: m.SettingsDialog })))
const ProfileDialog = lazy(() => import('./ProfileDialog').then(m => ({ default: m.ProfileDialog })))

const CustomMenuItem = styled(MenuItem)({
    margin: '2px 0',
})

export function OptionsMenu() {

    const [signOut, { isLoading }] = useSignOutMutation()
    const { enqueueSnackbar } = useSnackbar()
    const navigate = useNavigate()
    const { setState } = useStore('auth')
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [openProfile, setOpenProfile] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);
    const open = Boolean(anchorEl)

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleClickLogout = async () => {
        try {
            await signOut().unwrap()
            // setAnchorEl(null)
            setState({ isAuthenticated: false, user: new AuthUserDTO() })
            navigate('/sign-in', { replace: true })
        } catch (error: any) {
            console.error(error)
            enqueueSnackbar({ message: '¡Ocurrió un error!', variant: 'error' })
        }
    }

    return (
        <>
            <MenuButton
                aria-label="Open menu"
                onClick={handleClick}
                sx={{ borderColor: 'transparent' }}
            >
                <MoreVertRoundedIcon />
            </MenuButton>
            <Menu
                anchorEl={anchorEl}
                id='menu'
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                sx={{
                    [`& .${listClasses.root}`]: {
                        padding: '4px',
                    },
                    [`& .${paperClasses.root}`]: {
                        padding: 0,
                    },
                    [`& .${dividerClasses.root}`]: {
                        margin: '4px -4px',
                    },
                }}
            >
                <CustomMenuItem onClick={() => { setOpenProfile(true); handleClose() }}>Perfil</CustomMenuItem>
                <CustomMenuItem onClick={handleClose}>My account</CustomMenuItem>
                <Divider />
                {/* <CustomMenuItem onClick={handleClose}>Add another account</CustomMenuItem> */}
                <CustomMenuItem onClick={() => { setOpenSettings(true); handleClose() }}>Configuración</CustomMenuItem>
                <Divider />
                <CustomMenuItem
                    onClick={handleClickLogout}
                    sx={{
                        [`& .${listItemIconClasses.root}`]: {
                            ml: 'auto',
                            minWidth: 0,
                        },
                        justifyContent: 'center'
                    }}
                >
                    {
                        isLoading
                            ? <CircularProgress size={24} color='inherit' style={{ alignSelf: 'center' }} />
                            : <>
                                <ListItemText>Salir</ListItemText>
                                <ListItemIcon>
                                    <LogoutRoundedIcon fontSize='small' />
                                </ListItemIcon>
                            </>
                    }
                </CustomMenuItem>
            </Menu>
            {
                openProfile && <ProfileDialog onClose={setOpenProfile} open={openProfile} />
            }
            {
                openSettings && <SettingsDialog onClose={setOpenSettings} open={openSettings} />
            }
        </>
    )
}
