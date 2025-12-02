import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { CustomAutocomplete, CustomButtonSave, CustomDialog } from '@shared/ui-library'
import React, { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import {
    CreateInventoryDTO,
    DeleteInventoryDTO,
    EmployeeStockENTITY,
    EmployeeStockSerialENTITY,
    InventoryWinDTO,
    ProducType,
    WINOrderENTITY
} from 'logiflowerp-sdk'
import { useSnackbar } from 'notistack'
import {
    useAddInventoryWINOrderMutation,
    useDeleteInventoryWINOrderMutation,
    useGetDataLiquidationOrderEmployeeStockQuery
} from '@shared/api'
import TextField from '@mui/material/TextField'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import { columnsInventory } from '../GridCol/columnsInventory'
import { Box } from '@mui/material'
import { useResetApiState } from '@shared/ui/hooks'

const resolver = classValidatorResolver(CreateInventoryDTO)

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    isFetching: boolean
    selectedRow: WINOrderENTITY
}

export function AddDialog(props: IProps) {

    const { open, setOpen, selectedRow, isFetching } = props
    const apiRef = useGridApiRef()
    const {
        handleSubmit,
        formState: { errors },
        register,
        control,
        getValues,
        setValue,
        reset,
    } = useForm({ resolver })
    const { enqueueSnackbar } = useSnackbar()
    const resetApiState = useResetApiState()

    const {
        data: dataES,
        isError: isErrorES,
        error: errorES,
        isLoading: isLoadingES
    } = useGetDataLiquidationOrderEmployeeStockQuery()

    const [addInventoryOrder, { isLoading }] = useAddInventoryWINOrderMutation()
    const [deleteInventoryOrder, { isLoading: isLoadingDelete }] = useDeleteInventoryWINOrderMutation()

    const _id_stock = useWatch({ control, name: "_id_stock" })
    const selectedProduct = dataES?.map(d => d.item).find((opt) => opt._id === _id_stock)
    const isSerie = selectedProduct?.item?.producType === ProducType.SERIE

    useEffect(() => {
        if (!isSerie) {
            setValue('invsn', '')
            setValue('quantity', 0)
        } else {
            setValue('invsn', undefined as unknown as string)
            setValue('quantity', 1)
        }
    }, [isSerie, setValue])

    useEffect(() => {
        apiRef.current?.autosizeColumns({
            includeHeaders: true,
            includeOutliers: true,
        })
    }, [isLoadingDelete, isLoading, isFetching, _id_stock])


    const onSubmit = async (data: CreateInventoryDTO) => {
        try {
            await addInventoryOrder({ _id: props.selectedRow._id, data }).unwrap()
            if (data.invsn.length) {
                resetApiState(['employeeStockApi'])
            }
            reset()
            enqueueSnackbar({ message: '¡Agregado correctamente!', variant: 'success' })
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    const handleDeleteClick = async (row: InventoryWinDTO) => {
        try {
            const data = new DeleteInventoryDTO()
            data._id_stock = row._id_stock
            data.invsn = row.invsn
            await deleteInventoryOrder({ _id: props.selectedRow._id, data }).unwrap()
            if (row.invsn.length) {
                resetApiState(['employeeStockApi'])
            }
            enqueueSnackbar({ message: '¡Inventario eliminado!', variant: 'info' })
        } catch (error) {
            console.error(error)
            enqueueSnackbar({ message: (error as Error).message, variant: 'error' })
        }
    }

    return (
        <CustomDialog
            open={open}
            setOpen={setOpen}
            title={`Agregar - ${selectedRow.numero_de_peticion}`}
            slotProps={{
                transition: {
                    onEntered: () => {
                        apiRef.current?.autosizeColumns({
                            includeHeaders: true,
                            includeOutliers: true,
                        })
                    }
                }
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name='_id_stock'
                    control={control}
                    render={({ field }) => (
                        <CustomAutocomplete<EmployeeStockENTITY>
                            loading={isLoadingES}
                            options={dataES?.map(d => d.item) ?? []}
                            error={!!errors._id_stock || isErrorES}
                            helperText={errors._id_stock?.message || (errorES as Error)?.message}
                            value={dataES?.map(d => d.item).find((opt) => opt._id === field.value) || null}
                            onChange={(_, newValue) => field.onChange(newValue ? newValue._id : undefined)}
                            label='Producto'
                            getOptionLabel={(option) => `${option.item.itemCode} - ${option.item.itemName} ${option.lot ? `- Lote: ${option.lot}` : ''}`.trim()}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                            margin='dense'
                        />
                    )}
                />
                {
                    isSerie && (
                        <Controller
                            name='invsn'
                            control={control}
                            render={({ field }) => (
                                <CustomAutocomplete<EmployeeStockSerialENTITY>
                                    loading={isLoadingES}
                                    options={dataES?.find((opt) => opt.item._id === getValues('_id_stock'))?.serials ?? []}
                                    error={!!errors.invsn}
                                    helperText={errors.invsn?.message}
                                    value={dataES?.find((opt) => opt.item._id === getValues('_id_stock'))?.serials?.find((opt) => opt.serial === field.value) || null}
                                    onChange={(_, newValue) => field.onChange(newValue ? newValue.serial : undefined)}
                                    label='Serie'
                                    getOptionLabel={(option) => option.serial}
                                    isOptionEqualToValue={(option, value) => option.serial === value.serial}
                                    margin='dense'
                                />
                            )}
                        />
                    )
                }
                {
                    !isSerie && (
                        <TextField
                            label='Cantidad'
                            variant='outlined'
                            fullWidth
                            margin='dense'
                            size='small'
                            type="number"
                            slotProps={{
                                htmlInput: { step: 'any' },
                            }}
                            {...register('quantity', {
                                setValueAs: (v) =>
                                    v === '' ? undefined : parseFloat(v.toString().replace(',', '.')),
                            })}
                            error={!!errors.quantity}
                            helperText={errors.quantity?.message}
                        />
                    )
                }
                <CustomButtonSave isLoading={isLoading || isLoadingDelete || isFetching} />
            </form>
            {
                selectedRow.inventory.length ? (
                    <Box sx={{ mt: 2 }}>
                        <DataGrid<InventoryWinDTO>
                            rows={selectedRow.inventory}
                            columns={columnsInventory({ handleDeleteClick })}
                            disableRowSelectionOnClick
                            getRowId={row => `${row.code}${row.invsn}`}
                            density='compact'
                            apiRef={apiRef}
                            loading={isLoading || isLoadingDelete || isFetching}
                            disableColumnMenu
                        />
                    </Box>
                ) : null
            }
        </CustomDialog>
    )
}
