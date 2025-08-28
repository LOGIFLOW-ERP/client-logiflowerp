import { styled, Typography } from '@mui/material'
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import { useLocation } from 'react-router-dom'
import { Children } from 'react'
import { useTranslation } from 'react-i18next'

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    [`& .${breadcrumbsClasses.separator}`]: {
        color: theme.palette.action.disabled,
        margin: 1
    },
    [`& .${breadcrumbsClasses.ol}`]: { alignItems: 'center' }
}))

export function NavbarBreadcrumbs() {

    const location = useLocation()
    const { t } = useTranslation()
    const pathnames = location.pathname.split("/").filter((x) => x)

    return (
        <StyledBreadcrumbs
            aria-label='breadcrumb'
            separator={<NavigateNextRoundedIcon fontSize='small' />}
        >
            {
                Children.toArray(
                    pathnames.map((el, i) => (
                        <Typography
                            variant='body1'
                            sx={pathnames.length - 1 === i ? { color: 'text.primary', fontWeight: 600 } : {}}
                        >
                            {t(el.replaceAll('%20', ' ').replace(/([a-z])([A-Z])/g, '$1 $2'))}
                        </Typography>
                    ))
                )
            }
        </StyledBreadcrumbs>
    )
}
