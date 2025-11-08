import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { FiltersDTO } from '../../domain'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import { CustomAutocomplete, CustomButtonSearch } from '@shared/ui/ui-library'
import { getMonthYearRange } from '@shared/utils/getMonthYearRange'
import { MonthYearInfo } from '@shared/domain'
import { getMonthDateRange } from '@shared/utils/getMonthDateRange'

const months = getMonthYearRange(8, 2025)

const resolver = classValidatorResolver(FiltersDTO)

interface IProps {
    onSubmitFilter: (pipeline: any[]) => Promise<void>
    isLoadingPipeline: boolean
}

export function CustomFilters({ onSubmitFilter, isLoadingPipeline }: IProps) {

    const {
        handleSubmit,
        formState: { errors },
        control
    } = useForm({ resolver })
    const { enqueueSnackbar } = useSnackbar()

    const onSubmit = async (data: FiltersDTO) => {
        try {
            const selected = months.find(e => e.id === data.month)
            if (!selected) {
                throw new Error(`¡Ocurrió un error!`)
            }
            const { start, end } = getMonthDateRange(selected.month, selected.year)
            const pipeline = [
                {
                    $match: {
                        fin_visita: {
                            $gte: start,
                            $lt: end
                        }
                    }
                }
            ]
            await onSubmitFilter(pipeline)
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar({ message: error.message, variant: 'error' })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name='month'
                control={control}
                render={({ field }) => (
                    <CustomAutocomplete<MonthYearInfo>
                        options={months}
                        error={!!errors.month}
                        helperText={errors.month?.message}
                        value={months?.find((opt) => opt.id === field.value) || null}
                        onChange={(_, newValue) => field.onChange(newValue ? newValue.id : undefined)}
                        label='Fecha liquidación'
                        getOptionLabel={(option) => `${option.name} - ${option.year}`}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                )}
            />
            <CustomButtonSearch isLoading={isLoadingPipeline} />
        </form>
    )
}
