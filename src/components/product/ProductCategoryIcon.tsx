import React from 'react';
import { SvgIconProps } from '@mui/material';
import {
  Book as BookIcon,
  Album as CDIcon,
  Radio as LPIcon,
  MovieCreation as DVDIcon,
} from '@mui/icons-material';
import { ProductCategory } from '../../types';

interface ProductCategoryIconProps {
  category: ProductCategory;
  size?: 'small' | 'medium' | 'large' | 'inherit';
  color?: string;
  sx?: object;
}

const ProductCategoryIcon: React.FC<ProductCategoryIconProps> = ({
  category,
  size = 'medium',
  color = 'primary.light',
  sx = {},
}) => {
  const sizeMap: Record<string, number> = {
    small: 24,
    medium: 40,
    large: 60,
    inherit: 24,
  };

  const iconProps: SvgIconProps = {
    sx: { fontSize: sizeMap[size], color, ...sx },
  };

  switch (category) {
    case ProductCategory.BOOK:
      return <BookIcon {...iconProps} />;
    case ProductCategory.CD:
      return <CDIcon {...iconProps} />;
    case ProductCategory.LP:
      return <LPIcon {...iconProps} />;
    case ProductCategory.DVD:
      return <DVDIcon {...iconProps} />;
    default:
      return null;
  }
};

export const getCategoryColor = (
  category: ProductCategory
): 'primary' | 'secondary' | 'warning' | 'success' => {
  switch (category) {
    case ProductCategory.BOOK:
      return 'primary';
    case ProductCategory.CD:
      return 'secondary';
    case ProductCategory.LP:
      return 'warning';
    case ProductCategory.DVD:
      return 'success';
    default:
      return 'primary';
  }
};

export default ProductCategoryIcon;
