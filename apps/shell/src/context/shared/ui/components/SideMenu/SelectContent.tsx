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
import { useState } from 'react'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'

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

export function SelectContent() {

    const [company, setCompany] = useState('')

    const handleChange = (event: SelectChangeEvent) => {
        setCompany(event.target.value)
    }

    return (
        <Select
            labelId='logiflow-select'
            id='logiflow-simple-select'
            value={company}
            onChange={handleChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Seleccione empresa' }}
            fullWidth
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
            <ListSubheader sx={{ pt: 0 }}>Configuración</ListSubheader>
            <MenuItem value=''>
                <CustomListItemAvatar>
                    <CustomAvatar alt='Mantenimientos'>
                        <SettingsRoundedIcon sx={{ fontSize: '1rem' }} />
                    </CustomAvatar>
                </CustomListItemAvatar>
                <ListItemText primary='Mantenimientos' secondary='Configuración' />
            </MenuItem>
            <ListSubheader sx={{ pt: 0 }}>Logística</ListSubheader>
            <MenuItem value={10}>
                <CustomListItemAvatar>
                    <CustomAvatar alt='Procesos'>
                        <LocalShippingRoundedIcon sx={{ fontSize: '1rem' }} />
                    </CustomAvatar>
                </CustomListItemAvatar>
                <ListItemText primary='Procesos' secondary='Logística' />
            </MenuItem>
        </Select>
    )
}
