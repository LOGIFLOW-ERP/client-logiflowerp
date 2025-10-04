export function getMonthDateRange(month: number, year: number = new Date().getFullYear()) {
    const start = new Date(year, month - 1, 1)
    start.setHours(0, 0, 0, 0)

    const end = new Date(year, month, 1)
    end.setHours(0, 0, 0, 0)

    return { start, end }
}
