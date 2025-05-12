import React from 'react';
import { Grid2, Box, Typography } from '@mui/material';
import {
  Book as BookIcon,
  SupervisorAccount as AuthorIcon,
  CalendarToday as DateIcon,
  Store as PublisherIcon,
  Info as InfoIcon,
  Language as LanguageIcon,
  Category as GenreIcon,
} from '@mui/icons-material';
import { BookProduct, CoverType } from '../../../types';

interface BookDetailsProps {
  product: BookProduct;
}

const BookDetails: React.FC<BookDetailsProps> = ({ product }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
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
          <BookIcon fontSize="small" />
          Product Details
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AuthorIcon sx={{ mr: 1, color: 'primary.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Authors:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {product.authors.join(', ')}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PublisherIcon sx={{ mr: 1, color: 'primary.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Publisher:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {product.publisher}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <DateIcon sx={{ mr: 1, color: 'primary.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Publication Date:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {formatDate(product.publicationDate)}
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <InfoIcon sx={{ mr: 1, color: 'primary.light' }} />
          <Typography variant="subtitle2" color="text.secondary">
            Cover Type:
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ ml: 4, mb: 2, color: 'text.primary' }}
        >
          {product.coverType === CoverType.PAPERBACK ? 'Paperback' : 'Hardcover'}
        </Typography>
      </Grid2>

      {product.pages && (
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <InfoIcon sx={{ mr: 1, color: 'primary.light' }} />
            <Typography variant="subtitle2" color="text.secondary">
              Pages:
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ ml: 4, mb: 2, color: 'text.primary' }}
          >
            {product.pages}
          </Typography>
        </Grid2>
      )}

      {product.language && (
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LanguageIcon sx={{ mr: 1, color: 'primary.light' }} />
            <Typography variant="subtitle2" color="text.secondary">
              Language:
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ ml: 4, mb: 2, color: 'text.primary' }}
          >
            {product.language}
          </Typography>
        </Grid2>
      )}

      {product.genre && (
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <GenreIcon sx={{ mr: 1, color: 'primary.light' }} />
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

export default BookDetails;