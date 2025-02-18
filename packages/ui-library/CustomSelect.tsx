import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'

interface CustomSelectProps<T> {
    label: string
    value: string | undefined
    onChange: (event: SelectChangeEvent) => void
    options: T[]
    valueKey: keyof T
    labelKey: keyof T
}

export function CustomSelect<T>({ label, value, onChange, options, valueKey, labelKey }: CustomSelectProps<T>) {
    return (
        <FormControl fullWidth size='small' margin='dense'>
            <InputLabel>{label}</InputLabel>
            <Select value={value} onChange={onChange} label={label}>
                {options.map((option, index) => {
                    const valueOption = option[valueKey]
                    const labelOption = option[labelKey]

                    if (typeof valueOption !== 'string' && typeof valueOption !== 'number') {
                        console.error(`Error en el valor del option: '${String(valueKey)}' debe ser string o number, pero es ${typeof valueOption}`)
                        return null
                    }

                    if (typeof labelOption !== 'string') {
                        console.error(`Error en el label del option: '${String(labelKey)}' debe ser string, pero es ${typeof labelOption}`)
                        return null
                    }

                    return (
                        <MenuItem key={index} value={valueOption}>
                            {labelOption}
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}
