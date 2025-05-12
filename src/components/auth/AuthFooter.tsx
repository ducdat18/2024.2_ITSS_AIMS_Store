import React from 'react';
import { Box, Typography } from '@mui/material';

export const AuthFooter: React.FC = () => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        mt: 3,
        color: 'text.secondary',
        fontSize: '0.8rem',
      }}
    >
      <Typography variant="caption">
        © {new Date().getFullYear()} AIMS - An Internet Media Store. All Rights
        Reserved.
      </Typography>
    </Box>
  );
};
