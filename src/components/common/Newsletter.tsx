import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid2,
  Typography,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribed with email:', email);
    setEmail('');
    // Implement actual subscription logic
  };

  return (
    <Box
      sx={{
        py: 6,
        position: 'relative',
        backgroundImage: 'linear-gradient(135deg, #041c2c 0%, #010e1a 100%)',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'radial-gradient(circle at 80% 20%, rgba(100, 255, 218, 0.1) 0%, transparent 60%)',
          zIndex: 1,
        },
      }}
    >
      <Container sx={{ position: 'relative', zIndex: 2 }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            backgroundImage:
              'linear-gradient(135deg, rgba(13, 37, 56, 0.9) 0%, rgba(4, 28, 44, 0.9) 100%)',
            border: '1px solid rgba(100, 255, 218, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage:
                'radial-gradient(circle at 50% 50%, rgba(2, 136, 209, 0.1) 0%, transparent 70%)',
              opacity: 0.6,
            },
          }}
        >
          <Grid2 container spacing={4} alignItems="center">
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  color: 'primary.light',
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 60,
                    height: 3,
                    backgroundColor: 'rgba(100, 255, 218, 0.5)',
                    borderRadius: 4,
                  },
                }}
              >
                Subscribe to Our Newsletter
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 4, color: 'text.secondary' }}
              >
                Stay updated with our latest products and special offers. Be the
                first to know about new additions to our deep ocean collection.
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box
                component="form"
                onSubmit={handleSubscribe}
                sx={{
                  position: 'relative',
                  zIndex: 3,
                }}
              >
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12, sm: 8 }}>
                    <TextField
                      fullWidth
                      placeholder="Your Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      variant="outlined"
                      sx={{
                        '.MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(1, 22, 39, 0.5)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(1, 22, 39, 0.7)',
                          },
                          '& fieldset': {
                            borderColor: 'rgba(100, 255, 218, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(100, 255, 218, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'rgba(100, 255, 218, 0.7)',
                          },
                        },
                        input: {
                          color: 'text.primary',
                        },
                      }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 4 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        height: '100%',
                        py: { xs: 1.5, sm: 'auto' },
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
                      startIcon={<EmailIcon />}
                    >
                      Subscribe
                    </Button>
                  </Grid2>
                </Grid2>
              </Box>
            </Grid2>
          </Grid2>
        </Paper>
      </Container>
    </Box>
  );
};

export default Newsletter;
