import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Grid2,
  Button,
  Divider,
  Card,
  CardContent,
  CardActions,
  Chip,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  ShoppingBag as ShoppingBagIcon,
  FavoriteBorder as FavoriteIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  CreditCard as PaymentIcon,
  Security as SecurityIcon,
  HistoryOutlined as HistoryIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
    } else {
      // Redirect to login if not logged in
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  // Mock data for account overview
  const accountData = {
    pendingOrders: 2,
    completedOrders: 5,
    wishlistItems: 8,
    savedAddresses: 3,
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
          Loading your account...
        </Typography>
      </Box>
    );
  }

  if (!currentUser) {
    return (
      <Container maxWidth="sm" sx={{ py: 5 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          You need to log in to view your account
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/login')}
          fullWidth
        >
          Go to Login
        </Button>
      </Container>
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
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Grid2 container spacing={4}>
          {/* Account Overview */}
          <Grid2 size={{ xs: 12 }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
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
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'flex-start' },
                gap: 3,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'info.main',
                    fontSize: '2.5rem',
                    mb: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  }}
                >
                  {currentUser.username.charAt(0).toUpperCase()}
                </Avatar>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                  sx={{
                    borderColor: 'rgba(100, 255, 218, 0.3)',
                    color: 'primary.light',
                    '&:hover': {
                      borderColor: 'rgba(100, 255, 218, 0.5)',
                      backgroundColor: 'rgba(100, 255, 218, 0.05)',
                    },
                  }}
                >
                  Edit Profile
                </Button>
              </Box>

              <Box sx={{ position: 'relative', zIndex: 2, flexGrow: 1 }}>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{ color: 'primary.light', fontWeight: 'bold' }}
                >
                  {currentUser.username}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {currentUser.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Account since{' '}
                  {new Date('2024-01-15').toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </Typography>

                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<ShoppingBagIcon />}
                    label={`${
                      accountData.pendingOrders + accountData.completedOrders
                    } Orders`}
                    color="primary"
                    variant="outlined"
                    onClick={() => navigate('/orders')}
                    sx={{
                      borderColor: 'rgba(100, 255, 218, 0.3)',
                      '&:hover': {
                        borderColor: 'rgba(100, 255, 218, 0.5)',
                        backgroundColor: 'rgba(100, 255, 218, 0.05)',
                      },
                    }}
                  />
                  <Chip
                    icon={<FavoriteIcon />}
                    label={`${accountData.wishlistItems} Wishlist Items`}
                    color="primary"
                    variant="outlined"
                    onClick={() => navigate('/wishlist')}
                    sx={{
                      borderColor: 'rgba(100, 255, 218, 0.3)',
                      '&:hover': {
                        borderColor: 'rgba(100, 255, 218, 0.5)',
                        backgroundColor: 'rgba(100, 255, 218, 0.05)',
                      },
                    }}
                  />
                  <Chip
                    icon={<LocationIcon />}
                    label={`${accountData.savedAddresses} Addresses`}
                    color="primary"
                    variant="outlined"
                    onClick={() => navigate('/account/addresses')}
                    sx={{
                      borderColor: 'rgba(100, 255, 218, 0.3)',
                      '&:hover': {
                        borderColor: 'rgba(100, 255, 218, 0.5)',
                        backgroundColor: 'rgba(100, 255, 218, 0.05)',
                      },
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid2>

          {/* Account Quick Links */}
          <Grid2 size={{ xs: 12 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{
                color: 'primary.light',
                fontWeight: 'bold',
                position: 'relative',
                mb: 3,
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
              Manage Your Account
            </Typography>
          </Grid2>

          {/* Account Management Cards */}
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.5)',
                },
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'rgba(2, 136, 209, 0.1)',
                    color: 'primary.light',
                    width: 60,
                    height: 60,
                    mb: 2,
                  }}
                >
                  <PersonIcon fontSize="large" />
                </Avatar>
                <Typography
                  variant="h6"
                  component="h3"
                  color="primary.light"
                  gutterBottom
                >
                  Profile Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Update your personal information and preferences
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={() => navigate('/account/profile')}
                  sx={{
                    borderColor: 'rgba(100, 255, 218, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(100, 255, 218, 0.5)',
                      backgroundColor: 'rgba(100, 255, 218, 0.05)',
                    },
                  }}
                >
                  Manage
                </Button>
              </CardActions>
            </Card>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.5)',
                },
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'rgba(0, 191, 165, 0.1)',
                    color: 'success.light',
                    width: 60,
                    height: 60,
                    mb: 2,
                  }}
                >
                  <HistoryIcon fontSize="large" />
                </Avatar>
                <Typography
                  variant="h6"
                  component="h3"
                  color="primary.light"
                  gutterBottom
                >
                  Order History
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and track your previous orders
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={() => navigate('/orders')}
                  sx={{
                    borderColor: 'rgba(100, 255, 218, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(100, 255, 218, 0.5)',
                      backgroundColor: 'rgba(100, 255, 218, 0.05)',
                    },
                  }}
                >
                  View Orders
                </Button>
              </CardActions>
            </Card>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.5)',
                },
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'rgba(255, 152, 0, 0.1)',
                    color: 'warning.light',
                    width: 60,
                    height: 60,
                    mb: 2,
                  }}
                >
                  <LocationIcon fontSize="large" />
                </Avatar>
                <Typography
                  variant="h6"
                  component="h3"
                  color="primary.light"
                  gutterBottom
                >
                  Addresses
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your delivery addresses
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={() => navigate('/account/addresses')}
                  sx={{
                    borderColor: 'rgba(100, 255, 218, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(100, 255, 218, 0.5)',
                      backgroundColor: 'rgba(100, 255, 218, 0.05)',
                    },
                  }}
                >
                  Manage
                </Button>
              </CardActions>
            </Card>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.5)',
                },
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'rgba(255, 82, 82, 0.1)',
                    color: 'error.light',
                    width: 60,
                    height: 60,
                    mb: 2,
                  }}
                >
                  <SecurityIcon fontSize="large" />
                </Avatar>
                <Typography
                  variant="h6"
                  component="h3"
                  color="primary.light"
                  gutterBottom
                >
                  Security
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Update password and security settings
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={() => navigate('/account/security')}
                  sx={{
                    borderColor: 'rgba(100, 255, 218, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(100, 255, 218, 0.5)',
                      backgroundColor: 'rgba(100, 255, 218, 0.05)',
                    },
                  }}
                >
                  Manage
                </Button>
              </CardActions>
            </Card>
          </Grid2>

          {/* Recent Orders */}
          <Grid2 size={{ xs: 12 }}>
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                  color: 'primary.light',
                  fontWeight: 'bold',
                  position: 'relative',
                  mb: 3,
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
                Recent Orders
              </Typography>

              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  backgroundImage:
                    'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                  borderRadius: 2,
                  border: '1px solid rgba(100, 255, 218, 0.1)',
                }}
              >
                {/* Mock recent orders */}
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    border: '1px solid rgba(100, 255, 218, 0.1)',
                    borderRadius: 1,
                  }}
                >
                  <Grid2 container spacing={2} alignItems="center">
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle1" color="primary.light">
                        Order #ORD-12345
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Placed on April 5, 2025
                      </Typography>
                      <Chip
                        label="Processing"
                        size="small"
                        color="warning"
                        sx={{ mt: 1 }}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Items: 3
                      </Typography>
                      <Typography variant="subtitle2" color="primary.light">
                        Total: 650,000 VND
                      </Typography>
                    </Grid2>
                    <Grid2
                      size={{ xs: 12, sm: 3 }}
                      sx={{ textAlign: { xs: 'left', sm: 'right' } }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate('/orders/ORD-12345')}
                        sx={{
                          borderColor: 'rgba(100, 255, 218, 0.3)',
                          '&:hover': {
                            borderColor: 'rgba(100, 255, 218, 0.5)',
                            backgroundColor: 'rgba(100, 255, 218, 0.05)',
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </Grid2>
                  </Grid2>
                </Box>

                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    border: '1px solid rgba(100, 255, 218, 0.1)',
                    borderRadius: 1,
                  }}
                >
                  <Grid2 container spacing={2} alignItems="center">
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle1" color="primary.light">
                        Order #ORD-12344
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Placed on March 28, 2025
                      </Typography>
                      <Chip
                        label="Delivered"
                        size="small"
                        color="success"
                        sx={{ mt: 1 }}
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Items: 2
                      </Typography>
                      <Typography variant="subtitle2" color="primary.light">
                        Total: 320,000 VND
                      </Typography>
                    </Grid2>
                    <Grid2
                      size={{ xs: 12, sm: 3 }}
                      sx={{ textAlign: { xs: 'left', sm: 'right' } }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate('/orders/ORD-12344')}
                        sx={{
                          borderColor: 'rgba(100, 255, 218, 0.3)',
                          '&:hover': {
                            borderColor: 'rgba(100, 255, 218, 0.5)',
                            backgroundColor: 'rgba(100, 255, 218, 0.05)',
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </Grid2>
                  </Grid2>
                </Box>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/orders')}
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
                    View All Orders
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default AccountPage;
