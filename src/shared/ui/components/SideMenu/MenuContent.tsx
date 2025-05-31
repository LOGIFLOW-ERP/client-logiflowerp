import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material'
// import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
// import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
// import PersonRounded from '@mui/icons-material/PersonRounded'
import TransformRounded from '@mui/icons-material/TransformRounded'
import CategoryRounded from '@mui/icons-material/CategoryRounded'
import MonetizationOnRounded from '@mui/icons-material/MonetizationOnRounded'
import LocalOfferRounded from '@mui/icons-material/LocalOfferRounded'
import ScaleRounded from '@mui/icons-material/ScaleRounded'
import HelpOutline from '@mui/icons-material/HelpOutline'
import LocalConvenienceStoreRounded from '@mui/icons-material/LocalConvenienceStoreRounded'
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import EngineeringRoundedIcon from '@mui/icons-material/EngineeringRounded'
import InputRoundedIcon from '@mui/icons-material/InputRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { MenuDTO } from 'logiflowerp-sdk'
import { useState } from 'react';
import { AboutDialog } from './AboutDialog';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import Rotate90DegreesCcwRoundedIcon from '@mui/icons-material/Rotate90DegreesCcwRounded';
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded';

// const secondaryListItems = [
//     { text: 'Settings', icon: <SettingsRoundedIcon /> },
//     { text: 'Sobre Nosotros', icon: <InfoRoundedIcon /> },
//     { text: 'Enviar comentarios', icon: <HelpRoundedIcon /> },
// ]
const iconMap: Record<string, React.ElementType> = {
    // User: PersonRounded,
    Movement: TransformRounded,
    'Product Group': CategoryRounded,
    'Product Price': LocalOfferRounded,
    Currency: MonetizationOnRounded,
    'Unit Of Measure': ScaleRounded,
    Store: LocalConvenienceStoreRounded,
    'Root Company': BusinessRoundedIcon,
    Company: BusinessRoundedIcon,
    Profile: AdminPanelSettingsRoundedIcon,
    Personnel: EngineeringRoundedIcon,
    'Warehouse Entry': InputRoundedIcon,
    Product: WidgetsRoundedIcon,
    'Warehouse Exit': LocalShippingRoundedIcon,
    'Warehouse Return': Rotate90DegreesCcwRoundedIcon,
    'Warehouse Stock': Inventory2RoundedIcon,
}
interface IProps {
    selectedNode: MenuDTO | null
}

const getIcon = (iconName: string) => iconMap[iconName] || HelpOutline

export function MenuContent({ selectedNode }: IProps) {

    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()
    const location = useLocation()
    const [aboutOpen, setAboutOpen] = useState(false)

    const clickSelectedPage = (item: MenuDTO, selectedNode: MenuDTO) => {
        try {
            navigate(`/${item.systemOption.prefix}/${selectedNode.systemOption.name}/${item.systemOption.name.replaceAll(' ', '')}`)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: '¡Ocurrió un error!', variant: 'error' })
        }
    }

    return (
        <>
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
                                        onClick={() => clickSelectedPage(item, selectedNode)}
                                    >
                                        <ListItemButton selected={
                                            `/${item.systemOption.prefix}/${selectedNode.systemOption.name}/${item.systemOption.name.replaceAll(' ', '')}` === location.pathname.replaceAll('%20', '')}>
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
                    {/* {
                        secondaryListItems.map((item, index) => ( */}
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton onClick={() => setAboutOpen(true)}>
                            <ListItemIcon><InfoRoundedIcon /></ListItemIcon>
                            <ListItemText primary='Sobre la app' />
                        </ListItemButton>
                    </ListItem>
                    {/* ))
                    } */}
                </List>
            </Stack>
            {
                aboutOpen && (<AboutDialog open={aboutOpen} setOpen={setAboutOpen} />)
            }
        </>
    )
}
