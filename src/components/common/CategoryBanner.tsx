import React from 'react';
import { Grid2, Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Book as BookIcon,
  Album as CDIcon,
  Radio as LPIcon,
  MovieCreation as DVDIcon,
  Explore as ExploreIcon,
} from '@mui/icons-material';

const CategoryBanner: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: 'Books',
      description: 'Explore our collection of books',
      path: '/products?category=BOOK',
      icon: <BookIcon sx={{ fontSize: 64, color: '#64ffda' }} />,
    },
    {
      title: 'CDs',
      description: 'Discover music albums and collections',
      path: '/products?category=CD',
      icon: <CDIcon sx={{ fontSize: 64, color: '#64ffda' }} />,
    },
    {
      title: 'LP Records',
      description: 'Browse our vinyl collection',
      path: '/products?category=LP',
      icon: <LPIcon sx={{ fontSize: 64, color: '#64ffda' }} />,
    },
    {
      title: 'DVDs',
      description: 'Find movies and shows',
      path: '/products?category=DVD',
      icon: <DVDIcon sx={{ fontSize: 64, color: '#64ffda' }} />,
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
            color: 'text.primary',
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '80px',
              height: '4px',
              background:
                'linear-gradient(90deg, rgba(100, 255, 218, 0.7), rgba(100, 255, 218, 0.1))',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              borderRadius: 2,
            },
          }}
        >
          Media Categories
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
              elevation={3}
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
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage:
                    'radial-gradient(circle at 50% 50%, rgba(100, 255, 218, 0.1) 0%, transparent 70%)',
                  opacity: 0,
                  transition: 'opacity 0.5s ease',
                },
                '&:hover': {
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
                  transform: 'translateY(-8px)',
                  borderColor: 'rgba(100, 255, 218, 0.3)',
                  '&::before': {
                    opacity: 1,
                  },
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
                  color: 'primary.light',
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
                variant="outlined"
                color="primary"
                endIcon={<ExploreIcon />}
                sx={{
                  opacity: 0.9,
                  transform: 'translateY(10px)',
                  transition: 'all 0.3s',
                  borderColor: 'rgba(100, 255, 218, 0.5)',
                  '&:hover': {
                    borderColor: 'rgba(100, 255, 218, 0.8)',
                    backgroundColor: 'rgba(100, 255, 218, 0.05)',
                  },
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
