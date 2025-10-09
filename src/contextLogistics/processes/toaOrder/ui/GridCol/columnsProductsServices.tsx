import { GridColDef } from '@mui/x-data-grid'
import { ProductsServicesContractedDTO } from 'logiflowerp-sdk'

export const columnsProductsServices = (): GridColDef<ProductsServicesContractedDTO>[] => {
    return [
        {
            field: 'codigo',
            headerName: 'Código',
        },
        {
            field: 'descripcion',
            headerName: 'Descripción',
        },
        {
            field: 'codigo_material',
            headerName: 'Código Material',
        },
        {
            field: 'numero_serie_mac_address',
            headerName: 'Serie',
        },
        {
            field: 'tipo_equipo',
            headerName: 'Tipo',
        },
    ]
}
