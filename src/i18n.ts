import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
    resources: {
        es: {
            translation: {
                User: 'Usuario',
                Currency: 'Moneda',
                Company: 'Empresa',
                Personnel: 'Personal',
                Profile: 'Perfil',
                'Employee Stock PEX': 'Stock Personal PEX',
                'Employee Stock': 'Stock Personal',
                'Warehouse Stock': 'Stock Almacén',
                'Warehouse Exit': 'Salida Almacén',
                'Warehouse Return': 'Devolución Almacén',
                'Warehouse Entry': 'Ingreso Almacén',
                'Product Price': 'Precio Producto',
                Product: 'Producto',
                'Product Group': 'Grupo Producto',
                Store: 'Almacén',
                Movement: 'Movimiento',
                'Unit Of Measure': 'Unidad de Medida',
                Configuration: 'Configuración',
                Logistics: 'Logística',
                Masters: 'Maestros',
                Processes: 'Procesos',
                Reports: 'Reportes',
            }
        },
        en: {
            translation: {}
        }
    },
    lng: 'es', // idioma inicial
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
})

export default i18n
