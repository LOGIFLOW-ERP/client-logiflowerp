import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

export const transformErrorResponse = (error: FetchBaseQueryError) => {
    console.error(error)

    const data = error.data as any // RTK puede tener "unknown" aquí

    const backendMessage = data?.messageLogiflow

    // Si existe messageLogiflow → usarlo
    if (backendMessage) {
        return { message: backendMessage }
    }

    // Si NO existe messageLogiflow → concatenar el mensaje real del error
    const realError =
        data?.message ||
        (error as any)?.error ||
        (error as any)?.statusText ||
        (error as any)?.message ||
        'Error desconocido'

    return {
        message: `¡Ocurrió un error inesperado! (${realError})`
    }
}
