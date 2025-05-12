import React, { useState } from 'react';
import { InputAdornment, IconButton, TextFieldProps } from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
} from '@mui/icons-material';
import { FormField } from './FormField';

interface PasswordFieldProps
  extends Omit<TextFieldProps, 'InputProps' | 'type'> {
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  error,
  helperText,
  disabled,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      type={showPassword ? 'text' : 'password'}
      error={error}
      helperText={helperText}
      disabled={disabled}
      icon={<LockIcon sx={{ color: 'rgba(100, 255, 218, 0.7)' }} />}
      inputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
              disabled={disabled}
              sx={{
                color: 'rgba(100, 255, 218, 0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(100, 255, 218, 0.05)',
                },
              }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};
