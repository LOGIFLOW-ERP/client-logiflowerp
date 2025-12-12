import { ToolbarButton } from '@mui/x-data-grid'
import { Tooltip } from '@mui/material'
import { SerialTracking } from '../../../contextLogistics/shared/ui/components/SerialTracking';
import { useState } from 'react';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { usePermissions } from '../hooks';
import { PERMISSIONS } from '@shared/application';

export function ToolbarButtonSerialTracking() {

    const [open, setOpen] = useState(false)
    const [POST_WAREHOUSE_STOCK_SERIAL_SERIAL_TRACKING] = usePermissions([PERMISSIONS.POST_WAREHOUSE_STOCK_SERIAL_SERIAL_TRACKING])

    if (!POST_WAREHOUSE_STOCK_SERIAL_SERIAL_TRACKING) {
        return null
    }

    return (
        <>
            <Tooltip title='Seguimiento de serie'>
                <ToolbarButton
                    aria-describedby='new-panel-serial-tracking'
                    onClick={() => {
                        setOpen(true)
                    }}
                >
                    <QueryStatsIcon fontSize='small' color='primary' />
                </ToolbarButton>
            </Tooltip>
            <SerialTracking open={open} setOpen={setOpen} />
        </>
    )
}
