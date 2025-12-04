import { useSocketContext } from '@shared/infrastructure/socket'
import { WarehouseExitENTITY } from 'logiflowerp-sdk'
import { useCallback, useRef, useState } from 'react'

export function useTechApproval() {
    const listenerRef = useRef<((...args: any[]) => void) | null>(null)
    const { socket } = useSocketContext()
    const [loading, setLoading] = useState(false)

    const requestApproval = useCallback((document: WarehouseExitENTITY) => {
        setLoading(true)

        return new Promise<boolean>((resolve) => {

            socket.emit('warehouseExit:requestTechApproval', { document })

            const timeout = setTimeout(() => {
                cleanup()
                setLoading(false)
                resolve(false)
            }, 30000)

            const handler = (data: { document: WarehouseExitENTITY; approved: boolean }) => {
                if (data.document.documentNumber !== document.documentNumber) return

                cleanup()
                setLoading(false)
                resolve(data.approved)
            }

            listenerRef.current = handler
            socket.on('warehouseExit:techApprovalResult', listenerRef.current)

            function cleanup() {
                clearTimeout(timeout)
                if (listenerRef.current) {
                    socket.off('warehouseExit:techApprovalResult', listenerRef.current)
                }
            }
        })
    }, [socket])

    return { loading, requestApproval }
}
