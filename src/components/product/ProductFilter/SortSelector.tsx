import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  SelectChangeEvent,
} from '@mui/material';
import { SortByAlpha as SortIcon } from '@mui/icons-material';

export type SortValue = 'popularity' | 'priceAsc' | 'priceDesc' | 'newest';

interface SortOption {
  value: SortValue;
  label: string;
}

interface SortSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options?: SortOption[];
  title?: string;
  mb?: number;
}

const defaultOptions: SortOption[] = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'priceAsc', label: 'Price: Low to High' },
  { value: 'priceDesc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

const SortSelector: React.FC<SortSelectorProps> = ({
  value,
  onChange,
  options = defaultOptions,
  title = 'Sort By',
  mb = 3,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
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
      <FormControl
        fullWidth
        size="small"
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
      >
        <Select
          value={value}
          onChange={handleChange}
          displayEmpty
          startAdornment={
            <InputAdornment position="start">
              <SortIcon sx={{ color: 'primary.light' }} />
            </InputAdornment>
          }
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SortSelector;
