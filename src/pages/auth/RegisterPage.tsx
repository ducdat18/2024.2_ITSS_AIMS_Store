// src/pages/auth/RegisterPage.tsx
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
  MenuItem,
  Grid2,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Link,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ChevronLeft as ChevronLeftIcon,
  Waves as WavesIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// Vietnamese provinces array from CheckoutPage.tsx
const vietnamProvinces = [
  'Hanoi',
  'Ho Chi Minh City',
  'Da Nang',
  'Hai Phong',
  'Can Tho',
  // More provinces would be included here
];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    province: '',
    address: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }

    // Province validation
    if (!formData.province) {
      newErrors.province = 'Province is required';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // In a real app, this would call a registration API
      console.log('Registration data:', formData);

      // Simulate successful registration
      setRegistrationStatus({
        success: true,
        message: 'Registration successful! You can now log in.',
      });

      // Clear form after successful registration
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        province: '',
        address: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
      });

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 4, md: 5 },
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
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
        maxWidth="md"
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
                Create an Account
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Join our deep ocean of media products
              </Typography>
            </Box>

            {registrationStatus && (
              <Alert
                severity={registrationStatus.success ? 'success' : 'error'}
                sx={{
                  mb: 3,
                  backgroundColor: registrationStatus.success
                    ? 'rgba(0, 191, 165, 0.1)'
                    : 'rgba(255, 82, 82, 0.1)',
                  border: `1px solid ${
                    registrationStatus.success
                      ? 'rgba(0, 191, 165, 0.3)'
                      : 'rgba(255, 82, 82, 0.3)'
                  }`,
                  '& .MuiAlert-icon': {
                    color: registrationStatus.success
                      ? 'success.main'
                      : 'error.main',
                  },
                }}
                icon={registrationStatus.success ? <CheckIcon /> : undefined}
              >
                {registrationStatus.message}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
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

                <Grid2 size={{ xs: 12, md: 6 }}>
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
                          <EmailIcon
                            sx={{ color: 'rgba(100, 255, 218, 0.7)' }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    required
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

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon
                            sx={{ color: 'rgba(100, 255, 218, 0.7)' }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    required
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

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Province/City"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    error={!!errors.province}
                    helperText={errors.province}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon
                            sx={{ color: 'rgba(100, 255, 218, 0.7)' }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    required
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
                      '& .MuiMenuItem-root:hover': {
                        backgroundColor: 'rgba(2, 136, 209, 0.1)',
                      },
                      '& .MuiMenuItem-root.Mui-selected': {
                        backgroundColor: 'rgba(2, 136, 209, 0.2)',
                      },
                    }}
                  >
                    {vietnamProvinces.map((province) => (
                      <MenuItem key={province} value={province}>
                        {province}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    error={!!errors.address}
                    helperText={errors.address}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon
                            sx={{ color: 'rgba(100, 255, 218, 0.7)' }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    required
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

                <Grid2 size={{ xs: 12, md: 6 }}>
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

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
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
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                            sx={{
                              color: 'rgba(100, 255, 218, 0.7)',
                              '&:hover': {
                                backgroundColor: 'rgba(100, 255, 218, 0.05)',
                              },
                            }}
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    required
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
                  <Box
                    sx={{
                      mt: 1,
                      backgroundColor: 'rgba(1, 22, 39, 0.3)',
                      p: 2,
                      borderRadius: 1,
                      border: errors.agreeToTerms
                        ? '1px solid rgba(255, 82, 82, 0.5)'
                        : '1px solid rgba(100, 255, 218, 0.1)',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.agreeToTerms}
                          onChange={handleChange}
                          name="agreeToTerms"
                          color="primary"
                          sx={{
                            color: 'rgba(100, 255, 218, 0.5)',
                            '&.Mui-checked': {
                              color: 'primary.light',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2" color="text.primary">
                          I agree to the{' '}
                          <Link
                            component={RouterLink}
                            to="/terms"
                            sx={{
                              color: 'primary.light',
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            Terms and Conditions
                          </Link>{' '}
                          and{' '}
                          <Link
                            component={RouterLink}
                            to="/privacy"
                            sx={{
                              color: 'primary.light',
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            Privacy Policy
                          </Link>
                        </Typography>
                      }
                    />
                    {errors.agreeToTerms && (
                      <FormHelperText error sx={{ ml: 2 }}>
                        {errors.agreeToTerms}
                      </FormHelperText>
                    )}
                  </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      py: 1.5,
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
                    Register
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
                Already have an account?
              </Typography>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                color="primary"
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
                Sign In
              </Button>
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

export default RegisterPage;
