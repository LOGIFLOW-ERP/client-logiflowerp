import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { FiltersDTO } from '../../domain'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import { CustomAutocomplete, CustomButtonSearch } from '@shared/ui/ui-library'
import { ProductGroupENTITY } from 'logiflowerp-sdk'
import { useGetProductGroupsQuery } from '@shared/infrastructure/redux/api'

const resolver = classValidatorResolver(FiltersDTO)

interface IProps {
    fetchProducts: any
}

export function CustomFilters({ fetchProducts }: IProps) {

    const {
        handleSubmit,
        formState: { errors },
        control
    } = useForm({ resolver })
    const { enqueueSnackbar } = useSnackbar()
    const { data: dataGroup, isError: isErrorGroup, isLoading: isLoadingGroup, error: errorGroup } = useGetProductGroupsQuery()

    const onSubmit = async (data: FiltersDTO) => {
        try {
            const pipeline = [
                {
                    $match: {
                        itmsGrpCod: data.itmsGrpCod
                    }
                }
            ]
            await fetchProducts(pipeline).unwrap()
            enqueueSnackbar({ message: 'Reporte generado!', variant: 'success' })
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name='itmsGrpCod'
                control={control}
                render={({ field }) => (
                    <CustomAutocomplete<ProductGroupENTITY>
                        loading={isLoadingGroup}
                        options={dataGroup}
                        error={!!errors.itmsGrpCod || isErrorGroup}
                        helperText={errors.itmsGrpCod?.message || (errorGroup as Error)?.message}
                        value={dataGroup?.find((opt) => opt.itmsGrpCod === field.value) || null}
                        onChange={(_, newValue) => field.onChange(newValue ? newValue.itmsGrpCod : undefined)}
                        label='Grupo'
                        getOptionLabel={(option) => `${option.itmsGrpCod} - ${option.itmsGrpNam}`}
                        isOptionEqualToValue={(option, value) => option.itmsGrpCod === value.itmsGrpCod}
                    />
                )}
            />
            <CustomButtonSearch isLoading={isLoadingGroup} />
        </form>
    )
}
