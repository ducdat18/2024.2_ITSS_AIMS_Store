import React from 'react';
import { Grid2, Box, Typography } from '@mui/material';
import {
  Info as InfoIcon,
  CalendarToday as DateIcon,
} from '@mui/icons-material';
import { Product } from '../../../types';

interface SpecificationsProps {
  product: Product;
}

const Specifications: React.FC<SpecificationsProps> = ({ product }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: 'primary.light',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <InfoIcon fontSize="small" />
            Physical Specifications
          </Typography>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <InfoIcon sx={{ mr: 1, color: 'primary.light' }} />
            <Typography variant="subtitle2" color="text.secondary">
              Dimensions:
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ ml: 4, mb: 2, color: 'text.primary' }}
          >
            {`${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`}
          </Typography>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <InfoIcon sx={{ mr: 1, color: 'primary.light' }} />
            <Typography variant="subtitle2" color="text.secondary">
              Weight:
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ ml: 4, mb: 2, color: 'text.primary' }}
          >
            {`${product.weight} kg`}
          </Typography>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DateIcon sx={{ mr: 1, color: 'primary.light' }} />
            <Typography variant="subtitle2" color="text.secondary">
              Warehouse Entry Date:
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ ml: 4, mb: 2, color: 'text.primary' }}
          >
            {formatDate(product.warehouseEntryDate)}
          </Typography>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <InfoIcon sx={{ mr: 1, color: 'primary.light' }} />
            <Typography variant="subtitle2" color="text.secondary">
              Barcode:
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ ml: 4, mb: 2, color: 'text.primary' }}
          >
            {product.barcode}
          </Typography>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Specifications;
