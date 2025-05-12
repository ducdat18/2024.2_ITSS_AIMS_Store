import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (newQuantity: number) => void;
  min?: number;
  max?: number;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  alignCenter?: boolean;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onChange,
  min = 1,
  max = 99,
  size = 'small',
  fullWidth = false,
  alignCenter = true,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= min && value <= max) {
      onChange(value);
    }
  };

  const handleDecrement = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: alignCenter ? 'center' : 'flex-start',
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      <Button
        size={size}
        variant="outlined"
        onClick={handleDecrement}
        disabled={quantity <= min}
        sx={{
          minWidth: size === 'small' ? 30 : 36,
          p: 0,
          borderColor: 'rgba(100, 255, 218, 0.3)',
          color: 'primary.light',
          '&:hover': {
            borderColor: 'rgba(100, 255, 218, 0.5)',
            backgroundColor: 'rgba(100, 255, 218, 0.05)',
          },
          '&.Mui-disabled': {
            borderColor: 'rgba(100, 255, 218, 0.1)',
          },
        }}
      >
        <RemoveIcon fontSize="small" />
      </Button>
      <TextField
        type="number"
        value={quantity}
        onChange={handleInputChange}
        size={size}
        slotProps={{
          input: {
            inputProps: {
              min,
              max,
              style: { textAlign: 'center' },
            },
          },
        }}
        sx={{
          width: size === 'small' ? 60 : 80,
          mx: 1,
          '& input': { p: size === 'small' ? '6px' : '10px' },
          '& .MuiOutlinedInput-root': {
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
      />
      <Button
        size={size}
        variant="outlined"
        onClick={handleIncrement}
        disabled={quantity >= max}
        sx={{
          minWidth: size === 'small' ? 30 : 36,
          p: 0,
          borderColor: 'rgba(100, 255, 218, 0.3)',
          color: 'primary.light',
          '&:hover': {
            borderColor: 'rgba(100, 255, 218, 0.5)',
            backgroundColor: 'rgba(100, 255, 218, 0.05)',
          },
          '&.Mui-disabled': {
            borderColor: 'rgba(100, 255, 218, 0.1)',
          },
        }}
      >
        <AddIcon fontSize="small" />
      </Button>
    </Box>
  );
};

export default QuantitySelector;
