import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import { Waves as WavesIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface EmptyCartProps {
  message?: string;
  buttonText?: string;
  buttonPath?: string;
}

const EmptyCart: React.FC<EmptyCartProps> = ({
  message = 'Your cart is floating empty in the deep ocean',
  buttonText = 'Dive Into Shopping',
  buttonPath = '/products',
}) => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={3}
      sx={{
        textAlign: 'center',
        py: 6,
        px: 3,
        backgroundImage: 'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
        borderRadius: 2,
        border: '1px solid rgba(100, 255, 218, 0.1)',
      }}
    >
      <WavesIcon
        sx={{
          fontSize: 60,
          color: 'primary.light',
          mb: 2,
          opacity: 0.7,
        }}
      />
      <Typography variant="h5" gutterBottom sx={{ color: 'primary.light' }}>
        {message}
      </Typography>
      <Typography
        sx={{
          mb: 4,
          color: 'text.secondary',
          maxWidth: 600,
          mx: 'auto',
        }}
      >
        It looks like you haven't added any items to your cart yet. Explore our
        collection and discover the perfect media products for your collection.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(buttonPath)}
        sx={{
          mt: 2,
          px: 4,
          py: 1.2,
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
        startIcon={<WavesIcon />}
      >
        {buttonText}
      </Button>
    </Paper>
  );
};

export default EmptyCart;
