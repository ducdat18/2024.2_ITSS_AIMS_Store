import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { formatCurrency } from '../../../utils/formatters';

interface PriceDisplayProps {
  price: number;
  discount?: number;
  quantity?: number;
  showOriginalPrice?: boolean;
  size?: 'small' | 'medium' | 'large';
  textAlign?: 'left' | 'center' | 'right';
  includeVatMessage?: boolean;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  discount = 0,
  quantity = 1,
  showOriginalPrice = true,
  size = 'medium',
  textAlign = 'left',
  includeVatMessage = true,
}) => {
  const discountedPrice = discount
    ? Math.round(price * (1 - discount / 100))
    : price;
  const totalPrice = discountedPrice * quantity;

  const fontSizes = {
    small: {
      price: 'body1' as const,
      original: 'caption' as const,
      vat: 'caption' as const,
    },
    medium: {
      price: 'h5' as const,
      original: 'body2' as const,
      vat: 'body2' as const,
    },
    large: {
      price: 'h4' as const,
      original: 'subtitle1' as const,
      vat: 'body2' as const,
    },
  };

  return (
    <Box sx={{ textAlign }}>
      {discount > 0 ? (
        <Box sx={{ mb: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography
              variant={fontSizes[size].price}
              color="error.main"
              fontWeight="bold"
            >
              {formatCurrency(totalPrice)}
            </Typography>
            <Chip
              label={`-${discount}%`}
              color="error"
              size="small"
              sx={{ ml: 1, fontWeight: 'bold' }}
            />
          </Box>
          {showOriginalPrice && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant={fontSizes[size].original}
                color="text.secondary"
              >
                Original price:
              </Typography>
              <Typography
                variant={fontSizes[size].original}
                sx={{
                  ml: 1,
                  color: 'text.secondary',
                  textDecoration: 'line-through',
                }}
              >
                {formatCurrency(price * quantity)}
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Typography
          variant={fontSizes[size].price}
          color="primary.light"
          fontWeight="bold"
        >
          {formatCurrency(totalPrice)}
        </Typography>
      )}

      {includeVatMessage && (
        <Typography variant={fontSizes[size].vat} color="text.secondary">
          Price does not include 10% VAT
        </Typography>
      )}
    </Box>
  );
};

export default PriceDisplay;
