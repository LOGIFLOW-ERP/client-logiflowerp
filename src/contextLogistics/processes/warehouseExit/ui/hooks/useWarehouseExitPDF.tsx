import { useCallback } from 'react'
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { WarehouseExitENTITY } from 'logiflowerp-sdk'

const styles = StyleSheet.create({
    page: {
        padding: 24,
        fontSize: 11,
    },
    title: {
        fontSize: 16,
        marginBottom: 8,
    },
    section: {
        marginBottom: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottom: '1px solid #000',
        paddingBottom: 4,
        marginBottom: 4,
    },
    tableRow: {
        flexDirection: 'row',
        marginBottom: 2,
        borderBottom: '1px solid gray',
    },
    cellCodigo: {
        flex: 1,
    },
    cellDescripcion: {
        flex: 3,
    },
    cellCantidad: {
        flex: 1,
        textAlign: 'right',
    }
})

export function useSalidaAlmacenPDF() {
    const generatePDF = useCallback(async (salida: WarehouseExitENTITY) => {
        const doc = (
            <Document>
                <Page size='A4' style={styles.page}>

                    <Text style={styles.title}>Salida de Almacén</Text>

                    <View style={styles.section}>
                        <Text>
                            <Text style={{ fontWeight: 'bold' }}>Código: </Text>
                            {salida.documentNumber}
                        </Text>
                        <Text>
                            <Text style={{ fontWeight: 'bold' }}>Fecha: </Text>
                            {new Date(salida.workflow.validation.date).toLocaleString()}
                        </Text>
                        <Text>
                            <Text style={{ fontWeight: 'bold' }}>Almacén: </Text>
                            {salida.store.code} - {salida.store.name}
                        </Text>
                        <Text>
                            <Text style={{ fontWeight: 'bold' }}>Solicitado por: </Text>
                            {salida.carrier.identity} - {salida.carrier.names} {salida.carrier.surnames}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={{ marginBottom: 4, fontSize: 13 }}>Detalle de Artículos</Text>

                        <View style={styles.tableHeader}>
                            <Text style={[styles.cellCodigo]}>Código</Text>
                            <Text style={[styles.cellDescripcion]}>Descripción</Text>
                            <Text style={[styles.cellCantidad]}>Cantidad</Text>
                        </View>

                        {salida.detail.map((item, index) => (
                            <View key={index}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.cellCodigo}>{item.item.itemCode}</Text>
                                    <Text style={styles.cellDescripcion}>{item.item.itemName}</Text>
                                    <Text style={styles.cellCantidad}>{item.amount}</Text>
                                </View>
                                {item.serials?.length > 0 && (
                                    <View style={{ marginLeft: 12, marginBottom: 6 }}>
                                        {item.serials.map((s, i) => (
                                            <Text key={i} style={{ fontSize: 9 }}>
                                                • {s.serial}
                                            </Text>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                </Page>
            </Document>
        )

        const blob = await pdf(doc).toBlob()
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = `Salida-${salida.documentNumber}.pdf`
        a.click()

        URL.revokeObjectURL(url)
    }, [])

    return { generatePDF }
}
