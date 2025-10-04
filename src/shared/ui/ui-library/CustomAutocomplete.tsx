import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { AutocompleteChangeDetails, AutocompleteChangeReason } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

interface CustomAutocompleteProps<T> {
    options: T[] | undefined
    loading?: boolean
    error?: boolean | undefined
    // label?: React.ReactNode
    label?: string
    helperText?: React.ReactNode
    isOptionEqualToValue?: ((option: T, value: T) => boolean) | undefined
    getOptionLabel?: ((option: T) => string) | undefined
    value?: T | null | undefined
    onChange?: ((event: React.SyntheticEvent<Element, Event>, value: T | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<T> | undefined) => void) | undefined
    margin?: "normal" | "dense" | "none" | undefined
}

export function CustomAutocomplete<T>(
    {
        options = [],
        loading = false,
        isOptionEqualToValue,
        getOptionLabel,
        value,
        onChange,
        label,
        error,
        helperText,
        margin = 'normal'
    }: CustomAutocompleteProps<T>
) {
    const [open, setOpen] = React.useState(false)

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Autocomplete
            // sx={{ width: 300 }}
            open={open}
            onOpen={handleOpen}
            onClose={handleClose}
            isOptionEqualToValue={isOptionEqualToValue}
            getOptionLabel={getOptionLabel}
            options={options}
            loading={loading}
            value={value}
            onChange={onChange}
            size='small'
            fullWidth
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    error={error}
                    helperText={helperText}
                    margin={margin}
                    fullWidth
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        },
                    }}
                />
            )}
        />
    );
}
