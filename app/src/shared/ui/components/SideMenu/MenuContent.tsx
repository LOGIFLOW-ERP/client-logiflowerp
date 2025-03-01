import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
// import PersonRounded from '@mui/icons-material/PersonRounded'
import TransformRounded from '@mui/icons-material/TransformRounded'
import CategoryRounded from '@mui/icons-material/CategoryRounded'
import MonetizationOnRounded from '@mui/icons-material/MonetizationOnRounded'
import LocalOfferRounded from '@mui/icons-material/LocalOfferRounded'
import ScaleRounded from '@mui/icons-material/ScaleRounded'
import HelpOutline from '@mui/icons-material/HelpOutline'
import { IMenu } from '@shared/domain';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const secondaryListItems = [
    { text: 'Settings', icon: <SettingsRoundedIcon /> },
    { text: 'About', icon: <InfoRoundedIcon /> },
    { text: 'Feedback', icon: <HelpRoundedIcon /> },
]
const iconMap: Record<string, React.ElementType> = {
    // User: PersonRounded,
    Movement: TransformRounded,
    'Product Group': CategoryRounded,
    'Product Price': LocalOfferRounded,
    Currency: MonetizationOnRounded,
    'Unit Of Measure': ScaleRounded,
}
interface IProps {
    selectedNode: IMenu | null
}

const getIcon = (iconName: string) => iconMap[iconName] || HelpOutline

export function MenuContent({ selectedNode }: IProps) {

    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()
    const location = useLocation()

    const clickSelectedPage = (item: IMenu) => {
        try {
            navigate(`/${item.systemOption.prefix}/${item.systemOption.father}/${item.systemOption.name}`)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: '¡Ocurrió un error!', variant: 'error' })
        }
    }

    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
            <List dense>
                {
                    selectedNode
                        ? selectedNode.children.map((item, index) => {
                            const IconComponent = getIcon(item.systemOption.name);
                            return (
                                <ListItem
                                    key={index}
                                    disablePadding
                                    sx={{ display: 'block' }}
                                    onClick={() => clickSelectedPage(item)}
                                >
                                    <ListItemButton selected={
                                        `/${item.systemOption.prefix}/${item.systemOption.father}/${item.systemOption.name}` === location.pathname.replace('%20', ' ')}>
                                        {
                                            IconComponent && <ListItemIcon><IconComponent /></ListItemIcon>
                                        }
                                        <ListItemText primary={item.systemOption.name} />
                                    </ListItemButton>
                                </ListItem>
                            )
                        })
                        : null
                }
            </List>
            <List dense>
                {
                    secondaryListItems.map((item, index) => (
                        <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))
                }
            </List>
        </Stack>
    )
}
