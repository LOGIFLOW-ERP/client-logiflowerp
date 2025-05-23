import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'

interface CustomSelectProps<T> {
    label: string
    value: string | undefined
    name: string
    onChange: (event: SelectChangeEvent) => void
    options: T[]
    valueKey: keyof T
    labelKey: keyof T
    margin?: 'dense' | 'normal' | 'none' | undefined
    error?: boolean
    helperText?: string
    disabled?: boolean
    isLoading?: boolean
    isError?: boolean
}

export function CustomSelect<T>({
    label,
    value,
    onChange,
    options,
    valueKey,
    labelKey,
    name,
    margin,
    error,
    helperText,
    disabled,
    isLoading,
    isError
}: CustomSelectProps<T>) {
    return (
        <FormControl fullWidth size='small' margin={margin} error={error}>
            <InputLabel>{label}</InputLabel>
            <Select value={value ?? ''} onChange={onChange} label={label} name={name} disabled={disabled || isLoading}>
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
            {error && <FormHelperText>{helperText}</FormHelperText>}
            {isError && <FormHelperText error>{`¡No se pudo obtener data ${label.toLowerCase()}!`}</FormHelperText>}
        </FormControl>
    )
}
