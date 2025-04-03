// src/components/common/Newsletter.tsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid2,
  Typography,
  TextField,
  Button,
} from '@mui/material';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribed with email:', email);
    setEmail('');
    // Implement actual subscription logic
  };

  return (
    <Box sx={{ py: 6, bgcolor: '#ffffff' }}>
      {' '}
      {/* Light blue background */}
      <Container>
        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', mb: 2, color: 'secondary.main' }}
            >
              Subscribe to Our Newsletter
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              Stay updated with our latest products and special offers.
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box component="form" onSubmit={handleSubscribe}>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 8 }}>
                  <TextField
                    fullWidth
                    placeholder="Your Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    sx={{
                      bgcolor: 'white',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.12)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'primary.light',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                        },
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
                    sx={{ height: '100%' }}
                  >
                    Subscribe
                  </Button>
                </Grid2>
              </Grid2>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default Newsletter;
