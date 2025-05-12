import React from 'react';
import { 
  Box, 
  Grid2, 
  FormControlLabel, 
  Checkbox, 
  Typography, 
  TextField 
} from '@mui/material';
import { 
  Info as InfoIcon, 
  Today as TodayIcon, 
  Notes as NotesIcon 
} from '@mui/icons-material';

export interface RushDeliveryData {
  isRushDelivery: boolean;
  rushDeliveryTime?: string;
  rushDeliveryInstructions?: string;
}

interface RushDeliveryOptionsProps {
  data: RushDeliveryData;
  onChange: (field: keyof RushDeliveryData, value: string | boolean) => void;
  errors: { [key: string]: string };
  isEnabled: boolean;
  canUseRushDelivery: boolean;
}

const RushDeliveryOptions: React.FC<RushDeliveryOptionsProps> = ({
  data,
  onChange,
  errors,
  isEnabled,
  canUseRushDelivery,
}) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange('isRushDelivery', e.target.checked);
  };

  const handleInputChange = (field: keyof RushDeliveryData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  if (!isEnabled) return null;

  return (
    <Grid2 size={{ xs: 12 }}>
      <Box
        sx={{
          p: 2,
          borderRadius: 1,
          backgroundColor: 'rgba(2, 136, 209, 0.05)',
          border: '1px solid rgba(100, 255, 218, 0.1)',
          mb: 2,
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={data.isRushDelivery}
              onChange={handleCheckboxChange}
              disabled={!canUseRushDelivery}
              color="primary"
              sx={{
                color: 'rgba(100, 255, 218, 0.5)',
                '&.Mui-checked': {
                  color: 'primary.light',
                },
              }}
            />
          }
          label={
            <Typography color="text.primary">
              Rush Delivery (2-hour delivery timeframe)
            </Typography>
          }
        />
        
        {!canUseRushDelivery && (
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{
              mt: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <InfoIcon fontSize="small" color="warning" />
            Some items in your cart are not eligible for rush delivery (items over 3kg).
          </Typography>
        )}
        
        {data.isRushDelivery && (
          <Typography
            variant="caption"
            color="primary.light"
            display="block"
            sx={{
              mt: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <InfoIcon fontSize="small" />
            Rush delivery is only available in Hanoi districts for eligible items. 
            You must select a delivery time at least 2 hours from now, between 8 AM and 8 PM. 
            An additional fee of 10,000 VND per eligible item will be applied.
          </Typography>
        )}

        {data.isRushDelivery && (
          <Grid2 container spacing={2} sx={{ mt: 1 }}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Preferred Delivery Time"
                name="rushDeliveryTime"
                type="datetime-local"
                value={data.rushDeliveryTime || ''}
                onChange={handleInputChange('rushDeliveryTime')}
                InputLabelProps={{ shrink: true }}
                error={!!errors.rushDeliveryTime}
                helperText={
                  errors.rushDeliveryTime ||
                  'Select a time at least 2 hours from now (8 AM - 8 PM)'
                }
                required
                InputProps={{
                  startAdornment: (
                    <TodayIcon
                      sx={{
                        mr: 1,
                        color: 'rgba(100, 255, 218, 0.5)',
                      }}
                    />
                  ),
                }}
                sx={inputStyles}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Delivery Instructions"
                name="rushDeliveryInstructions"
                value={data.rushDeliveryInstructions || ''}
                onChange={handleInputChange('rushDeliveryInstructions')}
                placeholder="Special instructions for delivery"
                multiline
                rows={2}
                InputProps={{
                  startAdornment: (
                    <NotesIcon
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
        )}
      </Box>
    </Grid2>
  );
};

export default RushDeliveryOptions;