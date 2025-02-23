import { SystemOptionENTITY } from 'logiflowerp-sdk'

export interface IMenu {
    systemOption: SystemOptionENTITY
    children: IMenu[]
}