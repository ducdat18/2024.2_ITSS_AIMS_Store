import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { CheckCircleOutline as CheckCircleIcon } from '@mui/icons-material';

interface SuccessMessageProps {
  title: string;
  message: React.ReactNode;
  icon?: React.ReactNode;
  withBackground?: boolean;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title,
  message,
  icon = (
    <CheckCircleIcon
      color="success"
      sx={{
        fontSize: 80,
        mb: 2,
        filter: 'drop-shadow(0 0 8px rgba(0, 191, 165, 0.5))',
      }}
    />
  ),
  withBackground = true,
}) => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        mb: 4,
        p: 4,
        borderRadius: 2,
        ...(withBackground && {
          backgroundImage:
            'linear-gradient(135deg, rgba(0, 191, 165, 0.1) 0%, rgba(0, 142, 118, 0.1) 100%)',
          border: '1px solid rgba(0, 191, 165, 0.2)',
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
              'radial-gradient(circle at 50% 50%, rgba(0, 191, 165, 0.15) 0%, transparent 70%)',
            opacity: 0.6,
            zIndex: 1,
          },
        }),
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        {icon}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          color="success.main"
          sx={{ fontWeight: 'bold' }}
        >
          {title}
        </Typography>
        {typeof message === 'string' ? (
          <Typography color="text.secondary">{message}</Typography>
        ) : (
          message
        )}
      </Box>
    </Box>
  );
};

export const InlineSuccessAlert: React.FC<{ message: string }> = ({
  message,
}) => (
  <Alert
    severity="success"
    sx={{
      mb: 2,
      backgroundColor: 'rgba(0, 191, 165, 0.1)',
      border: '1px solid rgba(0, 191, 165, 0.3)',
      '& .MuiAlert-icon': {
        color: 'success.main',
      },
    }}
  >
    {message}
  </Alert>
);

export default SuccessMessage;
