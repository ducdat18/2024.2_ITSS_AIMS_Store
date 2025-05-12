export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear login error when user changes input
    if (loginError) {
      setLoginError(null);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Get all accounts
      const accounts = await mockAccountService.getAccounts();

      // Find account with matching email
      const account = accounts.find((acc) => acc.email === formData.email);

      // Check if account exists
      if (!account) {
        setLoginError('Invalid email or password');
        setLoading(false);
        return;
      }

      // Check password
      if (account.password !== formData.password) {
        setLoginError('Invalid email or password');
        setLoading(false);
        return;
      }

      // Check if account is blocked
      if (account.isBlocked) {
        setLoginError(
          'Your account has been blocked. Please contact an administrator.'
        );
        setLoading(false);
        return;
      }

      // Authentication successful
      console.log('Login successful:', account.username);

      // In a real app, you would set authentication tokens here
      // For this mock, we'll just simulate it with localStorage
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: account.id,
          username: account.username,
          email: account.email,
          roles: account.roles,
        })
      );

      // Redirect based on role
      if (account.roles.includes(UserRole.ADMIN)) {
        // If user has admin role, redirect to admin dashboard
        navigate('/admin');
      } else if (account.roles.includes(UserRole.PRODUCT_MANAGER)) {
        // If user has product manager role, redirect to product management
        navigate('/product-management');
      } else {
        // Fallback to home page
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <AuthHeader
        title="Login to AIMS"
        subtitle="Dive into your ocean of media"
      />

      {loginError && <FormAlert severity="error">{loginError}</FormAlert>}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12 }}>
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              icon={<PersonIcon sx={{ color: 'rgba(100, 255, 218, 0.7)' }} />}
              required
              disabled={loading}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <PasswordField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              required
              disabled={loading}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                mt: 1,
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
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
          </Grid2>
        </Grid2>
      </Box>

      <AuthDivider />

      <Box sx={{ textAlign: 'center' }}>
        <Button
          component={RouterLink}
          to="/register"
          variant="outlined"
          color="primary"
          disabled={loading}
          sx={{
            mt: 1,
            px: 4,
            borderColor: 'rgba(100, 255, 218, 0.3)',
            '&:hover': {
              borderColor: 'rgba(100, 255, 218, 0.5)',
              backgroundColor: 'rgba(100, 255, 218, 0.05)',
            },
          }}
        >
          Register Now
        </Button>
      </Box>

      <DemoLoginButtons loading={loading} setFormData={setFormData} />
    </FormContainer>
  );
};

// src/components/auth/DemoLoginButtons.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid2,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import { mockAccountService } from '../../mock/mockDataAccount';
import { UserRole } from '../../types';
import { AuthHeader } from './AuthHeader';
import { FormField } from './FormField';
import { PasswordField } from './PasswordField';
import { AuthDivider } from './AuthDivider';
import { FormContainer } from './FormContainer';
import { FormAlert } from './FormAlert';

interface LoginCredentials {
  email: string;
  password: string;
}

interface DemoLoginButtonsProps {
  loading: boolean;
  setFormData: React.Dispatch<React.SetStateAction<LoginCredentials>>;
}

export const DemoLoginButtons: React.FC<DemoLoginButtonsProps> = ({
  loading,
  setFormData,
}) => {
  return (
    <Box sx={{ mt: 3, textAlign: 'center' }}>
      <Typography variant="caption" color="text.secondary">
        Demo Accounts:
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 1,
          mt: 1,
        }}
      >
        <Button
          size="small"
          variant="outlined"
          color="primary"
          disabled={loading}
          onClick={() => {
            setFormData({
              email: 'admin@aims.com',
              password: 'admin123',
            });
          }}
          sx={{
            fontSize: '0.7rem',
            py: 0.5,
            borderColor: 'rgba(100, 255, 218, 0.3)',
          }}
        >
          Admin
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          disabled={loading}
          onClick={() => {
            setFormData({
              email: 'pm@aims.com',
              password: 'pm123',
            });
          }}
          sx={{
            fontSize: '0.7rem',
            py: 0.5,
            borderColor: 'rgba(0, 96, 100, 0.3)',
          }}
        >
          Product Manager
        </Button>
      </Box>
    </Box>
  );
};
