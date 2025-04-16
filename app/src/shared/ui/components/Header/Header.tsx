import { Stack, Typography } from '@mui/material'
import { NavbarBreadcrumbs } from './NavbarBreadcrumbs'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import MenuButton from './MenuButton'

export function Header() {
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
            <Stack direction="row" sx={{ gap: 1 }}>
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
                <MenuButton showBadge={false} aria-label="Open notifications">
                    <NotificationsRoundedIcon />
                </MenuButton>
                {/* <ColorModeIconDropdown /> */}
            </Stack>
        </Stack>
    )
}
