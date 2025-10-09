import { IsInt } from 'class-validator'

export class FiltersDTO {
    @IsInt({ message: "Seleccióne una opción" })
    month!: number;
}