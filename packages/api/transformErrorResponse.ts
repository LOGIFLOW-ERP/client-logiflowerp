export const transformErrorResponse = (error: any) => {
    console.error(error)
    const message = error.data?.messageLogiflow
        ? error.data?.messageLogiflow
        : '¡Ocurrió un error inesperado!'
    return { message }
}