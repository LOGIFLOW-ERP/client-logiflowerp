import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import PersonRounded from '@mui/icons-material/PersonRounded'
import HelpOutline from '@mui/icons-material/HelpOutline'
import { IMenu } from '@shared/domain';

const secondaryListItems = [
    { text: 'Settings', icon: <SettingsRoundedIcon /> },
    { text: 'About', icon: <InfoRoundedIcon /> },
    { text: 'Feedback', icon: <HelpRoundedIcon /> },
]
const iconMap: Record<string, React.ElementType> = {
    User: PersonRounded,
    // Home: Icons.Home,
    // Settings: Icons.Settings,
    // Dashboard: Icons.Dashboard,
}
interface IProps {
    selectedNode: IMenu | null
}
const getIcon = (iconName: string) => iconMap[iconName] || HelpOutline;
export function MenuContent({ selectedNode }: IProps) {

    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
            <List dense>
                {
                    selectedNode
                        ? selectedNode.children.map((item, index) => {
                            const IconComponent = getIcon(item.systemOption.name);
                            return (
                                <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                                    <ListItemButton selected={index === 0}>
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
