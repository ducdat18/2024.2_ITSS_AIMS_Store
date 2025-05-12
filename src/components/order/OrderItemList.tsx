import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { Waves as WavesIcon } from '@mui/icons-material';
import { formatCurrency } from '../../utils/formatters';
import SectionContainer from '../customer/common/SectionContainer';
import { CartItemType } from '../cart/CardItem';

interface OrderPricing {
  subtotal: number;
  vat: number;
  deliveryFee: number;
  rushDeliveryFee?: number;
}

interface OrderItemListProps {
  items: CartItemType[];
  pricing: OrderPricing;
}

const OrderItemList: React.FC<OrderItemListProps> = ({ items, pricing }) => {
  const { subtotal, vat, deliveryFee, rushDeliveryFee = 0 } = pricing;
  const total = subtotal + vat + deliveryFee + rushDeliveryFee;

  return (
    <SectionContainer
      title="Order Summary"
      icon={<WavesIcon fontSize="small" />}
    >
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

      <Divider sx={{ my: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography color="text.secondary">Subtotal (excl. VAT):</Typography>
        <Typography color="text.primary">{formatCurrency(subtotal)}</Typography>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography color="text.secondary">Rush Delivery Fee:</Typography>
          <Typography color="text.primary">
            {formatCurrency(rushDeliveryFee)}
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" color="primary.light" fontWeight="bold">
          Total:
        </Typography>
        <Typography variant="h6" color="primary.light" fontWeight="bold">
          {formatCurrency(total)}
        </Typography>
      </Box>
    </SectionContainer>
  );
};

export default OrderItemList;
