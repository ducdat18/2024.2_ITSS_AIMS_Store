import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

interface Filter {
  type: string;
  value: string;
  label: string;
}

interface ActiveFiltersProps {
  filters: Filter[];
  onRemove: (type: string) => void;
  title?: string;
  mb?: number;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemove,
  title = 'Active Filters',
  mb = 3,
}) => {
  if (filters.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb }}>
      <Typography
        variant="subtitle2"
        sx={{
          mb: 1.5,
          color: 'text.primary',
          fontWeight: 'medium',
        }}
      >
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {filters.map((filter) => (
          <Chip
            key={filter.type}
            label={filter.label}
            onDelete={() => onRemove(filter.type)}
            color="primary"
            size="small"
            sx={{
              backgroundColor: 'rgba(2, 136, 209, 0.2)',
              borderColor: 'rgba(100, 255, 218, 0.3)',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ActiveFilters;
