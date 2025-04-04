// src/components/home/CategoryBanner.tsx
import React from 'react';
import { Grid2, Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Book as BookIcon,
  Album as CDIcon,
  Radio as LPIcon,
  MovieCreation as DVDIcon,
} from '@mui/icons-material';

const CategoryBanner: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: 'Books',
      description: 'Explore our collection of books',
      path: '/products/category/BOOK',
      icon: <BookIcon sx={{ fontSize: 64 }} />,
    },
    {
      title: 'CDs',
      description: 'Discover music albums and collections',
      path: '/products/category/CD',
      icon: <CDIcon sx={{ fontSize: 64 }} />,
    },
    {
      title: 'LP Records',
      description: 'Browse our vinyl collection',
      path: '/products/category/LP',
      icon: <LPIcon sx={{ fontSize: 64 }} />,
    },
    {
      title: 'DVDs',
      description: 'Find movies and shows',
      path: '/products/category/DVD',
      icon: <DVDIcon sx={{ fontSize: 64 }} />,
    },
  ];

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            position: 'relative',
            display: 'inline-block',
            pb: 2,
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '80px',
              height: '4px',
              backgroundColor: 'primary.main', // Blue
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
            },
          }}
        >
          Browse Categories
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 700, mx: 'auto', fontSize: '1.1rem' }}
        >
          Explore our wide selection of media products across different
          categories. Find your next favorite book, album, or movie.
        </Typography>
      </Box>

      <Grid2 container spacing={4}>
        {categories.map((category, index) => (
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Paper
              elevation={0}
              sx={{
                height: 300,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                borderRadius: 2,
                backgroundColor: 'white',
                border: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.08)',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  transform: 'translateY(-8px)',
                  '& .category-icon': {
                    transform: 'scale(1.1)',
                  },
                  '& .category-button': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
              onClick={() => navigate(category.path)}
            >
              <Box
                className="category-icon"
                sx={{
                  color: 'primary.main', // Blue
                  mb: 3,
                  transition: 'all 0.4s ease',
                }}
              >
                {category.icon}
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  mb: 1,
                  color: 'secondary.main', // Black
                }}
              >
                {category.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  color: 'text.secondary',
                }}
              >
                {category.description}
              </Typography>
              <Button
                className="category-button"
                variant="contained"
                color="warning" // Yellow
                sx={{
                  opacity: 0.9,
                  transform: 'translateY(10px)',
                  transition: 'all 0.3s',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(category.path);
                }}
              >
                Explore
              </Button>
            </Paper>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default CategoryBanner;
