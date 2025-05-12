import React from 'react';
import { Grid2, Box, Typography } from '@mui/material';
import {
  Radio as LPIcon,
  MusicNote as ArtistIcon,
  Label as RecordLabelIcon,
  CalendarToday as DateIcon,
  Category as GenreIcon,
} from '@mui/icons-material';
import { LPProduct } from '../../../types';

interface LPDetailsProps {
  product: LPProduct;
}

const LPDetails: React.FC<LPDetailsProps> = ({ product }) => {
  const formatDate = (dateString: string) => {
    return dateString
      ? new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'N/A';
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: 'warning.light',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <LPIcon fontSize="small" />
          Product Details
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <ArtistIcon sx={{ mr: 1, color: 'warning.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Artists:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {product.artists.join(', ')}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <RecordLabelIcon sx={{ mr: 1, color: 'warning.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Record Label:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {product.recordLabel}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <GenreIcon sx={{ mr: 1, color: 'warning.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Genre:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {product.genre}
        </Typography>
      </Grid2>

      {product.releaseDate && (
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DateIcon sx={{ mr: 1, color: 'warning.light' }} />
            <Typography variant="subtitle2" color="text.secondary">
              Release Date:
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ ml: 4, mb: 2, color: 'text.primary' }}
          >
            {formatDate(product.releaseDate)}
          </Typography>
        </Grid2>
      )}
    </Grid2>
  );
};

export default LPDetails;
