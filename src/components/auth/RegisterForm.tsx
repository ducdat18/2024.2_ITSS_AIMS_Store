// src/components/auth/RegisterForm.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Grid2,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Link,
  Typography,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FormField } from './FormField';
import { PasswordField } from './PasswordField';
import { FormAlert } from './FormAlert';
import { AuthHeader } from './AuthHeader';
import { AuthDivider } from './AuthDivider';
import { FormContainer } from './FormContainer';

// Vietnamese provinces array
const vietnamProvinces = [
  'Hanoi',
  'Ho Chi Minh City',
  'Da Nang',
  'Hai Phong',
  'Can Tho',
];

export const RegisterForm: React.FC = () => {
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
    <FormContainer>
      <AuthHeader
        title="Create an Account"
        subtitle="Join our deep ocean of media products"
      />

      {registrationStatus && (
        <FormAlert
          severity={registrationStatus.success ? 'success' : 'error'}
          icon={registrationStatus.success ? <CheckIcon /> : undefined}
        >
          {registrationStatus.message}
        </FormAlert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12 }}>
            <FormField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
              icon={<PersonIcon sx={{ color: 'rgba(100, 255, 218, 0.7)' }} />}
              required
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              icon={<EmailIcon sx={{ color: 'rgba(100, 255, 218, 0.7)' }} />}
              required
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <FormField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              icon={<PhoneIcon sx={{ color: 'rgba(100, 255, 218, 0.7)' }} />}
              required
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <FormField
              select
              label="Province/City"
              name="province"
              value={formData.province}
              onChange={handleChange}
              error={!!errors.province}
              helperText={errors.province}
              icon={<LocationIcon sx={{ color: 'rgba(100, 255, 218, 0.7)' }} />}
              required
              sx={{
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
            </FormField>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <FormField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
              icon={<LocationIcon sx={{ color: 'rgba(100, 255, 218, 0.7)' }} />}
              required
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <PasswordField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              required
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              required
            />
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

      <AuthDivider />

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
    </FormContainer>
  );
};
