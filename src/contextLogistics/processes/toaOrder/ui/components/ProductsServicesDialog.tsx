import { CustomDialog } from '@shared/ui-library'
import React from 'react'
import { ProductsServicesContractedDTO, TOAOrderENTITY } from 'logiflowerp-sdk'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { columnsProductsServices } from '../GridCol'
import { useGridApiRef } from '@mui/x-data-grid'

interface IProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    selectedRow: TOAOrderENTITY
}

export function ProductsServicesDialog(props: IProps) {

    const { open, setOpen, selectedRow } = props
    const apiRef = useGridApiRef()

    return (
        <CustomDialog
            open={open}
            setOpen={setOpen}
            title='Productos servicios contratados'
            maxWidth='md'
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
            <DataGrid<ProductsServicesContractedDTO>
                rows={selectedRow.products_services_contracted}
                columns={columnsProductsServices()}
                disableRowSelectionOnClick
                showToolbar
                getRowId={row => `${row.codigo}${row.numero_serie_mac_address}`}
                density='compact'
                apiRef={apiRef}
            />
        </CustomDialog>
    )
}
