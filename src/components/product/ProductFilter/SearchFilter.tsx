import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
  mb?: number;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  value,
  onChange,
  placeholder = 'Search products',
  fullWidth = true,
  mb = 2,
}) => {
  return (
    <TextField
      fullWidth={fullWidth}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: 'primary.light' }} />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={() => onChange('')}
              sx={{ color: 'text.secondary' }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{
        mb,
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
    />
  );
};

export default SearchFilter;
