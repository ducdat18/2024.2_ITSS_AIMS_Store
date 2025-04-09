import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Grid2,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Switch,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Security as SecurityIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Email as EmailIcon,
  Smartphone as PhoneIcon,
  History as HistoryIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
import { mockAccountService } from '../../mock/mockDataAccount';

const AccountSecurityPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  
  // For notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  React.useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validatePasswordForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!passwords.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwords.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwords.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }

    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);

    try {
      // Mock API call to change password
      if (!currentUser) {
        throw new Error('User not found');
      }

      const success = await mockAccountService.changePassword(
        currentUser.id,
        passwords.currentPassword,
        passwords.newPassword
      );

      if (success) {
        setNotification({
          open: true,
          message: 'Password updated successfully!',
          severity: 'success',
        });
        
        // Reset form
        setPasswords({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setNotification({
          open: true,
          message: 'Current password is incorrect',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setNotification({
        open: true,
        message: 'Failed to update password. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  const toggleEmailNotifications = () => {
    setEmailNotifications(!emailNotifications);
  };

  const toggleSmsNotifications = () => {
    setSmsNotifications(!smsNotifications);
  };

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, feedback: '' };

    let strength = 0;
    let feedback = '';

    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;

    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    // Feedback based on strength
    if (strength <= 2) {
      feedback = 'Weak password';
    } else if (strength <= 4) {
      feedback = 'Moderate password';
    } else {
      feedback = 'Strong password';
    }

    return { strength: Math.min(strength, 6), feedback };
  };

  const passwordStrength = checkPasswordStrength(passwords.newPassword);
  const passwordStrengthColor = () => {
    const { strength } = passwordStrength;
    if (strength <= 2) return 'error.main';
    if (strength <= 4) return 'warning.main';
    return 'success.main';
  };

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
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
        }}
      >
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
            mb: 4,
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
          <SecurityIcon /> Security Settings
        </Typography>

        <Grid2 container spacing={4}>
          {/* Password Change Section */}
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                mb: 4,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                borderRadius: 2,
                border: '1px solid rgba(100, 255, 218, 0.1)',
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
                    'radial-gradient(circle at 50% 0%, rgba(2, 136, 209, 0.08) 0%, transparent 70%)',
                  opacity: 0.8,
                  zIndex: 1,
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 2 }}>
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
                  <LockIcon fontSize="small" />
                  Change Password
                </Typography>
                <Divider
                  sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                />

                <Grid2 container spacing={3}>
                  <Grid2 size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      name="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                      error={!!errors.currentPassword}
                      helperText={errors.currentPassword}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                              edge="end"
                            >
                              {showCurrentPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
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
                    <TextField
                      fullWidth
                      label="New Password"
                      name="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      error={!!errors.newPassword}
                      helperText={
                        errors.newPassword ||
                        (passwords.newPassword
                          ? passwordStrength.feedback
                          : '')
                      }
                      FormHelperTextProps={{
                        sx: {
                          color: passwords.newPassword
                            ? passwordStrengthColor()
                            : 'inherit',
                        },
                      }}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              edge="end"
                            >
                              {showNewPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
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
                    {passwords.newPassword && (
                      <Box sx={{ mt: 1, mb: 2 }}>
                        <Box
                          sx={{
                            width: '100%',
                            height: 4,
                            backgroundColor: 'rgba(100, 255, 218, 0.1)',
                            borderRadius: 2,
                            mt: 0.5,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${(passwordStrength.strength / 6) * 100}%`,
                              height: '100%',
                              backgroundColor: passwordStrengthColor(),
                              borderRadius: 2,
                              transition: 'width 0.3s',
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                  </Grid2>

                  <Grid2 size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
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
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Last password change: 30 days ago
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        onClick={handleUpdatePassword}
                        startIcon={
                          loading ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : null
                        }
                        sx={{
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
                        {loading ? 'Updating...' : 'Update Password'}
                      </Button>
                    </Box>
                  </Grid2>
                </Grid2>
              </Box>
            </Paper>

            {/* Password Requirements */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                borderRadius: 2,
                border: '1px solid rgba(100, 255, 218, 0.1)',
                mb: { xs: 4, md: 0 },
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: 'primary.light',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <InfoIcon fontSize="small" />
                Password Requirements
              </Typography>
              <Divider
                sx={{ mb: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
              />

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Minimum 8 characters" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="At least one uppercase letter (A-Z)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="At least one lowercase letter (a-z)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="At least one number (0-9)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="At least one special character (!@#$%^&*)" />
                </ListItem>
              </List>

              <Alert
                severity="info"
                sx={{
                  mt: 2,
                  backgroundColor: 'rgba(2, 136, 209, 0.1)',
                  border: '1px solid rgba(100, 255, 218, 0.2)',
                }}
              >
                For maximum security, use a unique password different from those
                you use on other sites.
              </Alert>
            </Paper>
          </Grid2>

          {/* Notification Settings */}
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Card
              elevation={3}
              sx={{
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                borderRadius: 2,
                border: '1px solid rgba(100, 255, 218, 0.1)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardContent>
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
                  <EmailIcon fontSize="small" />
                  Notification Settings
                </Typography>
                <Divider
                  sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                />

                <List>
                  <ListItem
                    secondaryAction={
                      <Switch
                        edge="end"
                        checked={emailNotifications}
                        onChange={toggleEmailNotifications}
                        color="primary"
                      />
                    }
                  >
                    <ListItemIcon>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email Notifications"
                      secondary="Receive order updates and promotions via email"
                    />
                  </ListItem>
                  <ListItem
                    secondaryAction={
                      <Switch
                        edge="end"
                        checked={smsNotifications}
                        onChange={toggleSmsNotifications}
                        color="primary"
                      />
                    }
                  >
                    <ListItemIcon>
                      <PhoneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="SMS Notifications"
                      secondary="Receive order updates via SMS"
                    />
                  </ListItem>
                </List>

                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: 'primary.light',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <HistoryIcon fontSize="small" />
                    Recent Activity
                  </Typography>
                  <Divider
                    sx={{ mb: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                  />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.primary">
                      Password Changed
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      April 1, 2025
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.primary">
                      Login from New Device
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      March 25, 2025
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.primary">
                      Email Updated
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      March 15, 2025
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AccountSecurityPage;