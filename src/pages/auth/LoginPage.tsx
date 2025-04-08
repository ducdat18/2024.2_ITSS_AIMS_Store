// src/pages/auth/LoginPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  Grid2,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
  ChevronLeft as ChevronLeftIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { mockAccountService } from '../../mock/mockDataAccount';
import { UserRole } from '../../types';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
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
        navigate('/product/management');
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
    <Box
      sx={{
        py: { xs: 4, md: 5 },
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(2, 136, 209, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(100, 255, 218, 0.05) 0%, transparent 50%)',
          zIndex: 1,
        },
      }}
    >
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
        maxWidth="sm"
        sx={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
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
                Login to AIMS
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Dive into your ocean of media
              </Typography>
            </Box>

            {loginError && (
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
              >
                {loginError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon
                            sx={{ color: 'rgba(100, 255, 218, 0.7)' }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    required
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(1, 22, 39, 0.3)',
                        '&:hover': {
                          backgroundColor: 'rgba(1, 22, 39, 0.5)',
                        },
                        '& fieldset': {
                          borderColor: 'rgba(100, 255, 218, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(100, 255, 218, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'rgba(100, 255, 218, 0.7)',
                        },
                      },
                    }}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon
                            sx={{ color: 'rgba(100, 255, 218, 0.7)' }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            disabled={loading}
                            sx={{
                              color: 'rgba(100, 255, 218, 0.7)',
                              '&:hover': {
                                backgroundColor: 'rgba(100, 255, 218, 0.05)',
                              },
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    required
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(1, 22, 39, 0.3)',
                        '&:hover': {
                          backgroundColor: 'rgba(1, 22, 39, 0.5)',
                        },
                        '& fieldset': {
                          borderColor: 'rgba(100, 255, 218, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(100, 255, 218, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'rgba(100, 255, 218, 0.7)',
                        },
                      },
                    }}
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

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" gutterBottom color="text.secondary">
                Don't have an account?
              </Typography>
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

            {/* Demo login credentials */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Demo Accounts:
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
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
                  Admin Login
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
                  Product Manager Login
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Box
          sx={{
            textAlign: 'center',
            mt: 3,
            color: 'text.secondary',
            fontSize: '0.8rem',
          }}
        >
          <Typography variant="caption">
            © {new Date().getFullYear()} AIMS - An Internet Media Store. All
            Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
