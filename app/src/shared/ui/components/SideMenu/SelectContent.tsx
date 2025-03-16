import {
    ListItemText,
    MenuItem,
    SelectChangeEvent,
    selectClasses,
    Select,
    styled,
    ListItemAvatar,
    Avatar,
    ListSubheader
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useStore } from '@shared/ui/hooks'
import { MenuDTO, buildMenu } from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import DatasetRounded from '@mui/icons-material/DatasetRounded'
import EngineeringRounded from '@mui/icons-material/EngineeringRounded'
import AssessmentRounded from '@mui/icons-material/AssessmentRounded'
import HelpOutline from '@mui/icons-material/HelpOutline'
import { useNavigate } from 'react-router-dom'

const iconMap: Record<string, React.ElementType> = {
    Masters: DatasetRounded,
    Processes: EngineeringRounded,
    Reports: AssessmentRounded,
}

const CustomAvatar = styled(Avatar)(({ theme }) => ({
    width: 28,
    height: 28,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    border: `1px solid ${theme.palette.divider}`,
}))

const CustomListItemAvatar = styled(ListItemAvatar)({
    minWidth: 0,
    marginRight: 12,
})

const getIcon = (iconName: string) => iconMap[iconName] || HelpOutline;

interface IProps {
    setSelectedNode: React.Dispatch<React.SetStateAction<MenuDTO | null>>
}

export function SelectContent(props: IProps) {

    const { state: { dataSystemOptions } } = useStore('auth')
    const [module, setModule] = useState('')
    const [menu, setMenu] = useState<MenuDTO[]>([])
    const { enqueueSnackbar } = useSnackbar()
    const navigate = useNavigate()
    const selectedNode = localStorage.getItem('selectedNode')
    const _selectedNode = selectedNode ? JSON.parse(selectedNode) as MenuDTO : null
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        try {
            const data = buildMenu(dataSystemOptions)
            setMenu(data)
            if (_selectedNode) {
                props.setSelectedNode(_selectedNode)
                setModule(_selectedNode.systemOption._id)
            } else if (data.length && data[0].children.length) {
                const selectedId = data[0].children[0].systemOption._id
                const selectedNode = searchSelectedNode(selectedId, data)
                props.setSelectedNode(selectedNode)
                setModule(selectedId)
                navigate(`/${selectedNode.systemOption.father}/${selectedNode.systemOption.name}`)
            }
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: '¡Ocurrió un error!', variant: 'error' })
        }
    }, [dataSystemOptions])

    const searchSelectedNode = (_id: string, menu: MenuDTO[]) => {
        const selectedNode = menu
            .flatMap(e => [e, ...e.children])
            .find(item => item.systemOption._id === _id)

        if (!selectedNode) {
            throw new Error('No se pudo obtener nodo seleccionado')
        }
        return selectedNode
    }

    const handleChange = (event: SelectChangeEvent) => {
        try {
            const selectedId = event.target.value
            const selectedNode = searchSelectedNode(selectedId, menu)
            props.setSelectedNode(selectedNode)
            setModule(selectedId)
            navigate(`/${selectedNode.systemOption.father}/${selectedNode.systemOption.name}`)
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: '¡Ocurrió un error!', variant: 'error' })
        }
    }

    return (
        <Select
            labelId='logiflow-select'
            id='logiflow-simple-select'
            value={module}
            onChange={handleChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Seleccione empresa' }}
            fullWidth
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            sx={{
                maxHeight: 56,
                width: 215,
                '&.MuiList-root': { p: '8px' },
                [`& .${selectClasses.select}`]: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    pl: 1
                }
            }}
        >
            {
                menu.flatMap(e => [
                    <ListSubheader key={`header-${e.systemOption._id}`} sx={{ pt: 0 }}>
                        {e.systemOption.name}
                    </ListSubheader>,
                    ...e.children.map((c) => {
                        const IconComponent = getIcon(c.systemOption.name);
                        return (
                            <MenuItem key={`menu-${c.systemOption._id}`} value={c.systemOption._id}>
                                <CustomListItemAvatar>
                                    <CustomAvatar alt='Menu item'>
                                        <IconComponent sx={{ fontSize: '1rem' }} />
                                    </CustomAvatar>
                                </CustomListItemAvatar>
                                <ListItemText primary={isOpen ? '' : e.systemOption.name} secondary={c.systemOption.name} />
                            </MenuItem>
                        )
                    })
                ])
            }
        </Select>
    )
}
