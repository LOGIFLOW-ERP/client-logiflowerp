import { MouseEvent, useState } from 'react';
import { MenuButton } from './MenuButton'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { styled, MenuItem, Menu, listClasses, paperClasses, dividerClasses, Divider, ListItemText, ListItemIcon, listItemIconClasses } from '@mui/material'

const CustomMenuItem = styled(MenuItem)({
    margin: '2px 0',
})

export function OptionsMenu() {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    };
    const handleClose = () => {
        setAnchorEl(null)
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
                <CustomMenuItem onClick={handleClose}>Profile</CustomMenuItem>
                <CustomMenuItem onClick={handleClose}>My account</CustomMenuItem>
                <Divider />
                <CustomMenuItem onClick={handleClose}>Add another account</CustomMenuItem>
                <CustomMenuItem onClick={handleClose}>Settings</CustomMenuItem>
                <Divider />
                <CustomMenuItem
                    onClick={handleClose}
                    sx={{
                        [`& .${listItemIconClasses.root}`]: {
                            ml: 'auto',
                            minWidth: 0,
                        },
                    }}
                >
                    <ListItemText>Logout</ListItemText>
                    <ListItemIcon>
                        <LogoutRoundedIcon fontSize="small" />
                    </ListItemIcon>
                </CustomMenuItem>
            </Menu>
        </>
    )
}
