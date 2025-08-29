import { IsNotEmpty } from 'class-validator'

export class FiltersDTO {
    @IsNotEmpty({ message: "El campo grupo es obligatorio" })
    itmsGrpCod!: string;
}