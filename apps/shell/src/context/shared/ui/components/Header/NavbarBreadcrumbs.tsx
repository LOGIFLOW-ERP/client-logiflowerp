import { styled, Typography } from '@mui/material'
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import { IMenu } from '@shared/domain'

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    [`& .${breadcrumbsClasses.separator}`]: {
        color: theme.palette.action.disabled,
        margin: 1
    },
    [`& .${breadcrumbsClasses.ol}`]: { alignItems: 'center' }
}))

interface IProps {
    selectedNode: IMenu | null
}

export function NavbarBreadcrumbs({ selectedNode }: IProps) {

    if (!selectedNode) return <StyledBreadcrumbs></StyledBreadcrumbs>

    return (
        <StyledBreadcrumbs
            aria-label='breadcrumb'
            separator={<NavigateNextRoundedIcon fontSize='small' />}
        >
            <Typography variant='body1'>{selectedNode.systemOption.father}</Typography>
            <Typography variant='body1' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {selectedNode.systemOption.name}
            </Typography>
        </StyledBreadcrumbs>
    )
}
