// src/components/home/CategoryGrid.tsx
import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  Box,
  CardContent,
} from '@mui/material';
import {
  Bookmark as BookIcon,
  Album as AlbumIcon,
  RadioOutlined as LPIcon,
  Movie as MovieIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CategoryGrid: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{
          fontWeight: 'bold',
          mb: 4,
          position: 'relative',
          pl: 3,
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 8,
            height: '70%',
            width: 10,
            backgroundColor: '#f9ca16',
          },
        }}
      >
        Media Categories
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={6} sm={3}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                cursor: 'pointer',
              },
            }}
            onClick={() => navigate('/products/category/BOOK')}
          >
            <Box
              sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
              }}
            >
              <BookIcon sx={{ fontSize: 80, color: '#13100e' }} />
            </Box>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Typography gutterBottom variant="h5" component="h2">
                Books
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                cursor: 'pointer',
              },
            }}
            onClick={() => navigate('/products/category/CD')}
          >
            <Box
              sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
              }}
            >
              <AlbumIcon sx={{ fontSize: 80, color: '#13100e' }} />
            </Box>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Typography gutterBottom variant="h5" component="h2">
                CDs
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                cursor: 'pointer',
              },
            }}
            onClick={() => navigate('/products/category/LP')}
          >
            <Box
              sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
              }}
            >
              <LPIcon sx={{ fontSize: 80, color: '#13100e' }} />
            </Box>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Typography gutterBottom variant="h5" component="h2">
                LP Records
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                cursor: 'pointer',
              },
            }}
            onClick={() => navigate('/products/category/DVD')}
          >
            <Box
              sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
              }}
            >
              <MovieIcon sx={{ fontSize: 80, color: '#13100e' }} />
            </Box>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Typography gutterBottom variant="h5" component="h2">
                DVDs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CategoryGrid;
