import React from 'react';
import { Divider, Typography } from '@mui/material';

export const AuthDivider: React.FC = () => {
  return (
    <Divider
      sx={{
        my: 4,
        borderColor: 'rgba(100, 255, 218, 0.1)',
        '&::before, &::after': {
          borderColor: 'rgba(100, 255, 218, 0.1)',
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: 'rgba(100, 255, 218, 0.5)',
          px: 1,
        }}
      >
        OR
      </Typography>
    </Divider>
  );
};
