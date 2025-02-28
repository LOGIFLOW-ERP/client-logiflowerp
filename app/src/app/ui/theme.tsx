import { createTheme } from '@mui/material'
import { red, grey } from '@mui/material/colors'

export const theme = createTheme({
    cssVariables: true,
    palette: {
        primary: {
            main: '#556cd6'
        },
        secondary: {
            main: '#19857b'
        },
        error: {
            main: red.A100
        },
        background: {
            default: grey[200]
        }
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& input:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0px 1000px transparent inset',
                        transition: 'background-color 5000s ease-in-out 0s',
                        WebkitTextFillColor: 'inherit',
                        caretColor: 'inherit'
                    }
                }
            }
        }
    }
})
