import React from 'react';
import { TextField, InputAdornment, TextFieldProps } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface FormFieldProps extends Omit<TextFieldProps, 'InputProps'> {
  icon?: React.ReactElement<SvgIconComponent>;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  icon,
  error,
  helperText,
  disabled,
  ...props
}) => {
  return (
    <TextField
      fullWidth
      error={error}
      helperText={helperText}
      disabled={disabled}
      InputProps={{
        startAdornment: icon ? (
          <InputAdornment position="start">{icon}</InputAdornment>
        ) : undefined,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'rgba(1, 22, 39, 0.3)',
          '&:hover': {
            backgroundColor: 'rgba(1, 22, 39, 0.5)',
          },
          '& fieldset': {
            borderColor: 'rgba(100, 255, 218, 0.3)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(100, 255, 218, 0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'rgba(100, 255, 218, 0.7)',
          },
        },
      }}
      {...props}
    />
  );
};
