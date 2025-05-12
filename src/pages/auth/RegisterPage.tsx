import React from 'react';
import { Box, Container, Button } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { AuthFooter } from '../../components/auth/AuthFooter';
import { AuthPageLayout } from '../../components/auth/AuthPageLayout';
import { RegisterForm } from '../../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <AuthPageLayout>
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 5,
        }}
      >
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ChevronLeftIcon />}
          variant="text"
          color="primary"
          sx={{
            textTransform: 'none',
            color: 'primary.light',
            '&:hover': {
              backgroundColor: 'rgba(100, 255, 218, 0.05)',
            },
          }}
        >
          Back to Home
        </Button>
      </Box>

      <Container
        maxWidth="md"
        sx={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        <RegisterForm />
        <AuthFooter />
      </Container>
    </AuthPageLayout>
  );
};

export default RegisterPage;
