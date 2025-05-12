import React from 'react';
import { Grid2, Typography, Box } from '@mui/material';
import { Waves as WavesIcon } from '@mui/icons-material';
import { OrderStatus } from '../../types';
import SectionContainer from '../customer/common/SectionContainer';

export interface OrderInfo {
  id: string;
  orderDate: string;
  status: OrderStatus;
}

interface OrderInfoSectionProps {
  orderInfo: OrderInfo;
}

const OrderInfoSection: React.FC<OrderInfoSectionProps> = ({ orderInfo }) => {
  // Status indicator color based on order status
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_PROCESSING:
        return 'success.main';
      case OrderStatus.APPROVED:
        return 'info.main';
      case OrderStatus.REJECTED:
        return 'primary.main';
      case OrderStatus.CANCELLED:
        return 'error.main';
      default:
        return 'text.primary';
    }
  };

  return (
    <SectionContainer
      title="Order Information"
      icon={<WavesIcon fontSize="small" />}
    >
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Order ID
          </Typography>
          <Typography variant="body1" gutterBottom color="text.primary">
            {orderInfo.id}
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Order Date
          </Typography>
          <Typography variant="body1" gutterBottom color="text.primary">
            {new Date(orderInfo.orderDate).toLocaleString()}
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Order Status
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              color: getStatusColor(orderInfo.status),
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: getStatusColor(orderInfo.status),
                display: 'inline-block',
              }}
            />
            {orderInfo.status}
          </Typography>
        </Grid2>
      </Grid2>
    </SectionContainer>
  );
};

export default OrderInfoSection;
