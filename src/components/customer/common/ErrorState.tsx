import React from 'react';
import { Box, Container, Typography, Alert, Button } from '@mui/material';
import {
  Warning as WarningIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  message: string;
  backPath?: string;
  backText?: string;
  fullHeight?: boolean;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  backPath = '/',
  backText = 'Back',
  fullHeight = true,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        py: { xs: 4, md: 5 },
        minHeight: fullHeight ? '50vh' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: fullHeight ? 'center' : 'flex-start',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Alert
          severity="error"
          sx={{
            mb: 3,
            backgroundColor: 'rgba(255, 82, 82, 0.1)',
            border: '1px solid rgba(255, 82, 82, 0.3)',
            '& .MuiAlert-icon': {
              color: 'error.main',
            },
          }}
          icon={<WarningIcon />}
        >
          {message}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="contained"
          color="primary"
          onClick={() => navigate(backPath)}
          sx={{
            mt: 2,
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
        >
          {backText}
        </Button>
      </Container>
    </Box>
  );
};

export default ErrorState;
