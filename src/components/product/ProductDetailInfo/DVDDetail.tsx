import React from 'react';
import { Grid2, Box, Typography } from '@mui/material';
import {
  MovieCreation as DVDIcon,
  Person as DirectorIcon,
  Laptop as StudioIcon,
  AccessTime as RuntimeIcon,
  Info as InfoIcon,
  Language as LanguageIcon,
  Subtitles as SubtitlesIcon,
  CalendarToday as DateIcon,
  Category as GenreIcon,
} from '@mui/icons-material';
import { DVDProduct, DiscType } from '../../../types';

interface DVDDetailsProps {
  product: DVDProduct;
}

const DVDDetails: React.FC<DVDDetailsProps> = ({ product }) => {
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
            color: 'success.light',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <DVDIcon fontSize="small" />
          Product Details
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <DirectorIcon sx={{ mr: 1, color: 'success.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Director:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {product.director}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <StudioIcon sx={{ mr: 1, color: 'success.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Studio:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {product.studio}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <RuntimeIcon sx={{ mr: 1, color: 'success.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Runtime:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {product.runtime} minutes
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <InfoIcon sx={{ mr: 1, color: 'success.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Disc Type:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {product.discType === DiscType.BLURAY ? 'Blu-ray' : 'HD-DVD'}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LanguageIcon sx={{ mr: 1, color: 'success.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Languages:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {product.language.join(', ')}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <SubtitlesIcon sx={{ mr: 1, color: 'success.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Subtitles:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {product.subtitles.join(', ')}
        </Typography>
      </Grid2>

      {product.releaseDate && (
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DateIcon sx={{ mr: 1, color: 'success.light' }} />
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

      {product.genre && (
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <GenreIcon sx={{ mr: 1, color: 'success.light' }} />
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
      )}
    </Grid2>
  );
};

export default DVDDetails;
