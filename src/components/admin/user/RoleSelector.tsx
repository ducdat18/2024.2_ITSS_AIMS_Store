import React from 'react';
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  ShoppingBag as ProductManagerIcon,
} from '@mui/icons-material';
import { UserRole } from '../../../types';

interface RoleSelectorProps {
  selectedRoles: UserRole[];
  onChange: (role: UserRole) => void;
  error?: string;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRoles,
  onChange,
  error,
}) => {
  return (
    <FormControl component="fieldset" error={!!error}>
      <FormLabel
        component="legend"
        sx={{
          color: 'text.primary',
          '&.Mui-focused': {
            color: 'primary.light',
          },
        }}
      >
        User Roles (select at least one)
      </FormLabel>
      <FormGroup
        sx={{
          display: 'flex',
          flexDirection: 'row',
          mt: 1,
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedRoles.includes(UserRole.ADMIN)}
              onChange={() => onChange(UserRole.ADMIN)}
              sx={{
                color: 'rgba(100, 255, 218, 0.5)',
                '&.Mui-checked': {
                  color: 'success.light',
                },
              }}
              icon={<AdminIcon sx={{ color: 'rgba(0, 191, 165, 0.5)' }} />}
              checkedIcon={<AdminIcon />}
            />
          }
          label="Administrator"
          sx={{
            mr: 4,
            '& .MuiFormControlLabel-label': {
              color: selectedRoles.includes(UserRole.ADMIN)
                ? 'success.light'
                : 'text.secondary',
            },
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedRoles.includes(UserRole.PRODUCT_MANAGER)}
              onChange={() => onChange(UserRole.PRODUCT_MANAGER)}
              sx={{
                color: 'rgba(100, 255, 218, 0.5)',
                '&.Mui-checked': {
                  color: 'warning.light',
                },
              }}
              icon={
                <ProductManagerIcon sx={{ color: 'rgba(255, 152, 0, 0.5)' }} />
              }
              checkedIcon={<ProductManagerIcon />}
            />
          }
          label="Product Manager"
          sx={{
            '& .MuiFormControlLabel-label': {
              color: selectedRoles.includes(UserRole.PRODUCT_MANAGER)
                ? 'warning.light'
                : 'text.secondary',
            },
          }}
        />
      </FormGroup>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </FormControl>
  );
};

export default RoleSelector;
