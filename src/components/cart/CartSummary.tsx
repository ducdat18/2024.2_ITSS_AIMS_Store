import React from 'react';
import { Box, Paper, Typography, Button, Divider } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { formatCurrency } from '../../utils/formatters';
import { CartItemType } from './CardItem';

interface CartSummaryProps {
  items: CartItemType[];
  onCheckout: () => void;
  disabled?: boolean;
  deliveryFee?: number;
  rushDeliveryFee?: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  items,
  onCheckout,
  disabled = false,
  deliveryFee = 0,
  rushDeliveryFee = 0,
}) => {
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateVAT = () => {
    return calculateSubtotal() * 0.1; // 10% VAT
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT() + deliveryFee + rushDeliveryFee;
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        bgcolor: 'rgba(13, 37, 56, 0.5)',
        borderRadius: 2,
        border: '1px solid rgba(100, 255, 218, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(2, 136, 209, 0.08) 0%, transparent 70%)',
          opacity: 0.8,
          zIndex: 1,
        },
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        color="primary.light"
        sx={{
          fontWeight: 'bold',
          position: 'relative',
          zIndex: 2,
        }}
      >
        Cart Summary
      </Typography>
      <Divider sx={{ mb: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 1,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography color="text.secondary">Subtotal (excl. VAT):</Typography>
        <Typography color="text.primary">
          {formatCurrency(calculateSubtotal())}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 1,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography color="text.secondary">VAT (10%):</Typography>
        <Typography color="text.primary">
          {formatCurrency(calculateVAT())}
        </Typography>
      </Box>

      {deliveryFee > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 1,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Typography color="text.secondary">Delivery Fee:</Typography>
          <Typography color="text.primary">
            {formatCurrency(deliveryFee)}
          </Typography>
        </Box>
      )}

      {rushDeliveryFee > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 1,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Typography color="text.secondary">Rush Delivery Fee:</Typography>
          <Typography color="text.primary">
            {formatCurrency(rushDeliveryFee)}
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 3,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography variant="h6" color="primary.light" fontWeight="bold">
          Total:
        </Typography>
        <Typography variant="h6" color="primary.light" fontWeight="bold">
          {formatCurrency(calculateTotal())}
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        onClick={onCheckout}
        disabled={disabled}
        endIcon={<ArrowForwardIcon />}
        sx={{
          px: 3,
          py: 1.2,
          position: 'relative',
          zIndex: 2,
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
        Proceed to Checkout
      </Button>
    </Paper>
  );
};

export default CartSummary;
