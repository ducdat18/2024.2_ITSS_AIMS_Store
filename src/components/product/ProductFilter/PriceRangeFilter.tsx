import React from 'react';
import { Box, Typography, Slider } from '@mui/material';

interface PriceRangeFilterProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  title?: string;
  mb?: number;
  currency?: string;
  currencyPosition?: 'before' | 'after';
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  value,
  onChange,
  min = 0,
  max = 2000000,
  step = 50000,
  title = 'Price Range (VND)',
  mb = 3,
  currency = 'VND',
  currencyPosition = 'after',
}) => {
  const formatValue = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleChange = (_event: Event, newValue: number | number[]) => {
    onChange(newValue as [number, number]);
  };

  return (
    <Box sx={{ mb }}>
      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{
          mb: 1.5,
          color: 'text.primary',
          fontWeight: 'medium',
        }}
      >
        {title}
      </Typography>
      <Box sx={{ px: 1 }}>
        <Slider
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          valueLabelDisplay="auto"
          valueLabelFormat={formatValue}
          sx={{
            color: 'primary.light',
            '& .MuiSlider-thumb': {
              '&:hover, &.Mui-focusVisible': {
                boxShadow: '0 0 0 8px rgba(2, 136, 209, 0.16)',
              },
            },
            '& .MuiSlider-valueLabel': {
              backgroundColor: 'primary.main',
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {formatValue(value[0])}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatValue(value[1])}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PriceRangeFilter;
