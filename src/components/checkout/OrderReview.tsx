import React from 'react';
import { Grid2, Box, Typography } from '@mui/material';
import { formatCurrency } from '../../utils/formatters';
import { CartItemType } from '../cart/CardItem';

export interface DeliveryInfoReview {
  recipientName: string;
  email: string;
  phone: string;
  province: string;
  address: string;
  isRushDelivery: boolean;
  rushDeliveryTime?: string;
  rushDeliveryInstructions?: string;
}

interface OrderReviewProps {
  deliveryInfo: DeliveryInfoReview;
  items: CartItemType[];
  subtotal: number;
  vat: number;
  deliveryFee: number;
  rushDeliveryFee?: number;
}

const OrderReview: React.FC<OrderReviewProps> = ({
  deliveryInfo,
  items,
  subtotal,
  vat,
  deliveryFee,
  rushDeliveryFee = 0,
}) => {
  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Recipient Name
          </Typography>
          <Typography variant="body1" gutterBottom color="text.primary">
            {deliveryInfo.recipientName}
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Email
          </Typography>
          <Typography variant="body1" gutterBottom color="text.primary">
            {deliveryInfo.email}
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Phone Number
          </Typography>
          <Typography variant="body1" gutterBottom color="text.primary">
            {deliveryInfo.phone}
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Province/City
          </Typography>
          <Typography variant="body1" gutterBottom color="text.primary">
            {deliveryInfo.province}
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Address
          </Typography>
          <Typography variant="body1" gutterBottom color="text.primary">
            {deliveryInfo.address}
          </Typography>
        </Grid2>
        {deliveryInfo.isRushDelivery && (
          <>
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Rush Delivery
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  color: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'primary.light',
                    display: 'inline-block',
                  }}
                />
                Yes -{' '}
                {new Date(deliveryInfo.rushDeliveryTime || '').toLocaleString()}
              </Typography>
            </Grid2>
            {deliveryInfo.rushDeliveryInstructions && (
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Delivery Instructions
                </Typography>
                <Typography variant="body1" gutterBottom color="text.primary">
                  {deliveryInfo.rushDeliveryInstructions}
                </Typography>
              </Grid2>
            )}
          </>
        )}
      </Grid2>

      {/* Order Items */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" color="primary.light" gutterBottom>
          Order Items
        </Typography>
        {items.map((item) => (
          <Box key={item.product.id} sx={{ display: 'flex', mb: 2, py: 1 }}>
            <Box sx={{ mr: 2, textAlign: 'center', minWidth: 40 }}>
              <Typography variant="body2" color="text.secondary">
                {item.quantity}x
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" color="text.primary">
                {item.product.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.product.category}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="primary.light">
                {formatCurrency(item.price * item.quantity)}
              </Typography>
            </Box>
          </Box>
        ))}

        {/* Price Summary */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="text.secondary">
              Subtotal (excl. VAT):
            </Typography>
            <Typography color="text.primary">
              {formatCurrency(subtotal)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="text.secondary">VAT (10%):</Typography>
            <Typography color="text.primary">{formatCurrency(vat)}</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="text.secondary">Delivery Fee:</Typography>
            <Typography color="text.primary">
              {formatCurrency(deliveryFee)}
            </Typography>
          </Box>

          {rushDeliveryFee > 0 && (
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
            >
              <Typography color="text.secondary">Rush Delivery Fee:</Typography>
              <Typography color="text.primary">
                {formatCurrency(rushDeliveryFee)}
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 1,
              mt: 2,
            }}
          >
            <Typography variant="h6" color="primary.light" fontWeight="bold">
              Total:
            </Typography>
            <Typography variant="h6" color="primary.light" fontWeight="bold">
              {formatCurrency(subtotal + vat + deliveryFee + rushDeliveryFee)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderReview;
