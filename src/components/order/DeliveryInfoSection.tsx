import React from 'react';
import { Grid2, Typography, Box } from '@mui/material';
import { Waves as WavesIcon } from '@mui/icons-material';
import SectionContainer from '../customer/common/SectionContainer';

export interface DeliveryInfo {
  recipientName: string;
  phone: string;
  email: string;
  province: string;
  address: string;
  isRushDelivery: boolean;
  rushDeliveryTime?: string;
  rushDeliveryInstructions?: string;
}

interface DeliveryInfoSectionProps {
  deliveryInfo: DeliveryInfo;
}

const DeliveryInfoSection: React.FC<DeliveryInfoSectionProps> = ({
  deliveryInfo,
}) => {
  return (
    <SectionContainer
      title="Delivery Information"
      icon={<WavesIcon fontSize="small" />}
    >
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
            Phone Number
          </Typography>
          <Typography variant="body1" gutterBottom color="text.primary">
            {deliveryInfo.phone}
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
                {deliveryInfo.rushDeliveryTime &&
                  new Date(deliveryInfo.rushDeliveryTime).toLocaleString()}
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
    </SectionContainer>
  );
};

export default DeliveryInfoSection;
