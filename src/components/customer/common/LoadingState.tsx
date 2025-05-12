import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Waves as WavesIcon } from '@mui/icons-material';

interface LoadingStateProps {
  message?: string;
  useProgress?: boolean;
  minHeight?: string | number;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  useProgress = false,
  minHeight = '70vh',
}) => {
  return (
    <Box
      sx={{
        p: 5,
        textAlign: 'center',
        minHeight: minHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {useProgress ? (
        <CircularProgress color="primary" />
      ) : (
        <WavesIcon
          sx={{
            fontSize: 60,
            color: 'primary.light',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(0.95)',
                opacity: 0.7,
              },
              '70%': {
                transform: 'scale(1.1)',
                opacity: 1,
              },
              '100%': {
                transform: 'scale(0.95)',
                opacity: 0.7,
              },
            },
          }}
        />
      )}
      <Typography
        variant="h5"
        sx={{
          color: 'text.secondary',
          fontWeight: 'medium',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingState;
