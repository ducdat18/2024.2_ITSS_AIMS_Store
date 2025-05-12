import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { ProductCategory } from '../../../types';
import ProductCategoryIcon, { getCategoryColor } from '../ProductCategoryIcon';

interface CategoryFilterProps {
  selectedCategory: string;
  onChange: (category: string) => void;
  title?: string;
  mb?: number;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onChange,
  title = 'Category',
  mb = 3,
}) => {
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
        {Object.values(ProductCategory).map((category) => {
          const isSelected = selectedCategory === category;

          return (
            <Chip
              key={category}
              label={category}
              icon={
                <ProductCategoryIcon
                  category={category}
                  size="small"
                  color="inherit"
                />
              }
              onClick={() => onChange(isSelected ? '' : category)}
              color={isSelected ? getCategoryColor(category) : 'default'}
              variant={isSelected ? 'filled' : 'outlined'}
              sx={{
                backgroundColor: isSelected
                  ? `rgba(2, 136, 209, 0.2)`
                  : 'transparent',
                border: `1px solid ${
                  isSelected
                    ? 'rgba(100, 255, 218, 0.5)'
                    : 'rgba(100, 255, 218, 0.2)'
                }`,
                '&:hover': {
                  backgroundColor: isSelected
                    ? 'rgba(2, 136, 209, 0.3)'
                    : 'rgba(2, 136, 209, 0.1)',
                },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default CategoryFilter;
