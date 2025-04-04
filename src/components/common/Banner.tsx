// src/components/home/Banner.tsx
import React from 'react';
import { Box, Container, Grid2, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Banner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box component="section" className="slider_section">
      <Container>
        <Grid2 container alignItems="center" spacing={4}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box className="detail-box">
              <Typography variant="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Discover Quality
                <br />
                Media Collection
              </Typography>
              <Typography sx={{ my: 3 }}>
                Browse our extensive collection of books, CDs, LP records, and
                DVDs. Find the perfect addition to your media library with AIMS.
              </Typography>
              <Box
                className="btn-box"
                sx={{ display: 'flex', mt: 3, mx: -0.5 }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mx: 0.5, width: 165 }}
                  onClick={() => navigate('/contact')}
                  className="btn1"
                >
                  Contact Us
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mx: 0.5, width: 165 }}
                  onClick={() => navigate('/about')}
                  className="btn2"
                >
                  About Us
                </Button>
              </Box>
            </Box>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box className="img-box" sx={{ textAlign: 'center' }}>
              {/* Replace with actual image */}
              <Box
                component="img"
                src="/src/assets/aims.jpg"
                alt="Media Collection"
                sx={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default Banner;
