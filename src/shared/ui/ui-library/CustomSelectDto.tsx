import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent
} from '@mui/material'

type Join<K, P> = K extends string | number
    ? P extends string | number
    ? `${K}.${P}`
    : never
    : never;

// Hasta 2 niveles
type Keys<T> = {
    [K in keyof T]: T[K] extends object
    ? T[K] extends Date | Array<any> | Function
    ? K
    : K | Join<K, keyof T[K]>
    : K
}[keyof T];

type LabelKey<T> = Keys<T>;

interface CustomSelectProps<T> {
    label: string
    value: T | undefined
    name: string
    onChange: (...event: any[]) => void
    options: T[]
    valueKey: keyof T
    labelKey: keyof T | (LabelKey<T> | ' - ' | ' ')[];
    margin?: 'dense' | 'normal' | 'none' | undefined
    error?: boolean
    helperText?: string
    readOnly?: boolean
    autoFocus?: boolean
    isLoading?: boolean
    isError?: boolean
}

export function CustomSelectDto<T>({
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
    readOnly,
    autoFocus,
    isLoading,
    isError
}: CustomSelectProps<T>) {

    const resolvedValue = value && typeof value[valueKey] === 'string'
        ? value[valueKey]
        : ''

    const handleChange = (event: SelectChangeEvent) => {
        const selected = options.find((option) => option[valueKey] === event.target.value)
        if (selected) {
            onChange(selected)
        }
    }

    return (
        <FormControl fullWidth size='small' margin={margin} error={error}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={options.length ? resolvedValue : ''}
                onChange={handleChange}
                label={label}
                name={name}
                readOnly={readOnly}
                autoFocus={autoFocus}
                disabled={isLoading}
            >
                {options.map((option, index) => {
                    const valueOption = option[valueKey]
                    const labelOption = Array.isArray(labelKey)
                        ? buildLabel(option, labelKey)
                        : option[labelKey]

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
            {error && <FormHelperText>{helperText ?? `¡Seleccione ${label.toLowerCase()}!`}</FormHelperText>}
            {isError && <FormHelperText error>{`¡No se pudo obtener data ${label.toLowerCase()}!`}</FormHelperText>}
        </FormControl>
    )
}
function buildLabel<T>(option: T, keys: (LabelKey<T> | string)[]): string {
    return keys.map(key => {
        if (typeof key !== 'string') return ''; // Si no es string, lo ignoramos.

        if (key.includes('.')) {
            // Si contiene un punto, significa que es una propiedad anidada.
            const parts = key.split('.');
            let value: any = option;
            for (const part of parts) {
                if (value && typeof value === 'object' && part in value) {
                    value = value[part];
                } else {
                    value = ''; // Si no se encuentra la propiedad, devolvemos una cadena vacía.
                    break;
                }
            }
            return value ?? '';
        } else if (key in (option as object)) {
            // Si es una propiedad simple de `option`, la devolvemos.
            return (option as any)[key];
        } else {
            // Si no es una propiedad, es un texto libre o separador, así que lo devolvemos tal cual.
            return key;
        }
    }).join('');
}
