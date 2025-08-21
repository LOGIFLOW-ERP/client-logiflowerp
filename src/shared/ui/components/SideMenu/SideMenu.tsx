import {
    alpha,
    Avatar,
    Box,
    Divider,
    Drawer,
    drawerClasses,
    Stack,
    styled,
    Tooltip,
    Typography
} from '@mui/material'
import { SelectContent } from './SelectContent'
import { MenuContent } from './MenuContent'
import { OptionsMenu } from './OptionsMenu'
import { useStore } from '@shared/ui/hooks'
import { MenuDTO } from 'logiflowerp-sdk'
import VerifiedIcon from '@mui/icons-material/Verified';

const drawerWidth = 240

const CustomDrawer = styled(Drawer)({
    width: drawerWidth,
    flexShrink: 0,
    boxSizing: 'border-box',
    mt: 10,
    [`& .${drawerClasses.paper}`]: {
        width: drawerWidth,
        boxSizing: 'border-box',
    },
})

interface IProps {
    setSelectedNode: React.Dispatch<React.SetStateAction<MenuDTO | null>>
    selectedNode: MenuDTO | null
}

export function SideMenu({ setSelectedNode, selectedNode }: IProps) {

    const { state: { user } } = useStore('auth')

    return (
        <CustomDrawer
            variant='permanent'
            sx={{
                display: { xs: 'none', md: 'block' },
                [`& .${drawerClasses.paper}`]: { backgroundColor: 'background.paper' },
            }}
        >
            <Box
                sx={(theme) => ({
                    display: 'flex',
                    mt: 'calc(var(--template-frame-height, 0px) + 4px)',
                    p: 1.5,
                    backgroundColor: alpha(theme.palette.background.default, 1)
                })}
            >
                <SelectContent setSelectedNode={setSelectedNode} />
            </Box>
            <Divider />
            <Box
                sx={(theme) => ({
                    overflow: 'auto',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: alpha(theme.palette.background.default, 1)
                })}
            >
                <MenuContent selectedNode={selectedNode} />
            </Box>
            <Stack
                direction='row'
                sx={(theme) => ({
                    p: 2,
                    gap: 1,
                    alignItems: 'center',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: alpha(theme.palette.background.default, 1)
                })}
            >
                <Avatar
                    sizes='small'
                    alt='Nombres'
                    // src='/static/images/avatar/7.jpg'
                    sx={{ width: 36, height: 36 }}
                />
                <Box
                    sx={{
                        mr: 'auto', overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 0.2
                        }}
                    >
                        <Tooltip title={user.root ? 'Administrador' : 'Usuario'}>
                            <VerifiedIcon
                                sx={{ color: user.root ? 'dodgerblue' : 'gray', }}
                                fontSize="inherit"
                            />
                        </Tooltip>
                        <Typography
                            variant='body2'
                            sx={{
                                fontWeight: 500,
                                lineHeight: '16px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {user.names} {user.surnames}
                        </Typography>
                    </Box>
                    <Typography
                        variant='caption'
                        sx={{
                            color: 'text.secondary'
                        }}
                    >
                        {user.email}
                    </Typography>
                </Box>
                <OptionsMenu />
            </Stack>
        </CustomDrawer>
    )
}
