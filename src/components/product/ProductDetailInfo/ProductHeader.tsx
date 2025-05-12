import React from 'react';
import { Box, Typography, Divider, Chip } from '@mui/material';
import { Product } from '../../../types';
import PriceDisplay from '../../customer/common/PriceDisplay';

interface ProductHeaderProps {
  product: Product;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ product }) => {
  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: 'text.primary',
        }}
      >
        {product.title}
      </Typography>

      <PriceDisplay
        price={product.price}
        discount={product.discount}
        showOriginalPrice={true}
        size="large"
      />

      <Typography
        variant="body2"
        color="success.main"
        gutterBottom
        sx={{ mt: 1 }}
      >
        In Stock: {product.quantity} items
      </Typography>

      <Divider sx={{ my: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            lineHeight: 1.7,
          }}
        >
          <strong>Description:</strong> {product.description}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProductHeader;
