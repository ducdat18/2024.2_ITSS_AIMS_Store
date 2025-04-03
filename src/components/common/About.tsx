// src/components/home/AboutSection.tsx
import React from 'react';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AboutSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      className="about_section layout_padding long_section"
      sx={{
        backgroundColor: '#f9fafa',
      }}
    >
      <Container>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box className="img-box">
              <Box
                component="img"
                src="/images/about-img.png"
                alt="About AIMS"
                sx={{
                  width: '100%',
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className="detail-box">
              <Box className="heading_container">
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 'bold',
                    position: 'relative',
                  }}
                >
                  About AIMS
                </Typography>
              </Box>
              <Typography paragraph sx={{ mt: 2 }}>
                AIMS is a desktop e-commerce software that operates 24/7,
                allowing new users to easily familiarize themselves. This
                software can serve up to 1,000 customers simultaneously without
                significantly reducing performance and can operate continuously
                for 300 hours without failure.
              </Typography>
              <Typography paragraph>
                Our store specializes in physical media products including
                books, CDs, LP records, and DVDs. We provide detailed
                information about each product and ensure quality service.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/about')}
                sx={{ mt: 2, px: 4 }}
              >
                Read More
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;
