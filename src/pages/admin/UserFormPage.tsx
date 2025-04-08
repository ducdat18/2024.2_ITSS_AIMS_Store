// src/pages/admin/UserFormPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  CircularProgress,
  FormHelperText,
  Grid2,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Cancel as CancelIcon,
  AdminPanelSettings as AdminIcon,
  ShoppingBag as ProductManagerIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { UserAccount, UserRole } from '../../types';
import { mockAccountService } from '../../mock/mockDataAccount';

// Form data interface
interface UserFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  roles: UserRole[];
  isBlocked: boolean;
}

// Form errors interface
interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  roles?: string;
  general?: string;
}

const UserFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Form state
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    roles: [],
    isBlocked: false,
  });

  // Other state
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(isEditMode);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch user data for edit mode
  useEffect(() => {
    const fetchUserData = async () => {
      if (isEditMode && id) {
        try {
          setLoading(true);
          const userData = await mockAccountService.getAccountById(id);

          if (!userData) {
            setErrorMessage('User not found');
            setLoading(false);
            return;
          }

          setFormData({
            username: userData.username,
            email: userData.email,
            password: '', // Don't show password in edit mode
            confirmPassword: '', // Don't show password in edit mode
            roles: userData.roles,
            isBlocked: userData.isBlocked,
          });

          setLoading(false);
        } catch (err) {
          console.error('Error fetching user data:', err);
          setErrorMessage('Failed to load user data. Please try again later.');
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [id, isEditMode]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when field is changed
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }

    setFormTouched(true);
  };

  // Handle role checkbox change
  const handleRoleChange = (role: UserRole) => {
    setFormData((prev) => {
      const newRoles = prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role];

      return {
        ...prev,
        roles: newRoles,
      };
    });

    // Clear roles error if present
    if (errors.roles) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.roles;
        return newErrors;
      });
    }

    setFormTouched(true);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Validate password (only required in create mode)
    if (!isEditMode) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      // Validate confirm password
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (formData.password || formData.confirmPassword) {
      // In edit mode, password is optional, but if provided, validate it
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    // Validate roles
    if (formData.roles.length === 0) {
      newErrors.roles = 'At least one role must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      // Create or update user
      if (isEditMode && id) {
        // Prepare update data (exclude confirmPassword)
        const updateData: Partial<UserAccount> = {
          username: formData.username,
          email: formData.email,
          roles: formData.roles,
          isBlocked: formData.isBlocked,
        };

        // Only include password if it was provided
        if (formData.password) {
          updateData.password = formData.password;
        }

        // Call the update API
        const updatedUser = await mockAccountService.updateAccount(
          id,
          updateData
        );

        if (updatedUser) {
          setSuccessMessage('User updated successfully');
          setTimeout(() => {
            navigate(`/admin/users/${id}`);
          }, 2000);
        } else {
          setErrorMessage('Failed to update user. User not found.');
        }
      } else {
        // Create new user
        // We need to provide userId for mock data
        const newUserId = `user-${Date.now().toString().substring(8, 13)}`;

        const newUser = await mockAccountService.createAccount({
          userId: newUserId,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          roles: formData.roles,
          isBlocked: formData.isBlocked,
          lastLogin: undefined,
        });

        setSuccessMessage('User created successfully');
        setTimeout(() => {
          navigate(`/admin/users/${newUser.id}`);
        }, 2000);
      }

      setSubmitLoading(false);
      setFormTouched(false);
    } catch (err) {
      console.error('Error saving user:', err);
      setErrorMessage('Error saving user. Please try again.');
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: 5,
          textAlign: 'center',
          height: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <WavesIcon
          sx={{
            fontSize: 60,
            color: 'primary.light',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(0.95)',
                opacity: 0.7,
              },
              '70%': {
                transform: 'scale(1.1)',
                opacity: 1,
              },
              '100%': {
                transform: 'scale(0.95)',
                opacity: 0.7,
              },
            },
          }}
        />
        <Typography
          variant="h5"
          sx={{
            color: 'text.secondary',
            fontWeight: 'medium',
          }}
        >
          {isEditMode ? 'Loading user data...' : 'Preparing form...'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 4, md: 5 },
        position: 'relative',
        overflow: 'hidden',
        minHeight: '70vh',
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
      <Container
        maxWidth="md"
        sx={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Page title */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
            sx={{
              mr: 2,
              borderColor: 'rgba(100, 255, 218, 0.3)',
              '&:hover': {
                borderColor: 'rgba(100, 255, 218, 0.5)',
                backgroundColor: 'rgba(100, 255, 218, 0.05)',
              },
            }}
          >
            Back
          </Button>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: 60,
                height: 3,
                background:
                  'linear-gradient(90deg, rgba(100, 255, 218, 0.7), rgba(100, 255, 218, 0.1))',
                borderRadius: 2,
              },
            }}
          >
            <PersonIcon /> {isEditMode ? 'Edit User' : 'Add New User'}
          </Typography>
        </Box>

        {/* Success/error messages */}
        {successMessage && (
          <Alert
            severity="success"
            onClose={() => setSuccessMessage(null)}
            sx={{
              mb: 3,
              backgroundColor: 'rgba(0, 191, 165, 0.1)',
              border: '1px solid rgba(0, 191, 165, 0.3)',
            }}
          >
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert
            severity="error"
            onClose={() => setErrorMessage(null)}
            sx={{
              mb: 3,
              backgroundColor: 'rgba(255, 82, 82, 0.1)',
              border: '1px solid rgba(255, 82, 82, 0.3)',
            }}
          >
            {errorMessage}
          </Alert>
        )}

        {/* User form */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            border: '1px solid rgba(100, 255, 218, 0.1)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                'radial-gradient(circle at 30% 20%, rgba(2, 136, 209, 0.08) 0%, transparent 70%)',
              opacity: 0.6,
              zIndex: 1,
            },
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: { xs: 3, md: 4 },
              position: 'relative',
              zIndex: 2,
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: 'primary.light',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              User Information
            </Typography>
            <Divider sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

            {/* User Information Fields */}
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon
                          sx={{ color: 'rgba(100, 255, 218, 0.7)' }}
                        />
                      </InputAdornment>
                    ),
                  }}
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

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'rgba(100, 255, 218, 0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
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

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={
                    isEditMode
                      ? 'New Password (leave blank to keep current)'
                      : 'Password'
                  }
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  required={!isEditMode}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'rgba(100, 255, 218, 0.7)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          sx={{
                            color: 'rgba(100, 255, 218, 0.7)',
                            '&:hover': {
                              backgroundColor: 'rgba(100, 255, 218, 0.05)',
                            },
                          }}
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  required={!isEditMode || formData.password.length > 0}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'rgba(100, 255, 218, 0.7)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleConfirmPasswordVisibility}
                          edge="end"
                          sx={{
                            color: 'rgba(100, 255, 218, 0.7)',
                            '&:hover': {
                              backgroundColor: 'rgba(100, 255, 218, 0.05)',
                            },
                          }}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
                <Divider
                  sx={{ my: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                />

                <FormControl component="fieldset" error={!!errors.roles}>
                  <FormLabel
                    component="legend"
                    sx={{
                      color: 'text.primary',
                      '&.Mui-focused': {
                        color: 'primary.light',
                      },
                    }}
                  >
                    User Roles (select at least one)
                  </FormLabel>
                  <FormGroup
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      mt: 1,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.roles.includes(UserRole.ADMIN)}
                          onChange={() => handleRoleChange(UserRole.ADMIN)}
                          sx={{
                            color: 'rgba(100, 255, 218, 0.5)',
                            '&.Mui-checked': {
                              color: 'success.light',
                            },
                          }}
                          icon={
                            <AdminIcon
                              sx={{ color: 'rgba(0, 191, 165, 0.5)' }}
                            />
                          }
                          checkedIcon={<AdminIcon />}
                        />
                      }
                      label="Administrator"
                      sx={{
                        mr: 4,
                        '& .MuiFormControlLabel-label': {
                          color: formData.roles.includes(UserRole.ADMIN)
                            ? 'success.light'
                            : 'text.secondary',
                        },
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.roles.includes(
                            UserRole.PRODUCT_MANAGER
                          )}
                          onChange={() =>
                            handleRoleChange(UserRole.PRODUCT_MANAGER)
                          }
                          sx={{
                            color: 'rgba(100, 255, 218, 0.5)',
                            '&.Mui-checked': {
                              color: 'warning.light',
                            },
                          }}
                          icon={
                            <ProductManagerIcon
                              sx={{ color: 'rgba(255, 152, 0, 0.5)' }}
                            />
                          }
                          checkedIcon={<ProductManagerIcon />}
                        />
                      }
                      label="Product Manager"
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          color: formData.roles.includes(
                            UserRole.PRODUCT_MANAGER
                          )
                            ? 'warning.light'
                            : 'text.secondary',
                        },
                      }}
                    />
                  </FormGroup>
                  {errors.roles && (
                    <FormHelperText error>{errors.roles}</FormHelperText>
                  )}
                </FormControl>
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <Divider
                  sx={{ my: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isBlocked}
                      onChange={handleInputChange}
                      name="isBlocked"
                      sx={{
                        color: 'rgba(255, 82, 82, 0.5)',
                        '&.Mui-checked': {
                          color: 'error.light',
                        },
                      }}
                    />
                  }
                  label="Block User"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      color: formData.isBlocked
                        ? 'error.light'
                        : 'text.secondary',
                    },
                  }}
                />
                {formData.isBlocked && (
                  <Typography
                    variant="caption"
                    color="error.light"
                    sx={{ display: 'block', mt: 0.5 }}
                  >
                    Blocked users cannot access the system until unblocked.
                  </Typography>
                )}
              </Grid2>
            </Grid2>

            {/* Form buttons */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 4,
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={() => navigate(-1)}
                startIcon={<CancelIcon />}
                disabled={submitLoading}
                sx={{
                  borderColor: 'rgba(255, 82, 82, 0.3)',
                  '&:hover': {
                    borderColor: 'rgba(255, 82, 82, 0.5)',
                    backgroundColor: 'rgba(255, 82, 82, 0.05)',
                  },
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={
                  submitLoading ? <CircularProgress size={20} /> : <SaveIcon />
                }
                disabled={submitLoading || (!formTouched && isEditMode)}
                sx={{
                  px: 3,
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
                {submitLoading
                  ? 'Saving...'
                  : isEditMode
                  ? 'Save Changes'
                  : 'Create User'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default UserFormPage;
