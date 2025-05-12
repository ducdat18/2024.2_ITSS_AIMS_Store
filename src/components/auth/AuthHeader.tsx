import React from 'react';
import { Box, Typography } from '@mui/material';
import { Waves as WavesIcon } from '@mui/icons-material';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        mb: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <WavesIcon
        sx={{
          fontSize: 40,
          color: 'primary.light',
          mb: 1,
        }}
      />
      <Typography
        variant="h4"
        component="h1"
        align="center"
        sx={{
          fontWeight: 'bold',
          backgroundImage: 'linear-gradient(45deg, #64ffda, #0288d1)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 5px 25px rgba(100, 255, 218, 0.2)',
        }}
      >
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        {subtitle}
      </Typography>
    </Box>
  );
};
