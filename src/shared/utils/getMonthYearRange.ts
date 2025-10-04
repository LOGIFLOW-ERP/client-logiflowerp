import { MonthYearInfo } from "@shared/domain";

export function getMonthYearRange(
    startMonth: number,
    startYear: number,
    endMonth?: number,
    endYear?: number
): MonthYearInfo[] {
    const now = new Date();

    const finalMonth = endMonth ?? now.getMonth() + 1;
    const finalYear = endYear ?? now.getFullYear();

    const result: MonthYearInfo[] = [];
    const date = new Date(startYear, startMonth - 1, 1);

    while (
        date.getFullYear() < finalYear ||
        (date.getFullYear() === finalYear && date.getMonth() + 1 <= finalMonth)
    ) {
        result.push({
            id: result.length,
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            name: date.toLocaleString("es-ES", { month: "long" }).toUpperCase()
        });

        date.setMonth(date.getMonth() + 1);
    }

    return result;
}
