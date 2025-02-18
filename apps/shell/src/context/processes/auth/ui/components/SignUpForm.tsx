import { TextField } from '@mui/material'
import { CustomSelect } from '@shared/ui-library'
import { dataCountry, State } from 'logiflowerp-sdk'

export function SignUpForm() {
    return (
        <form>
            <CustomSelect
                label='País'
                onChange={() => { }}
                options={dataCountry.filter(e => e.estado === State.ACTIVO)}
                value=''
                labelKey='nombre'
                valueKey='alfa3'
            />
            <TextField
                label='ID'
                variant='outlined'
                fullWidth
                margin='normal'
                size='small'
            />
        </form>
    )
}
