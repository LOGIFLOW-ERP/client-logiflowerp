import { Box, ListItemIcon, Menu, MenuItem, Stack, Typography } from '@mui/material'
import { NavbarBreadcrumbs } from './NavbarBreadcrumbs'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import MenuButton from './MenuButton'
import { useSocketEvent } from '@shared/infrastructure/socket/useSocket';
import {
    notificationApi,
    pathNotificationApi,
    useGetAllNotificationsQuery,
    useUpdateNotificationMutation,
} from '@shared/infrastructure/redux/api';
import { NotificationENTITY, StateNotification, TypeNotification, UpdateNotificationDTO } from 'logiflowerp-sdk';
import { useDispatch } from 'react-redux';
import { useInvalidatesTags, useSound } from '@shared/ui/hooks';
import { useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DangerousIcon from '@mui/icons-material/Dangerous'
import InfoIcon from '@mui/icons-material/Info'
import DoneIcon from '@mui/icons-material/Done'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import RemoveDoneIcon from '@mui/icons-material/RemoveDone'
import { NotificationDialog } from './NotificationDialog';
import { useSnackbar } from 'notistack';

export function Header() {
    const { data, isFetching } = useGetAllNotificationsQuery()
    const dispatch = useDispatch()
    const playNotification = useSound()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const [notification, setNotification] = useState<NotificationENTITY>()
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const { enqueueSnackbar } = useSnackbar()
    const [updateNotification, { isLoading }] = useUpdateNotificationMutation() 
    const invalidateTags = useInvalidatesTags()

    useSocketEvent('notification:insertOne', (noti) => {
        playNotification()
        invalidateTags(noti.invalidatesTags)
        dispatch(
            notificationApi.util.invalidateTags([
                { type: pathNotificationApi, id: `LIST${pathNotificationApi}` }
            ])
        )
    })

    const handleMenuItemClick = async (option: NotificationENTITY) => {
        try {
            setAnchorEl(null)
            setNotification(option)
            setOpenDialog(true)
            const data: UpdateNotificationDTO = {
                estado: StateNotification.VIEWED
            }
            if (option.estado === StateNotification.PENDING) {
                await updateNotification({ id: option._id, data }).unwrap()
            }
        } catch (error) {
            console.log(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const unreadCount = data?.filter(n => n.estado === StateNotification.PENDING).length ?? 0

    return (
        <Stack
            direction='row'
            sx={{
                display: { xs: 'none', md: 'flex' },
                width: '100%',
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                maxWidth: { sm: '100%', md: '1700px' },
                pt: 1.5,
            }}
            spacing={2}
        >
            <NavbarBreadcrumbs />
            <Stack direction='row' sx={{ gap: 1 }}>
                {/* <Search />
                <CustomDatePicker /> */}
                <Typography
                    sx={{
                        alignSelf: 'center',
                        border: 1,
                        paddingX: 2,
                        borderRadius: 1,
                        borderColor: 'gray',
                        color: 'gray'
                    }}
                    variant='button'
                >
                    {new Date().toLocaleDateString()}
                </Typography>
                <MenuButton
                    showBadge={unreadCount > 0}
                    aria-label='Open notifications'
                    loading={isFetching || isLoading}
                    onClick={handleClickListItem}
                >
                    <NotificationsRoundedIcon />
                </MenuButton>
                <Menu
                    id='lock-menu'
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => setAnchorEl(null)}
                    slotProps={{
                        list: {
                            'aria-labelledby': 'lock-button',
                            role: 'listbox',
                        },
                    }}
                >
                    {
                        (data && data.length)
                            ? data?.map((option) => {
                                let Icon = <InfoIcon fontSize='small' color='info' />
                                switch (option.tipo) {
                                    case TypeNotification.ERROR:
                                        Icon = <DangerousIcon fontSize='small' color='error' />
                                        break
                                    case TypeNotification.SUCCESS:
                                        Icon = <CheckCircleIcon fontSize='small' color='success' />
                                        break
                                }

                                let IconView = <DoneIcon fontSize='small' />
                                switch (option.estado) {
                                    case StateNotification.VIEWED:
                                        IconView = <DoneAllIcon fontSize='small' color='info' />
                                        break;
                                    case StateNotification.DISCARDED:
                                        IconView = <RemoveDoneIcon fontSize='small' color='info' />
                                        break
                                }

                                return (
                                    <MenuItem
                                        onClick={() => handleMenuItemClick(option)}
                                        sx={{ width: 420 }}
                                        key={option._id}
                                        style={{ backgroundColor: StateNotification.VIEWED === option.estado ? 'inherit' : '#d9d9d9' }}
                                    >
                                        <ListItemIcon>{Icon}</ListItemIcon>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: 'block',
                                                    pr: 2 // espacio para el icono de la derecha
                                                }}
                                            >
                                                {option.titulo}
                                            </Typography>

                                            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                                                {new Date(option.fechaCreacion).toLocaleString()}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                right: 8
                                            }}
                                        >
                                            {IconView}
                                        </Box>
                                    </MenuItem>
                                )
                            })
                            : <MenuItem
                                sx={{ width: 420 }}
                            >
                                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                                    ¡Sin notificaciones 🔔!
                                </Typography>
                            </MenuItem>
                    }
                </Menu>
            </Stack>
            {
                notification
                    ? <NotificationDialog
                        onClose={setOpenDialog}
                        open={openDialog}
                        notification={notification}
                    />
                    : null
            }
        </Stack>
    )
}
