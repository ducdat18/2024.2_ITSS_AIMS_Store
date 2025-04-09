import React from 'react';
import { Box, Container, Grid2, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Waves as WavesIcon } from '@mui/icons-material';

const Banner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      className="slider_section"
      sx={{
        position: 'relative',
        py: 8,
        backgroundImage:
          'linear-gradient(135deg, #011627 0%, #01111d 50%, #010a14 100%)',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'radial-gradient(circle at 20% 150%, rgba(2, 136, 209, 0.15) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(100, 255, 218, 0.1) 0%, transparent 60%)',
          zIndex: 1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          height: '40%',
          width: '100%',
          bottom: '-5%',
          left: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 1200 120' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 C150,120 350,0 500,100 C650,200 700,0 1200,80 L1200,120 L0,120 Z' style='fill:%23011627;'/%3E%3C/svg%3E\")",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 2,
          opacity: 0.5,
        },
      }}
    >
      <Container sx={{ position: 'relative', zIndex: 5 }}>
        <Grid2 container alignItems="center" spacing={4}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box className="detail-box">
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  backgroundImage: 'linear-gradient(45deg, #64ffda, #0288d1)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 5px 25px rgba(100, 255, 218, 0.2)',
                  lineHeight: 1.2,
                }}
              >
                Discover Quality
                <br />
                Media Collection
              </Typography>
              <Typography
                sx={{
                  my: 3,
                  color: 'text.secondary',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  maxWidth: '90%',
                }}
              >
                Browse our extensive collection of books, CDs, LP records, and
                DVDs. Find the perfect addition to your media library with AIMS.
              </Typography>
              <Box
                className="btn-box"
                sx={{
                  display: 'flex',
                  mt: 4,
                  gap: 2,
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background:
                        'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      transition: 'all 0.6s',
                    },
                    '&:hover::after': {
                      left: '100%',
                    },
                  }}
                  onClick={() => navigate('/products')}
                  className="btn1"
                  startIcon={<WavesIcon />}
                >
                  Shop Collection
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    borderColor: 'rgba(100, 255, 218, 0.5)',
                    '&:hover': {
                      borderColor: 'rgba(100, 255, 218, 0.8)',
                      backgroundColor: 'rgba(100, 255, 218, 0.05)',
                    },
                  }}
                  onClick={() => navigate('/about')}
                  className="btn2"
                >
                  About Us
                </Button>
              </Box>
            </Box>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box
              className="img-box"
              sx={{
                textAlign: 'center',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '10%',
                  left: '10%',
                  width: '80%',
                  height: '80%',
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle, rgba(2, 136, 209, 0.2) 0%, transparent 70%)',
                  filter: 'blur(25px)',
                  zIndex: -1,
                },
              }}
            >
              {/* Replace with actual image - using placeholder for now */}
              <Box
                sx={{
                  width: '100%',
                  height: { xs: '300px', md: '400px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '15%',
                    left: '15%',
                    width: '70%',
                    height: '70%',
                    borderRadius: '50%',
                    border: '2px solid rgba(100, 255, 218, 0.2)',
                    animation: 'pulse 3s infinite',
                  },
                  '@keyframes pulse': {
                    '0%': {
                      transform: 'scale(0.95)',
                      boxShadow: '0 0 0 0 rgba(100, 255, 218, 0.2)',
                    },
                    '70%': {
                      transform: 'scale(1)',
                      boxShadow: '0 0 0 15px rgba(100, 255, 218, 0)',
                    },
                    '100%': {
                      transform: 'scale(0.95)',
                      boxShadow: '0 0 0 0 rgba(100, 255, 218, 0)',
                    },
                  },
                }}
              >
                <WavesIcon
                  sx={{
                    fontSize: { xs: 120, md: 180 },
                    color: 'primary.light',
                    opacity: 0.9,
                  }}
                />
              </Box>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default Banner;
