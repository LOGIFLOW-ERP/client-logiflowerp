import React from 'react';
import {
    Typography,
    Avatar,
    Stack,
    Box,
    Divider,
    Tooltip,
} from '@mui/material';
import { CustomDialog } from '@shared/ui-library';
import { useStore } from '@shared/ui/hooks';
import VerifiedIcon from '@mui/icons-material/Verified';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import PublicIcon from '@mui/icons-material/Public';
import BusinessIcon from '@mui/icons-material/Business';
import CreditCardIcon from '@mui/icons-material/CreditCard';

export const ProfileDialog = ({ open, onClose, }: { open: boolean; onClose: React.Dispatch<React.SetStateAction<boolean>>; }) => {

    const { state: { user, company, profile, root } } = useStore('auth')

    return (
        <CustomDialog open={open} setOpen={onClose} title="Mi Perfil">
            <Stack spacing={3} alignItems="center">
                <Avatar
                    alt={user.names}
                    sx={{ width: 80, height: 80 }}
                />

                <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                    {user.names} {user.surnames}
                    <Tooltip title={root ? 'Superadministrador' : user.root ? 'Administrador' : 'Usuario'}>
                        <VerifiedIcon sx={{ color: root ? 'goldenrod' : user.root ? 'dodgerblue' : 'gray' }} fontSize="small" />
                    </Tooltip>
                </Typography>

                <Box width="100%">
                    <Divider textAlign="left">Empresa</Divider>
                    <Stack spacing={1} mt={1}>
                        <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1}>
                            <CreditCardIcon fontSize="small" /> RUC: {company.ruc}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1}>
                            <BusinessIcon fontSize="small" /> {company.code} - {company.companyname}
                        </Typography>
                    </Stack>
                </Box>

                <Box width="100%">
                    <Divider textAlign="left">Perfil</Divider>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                        {profile.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                        {profile.description}
                    </Typography>
                </Box>

                {/* Datos personales */}
                <Box width="100%">
                    <Divider textAlign="left">Información personal</Divider>
                    <Stack spacing={1} mt={1}>
                        <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1}>
                            <BadgeIcon fontSize="small" /> {user.documentType}: {user.identity}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1}>
                            <EmailIcon fontSize="small" /> {user.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1}>
                            <PublicIcon fontSize="small" /> {user.country}
                        </Typography>
                    </Stack>
                </Box>
            </Stack>
        </CustomDialog>
    )
}
