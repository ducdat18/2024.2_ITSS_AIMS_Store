import React from 'react';
import { Box, Paper, Typography, Divider, Button } from '@mui/material';
import {
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import SearchFilter from './SearchFilter';
import CategoryFilter from './CategoryFilter';
import PriceRangeFilter from './PriceRangeFilter';
import SortSelector from './SortSelector';
import ActiveFilters from './ActiveFilter';

export interface FilterState {
  category: string;
  search: string;
  priceRange: [number, number];
  sortBy: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (name: string, value: any) => void;
  onClearFilters: () => void;
  activeFilters?: Array<{ type: string; value: string; label: string }>;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  activeFilters = [],
}) => {
  const hasActiveFilters =
    filters.category ||
    filters.search ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 2000000;

  // Generate active filters if not provided
  const computedActiveFilters =
    activeFilters.length > 0
      ? activeFilters
      : [
          ...(filters.category
            ? [
                {
                  type: 'category',
                  value: filters.category,
                  label: `Category: ${filters.category}`,
                },
              ]
            : []),
          ...(filters.search
            ? [
                {
                  type: 'search',
                  value: filters.search,
                  label: `Search: ${filters.search}`,
                },
              ]
            : []),
          ...(filters.priceRange[0] > 0 || filters.priceRange[1] < 2000000
            ? [{ type: 'priceRange', value: '', label: 'Custom Price Range' }]
            : []),
        ];

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: { xs: 3, md: 0 },
        backgroundImage: 'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
        borderRadius: 2,
        border: '1px solid rgba(100, 255, 218, 0.1)',
        position: 'sticky',
        top: 90,
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <FilterListIcon fontSize="small" />
          Filters
        </Typography>
        <Button
          size="small"
          onClick={onClearFilters}
          startIcon={<ClearIcon />}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.light',
            },
          }}
        >
          Clear All
        </Button>
      </Box>

      <Divider sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

      {/* Search filter */}
      <SearchFilter
        value={filters.search}
        onChange={(value) => onFilterChange('search', value)}
      />

      {/* Category filter */}
      <CategoryFilter
        selectedCategory={filters.category}
        onChange={(value) => onFilterChange('category', value)}
      />

      {/* Price range filter */}
      <PriceRangeFilter
        value={filters.priceRange}
        onChange={(value) => onFilterChange('priceRange', value)}
      />

      {/* Sort by */}
      <SortSelector
        value={filters.sortBy}
        onChange={(value) => onFilterChange('sortBy', value)}
      />

      {/* Show active filters */}
      {hasActiveFilters && (
        <ActiveFilters
          filters={computedActiveFilters}
          onRemove={(type) => {
            switch (type) {
              case 'category':
                onFilterChange('category', '');
                break;
              case 'search':
                onFilterChange('search', '');
                break;
              case 'priceRange':
                onFilterChange('priceRange', [0, 2000000]);
                break;
            }
          }}
        />
      )}
    </Paper>
  );
};

export default FilterSidebar;
