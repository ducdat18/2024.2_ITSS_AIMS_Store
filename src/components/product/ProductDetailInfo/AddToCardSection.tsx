import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { ShoppingCart as CartIcon } from '@mui/icons-material';
import { formatCurrency } from '../../../utils/formatters';
import { Product } from '../../../types';
import QuantitySelector from '../../customer/common/QuanlitySelector';

interface AddToCartSectionProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  showTotal?: boolean;
}

const AddToCartSection: React.FC<AddToCartSectionProps> = ({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  showTotal = true,
}) => {
  const calculateTotal = () => {
    return product.discount
      ? Math.round(product.price * (1 - product.discount / 100)) * quantity
      : product.price * quantity;
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        backgroundImage:
          'linear-gradient(135deg, rgba(13, 37, 56, 0.7) 0%, rgba(4, 28, 44, 0.7) 100%)',
        borderRadius: 2,
        border: '1px solid rgba(100, 255, 218, 0.1)',
      }}
    >
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="subtitle1" color="text.primary">
          Quantity:
        </Typography>

        <QuantitySelector
          quantity={quantity}
          onChange={onQuantityChange}
          min={1}
          max={product.quantity}
          size="medium"
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {showTotal && (
          <Typography variant="h6" color="primary.light">
            Total: {formatCurrency(calculateTotal())}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          startIcon={<CartIcon />}
          onClick={onAddToCart}
          fullWidth={!showTotal}
          sx={{
            px: 3,
            py: 1,
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              transition: 'all 0.6s',
            },
            '&:hover::after': {
              left: '100%',
            },
          }}
        >
          Add to Cart
        </Button>
      </Box>
    </Paper>
  );
};

export default AddToCartSection;
