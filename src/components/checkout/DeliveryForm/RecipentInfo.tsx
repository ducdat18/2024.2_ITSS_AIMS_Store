import React from 'react';
import { Grid2, TextField } from '@mui/material';
import { Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material';

export interface RecipientInfoData {
  recipientName: string;
  email: string;
  phone: string;
}

interface RecipientInfoProps {
  data: RecipientInfoData;
  onChange: (field: keyof RecipientInfoData, value: string) => void;
  errors: { [key: string]: string };
}

const RecipientInfo: React.FC<RecipientInfoProps> = ({ data, onChange, errors }) => {
  const handleChange = (field: keyof RecipientInfoData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange(field, e.target.value);
  };

  const inputStyles = {
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
  };

  return (
    <Grid2 container spacing={3}>
      <Grid2 size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Recipient Name"
          name="recipientName"
          value={data.recipientName}
          onChange={handleChange('recipientName')}
          error={!!errors.recipientName}
          helperText={errors.recipientName}
          required
          InputProps={{
            startAdornment: (
              <PersonIcon sx={{ mr: 1, color: 'rgba(100, 255, 218, 0.5)' }} />
            ),
          }}
          sx={inputStyles}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange('email')}
          error={!!errors.email}
          helperText={errors.email}
          required
          InputProps={{
            startAdornment: (
              <EmailIcon sx={{ mr: 1, color: 'rgba(100, 255, 218, 0.5)' }} />
            ),
          }}
          sx={inputStyles}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={data.phone}
          onChange={handleChange('phone')}
          error={!!errors.phone}
          helperText={errors.phone}
          required
          InputProps={{
            startAdornment: (
              <PhoneIcon sx={{ mr: 1, color: 'rgba(100, 255, 218, 0.5)' }} />
            ),
          }}
          sx={inputStyles}
        />
      </Grid2>
    </Grid2>
  );
};

export default RecipientInfo;