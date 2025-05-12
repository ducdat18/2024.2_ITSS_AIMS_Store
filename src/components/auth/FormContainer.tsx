import React, { ReactNode } from 'react';
import { Box, Paper } from '@mui/material';

interface FormContainerProps {
  children: ReactNode;
}

export const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        backgroundImage: 'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
        border: '1px solid rgba(100, 255, 218, 0.1)',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          p: 0.5,
          backgroundImage: 'linear-gradient(90deg, #0288d1, #005b9f)',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          backgroundImage:
            'radial-gradient(circle at 50% 15%, rgba(2, 136, 209, 0.08) 0%, transparent 60%)',
          opacity: 0.8,
          zIndex: 1,
        }}
      />

      <Box sx={{ px: 4, py: 5, position: 'relative', zIndex: 2 }}>
        {children}
      </Box>
    </Paper>
  );
};
