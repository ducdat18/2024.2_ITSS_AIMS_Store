import React from 'react';
import { Grid2, TextField, MenuItem } from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';

export interface AddressInfoData {
  province: string;
  address: string;
}

interface AddressInfoProps {
  data: AddressInfoData;
  onChange: (field: keyof AddressInfoData, value: string) => void;
  errors: { [key: string]: string };
  provinces: string[];
}

const AddressInfo: React.FC<AddressInfoProps> = ({
  data,
  onChange,
  errors,
  provinces,
}) => {
  const handleChange =
    (field: keyof AddressInfoData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    '& .MuiMenuItem-root:hover': {
      backgroundColor: 'rgba(2, 136, 209, 0.1)',
    },
    '& .MuiMenuItem-root.Mui-selected': {
      backgroundColor: 'rgba(2, 136, 209, 0.2)',
    },
  };

  return (
    <Grid2 container spacing={3}>
      <Grid2 size={{ xs: 12 }}>
        <TextField
          select
          fullWidth
          label="Province/City"
          name="province"
          value={data.province}
          onChange={handleChange('province')}
          error={!!errors.province}
          helperText={errors.province}
          required
          InputProps={{
            startAdornment: (
              <LocationIcon sx={{ mr: 1, color: 'rgba(100, 255, 218, 0.5)' }} />
            ),
          }}
          sx={inputStyles}
        >
          {provinces.map((province) => (
            <MenuItem key={province} value={province}>
              {province}
            </MenuItem>
          ))}
        </TextField>
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Address"
          name="address"
          value={data.address}
          onChange={handleChange('address')}
          error={!!errors.address}
          helperText={errors.address}
          required
          multiline
          rows={2}
          InputProps={{
            startAdornment: (
              <LocationIcon
                sx={{
                  mr: 1,
                  mt: 1.5,
                  alignSelf: 'flex-start',
                  color: 'rgba(100, 255, 218, 0.5)',
                }}
              />
            ),
          }}
          sx={inputStyles}
        />
      </Grid2>
    </Grid2>
  );
};

export default AddressInfo;
