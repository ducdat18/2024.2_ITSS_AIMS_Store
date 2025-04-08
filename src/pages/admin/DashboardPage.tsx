// src/pages/admin/AdminDashboardPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  People as PeopleIcon,
  Person as PersonIcon,
  Block as BlockIcon,
  AdminPanelSettings as AdminIcon,
  ShoppingBag as ProductManagerIcon,
  PersonAdd as PersonAddIcon,
  Refresh as RefreshIcon,
  SupervisorAccount as SupervisorIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
import { mockAccountService } from '../../mock/mockDataAccount';
import { UserAccount, UserRole } from '../../types';

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    admins: 0,
    productManagers: 0,
    blockedUsers: 0,
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const data = await mockAccountService.getAccounts();
        setAccounts(data);

        // Calculate stats
        const totalUsers = data.length;
        const admins = data.filter((acc) =>
          acc.roles.includes(UserRole.ADMIN)
        ).length;
        const productManagers = data.filter((acc) =>
          acc.roles.includes(UserRole.PRODUCT_MANAGER)
        ).length;
        const blockedUsers = data.filter((acc) => acc.isBlocked).length;

        setStats({
          totalUsers,
          admins,
          productManagers,
          blockedUsers,
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError('Failed to load user accounts. Please try again later.');
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const refreshData = () => {
    setLoading(true);
    mockAccountService
      .getAccounts()
      .then((data) => {
        setAccounts(data);

        // Recalculate stats
        const totalUsers = data.length;
        const admins = data.filter((acc) =>
          acc.roles.includes(UserRole.ADMIN)
        ).length;
        const productManagers = data.filter((acc) =>
          acc.roles.includes(UserRole.PRODUCT_MANAGER)
        ).length;
        const blockedUsers = data.filter((acc) => acc.isBlocked).length;

        setStats({
          totalUsers,
          admins,
          productManagers,
          blockedUsers,
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error('Error refreshing accounts:', err);
        setError('Failed to refresh user accounts. Please try again later.');
        setLoading(false);
      });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && accounts.length === 0) {
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
          Loading admin dashboard...
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
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
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
            <AdminIcon /> Admin Dashboard
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={refreshData}
              startIcon={<RefreshIcon />}
              disabled={loading}
              sx={{
                borderColor: 'rgba(100, 255, 218, 0.3)',
                '&:hover': {
                  borderColor: 'rgba(100, 255, 218, 0.5)',
                  backgroundColor: 'rgba(100, 255, 218, 0.05)',
                },
              }}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/admin/users/add')}
              startIcon={<PersonAddIcon />}
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
              Add New User
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              backgroundColor: 'rgba(255, 82, 82, 0.1)',
              border: '1px solid rgba(255, 82, 82, 0.3)',
            }}
          >
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid2 container spacing={3} sx={{ mb: 4 }}>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage:
                    'radial-gradient(circle at 30% 30%, rgba(2, 136, 209, 0.1) 0%, transparent 70%)',
                  zIndex: 1,
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(100, 255, 218, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <PeopleIcon sx={{ color: 'primary.light', fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      color="primary.light"
                      fontWeight="bold"
                    >
                      {stats.totalUsers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Users
                    </Typography>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => navigate('/admin/users')}
                  sx={{
                    mt: 1,
                    borderColor: 'rgba(100, 255, 218, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(100, 255, 218, 0.5)',
                      backgroundColor: 'rgba(100, 255, 218, 0.05)',
                    },
                  }}
                >
                  View All
                </Button>
              </Box>
            </Paper>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage:
                    'radial-gradient(circle at 30% 30%, rgba(0, 191, 165, 0.1) 0%, transparent 70%)',
                  zIndex: 1,
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 191, 165, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <SupervisorIcon
                      sx={{ color: 'success.light', fontSize: 28 }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      color="success.light"
                      fontWeight="bold"
                    >
                      {stats.admins}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Administrators
                    </Typography>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  color="success"
                  size="small"
                  onClick={() => navigate('/admin/users?role=ADMIN')}
                  sx={{
                    mt: 1,
                    borderColor: 'rgba(0, 191, 165, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(0, 191, 165, 0.5)',
                      backgroundColor: 'rgba(0, 191, 165, 0.05)',
                    },
                  }}
                >
                  View Admins
                </Button>
              </Box>
            </Paper>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage:
                    'radial-gradient(circle at 30% 30%, rgba(255, 152, 0, 0.1) 0%, transparent 70%)',
                  zIndex: 1,
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 152, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <ProductManagerIcon
                      sx={{ color: 'warning.light', fontSize: 28 }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      color="warning.light"
                      fontWeight="bold"
                    >
                      {stats.productManagers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Product Managers
                    </Typography>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  color="warning"
                  size="small"
                  onClick={() => navigate('/admin/users?role=PRODUCT_MANAGER')}
                  sx={{
                    mt: 1,
                    borderColor: 'rgba(255, 152, 0, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(255, 152, 0, 0.5)',
                      backgroundColor: 'rgba(255, 152, 0, 0.05)',
                    },
                  }}
                >
                  View Managers
                </Button>
              </Box>
            </Paper>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage:
                    'radial-gradient(circle at 30% 30%, rgba(255, 82, 82, 0.1) 0%, transparent 70%)',
                  zIndex: 1,
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 82, 82, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <BlockIcon sx={{ color: 'error.light', fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      color="error.light"
                      fontWeight="bold"
                    >
                      {stats.blockedUsers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Blocked Users
                    </Typography>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => navigate('/admin/users?status=blocked')}
                  sx={{
                    mt: 1,
                    borderColor: 'rgba(255, 82, 82, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(255, 82, 82, 0.5)',
                      backgroundColor: 'rgba(255, 82, 82, 0.05)',
                    },
                  }}
                >
                  View Blocked
                </Button>
              </Box>
            </Paper>
          </Grid2>
        </Grid2>

        {/* Recent Users */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 'bold',
              color: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <PersonIcon /> Recent Users
          </Typography>

          <Grid2 container spacing={3}>
            {accounts.slice(0, 6).map((account) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={account.id}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 2,
                    backgroundImage:
                      'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                    border: account.isBlocked
                      ? '1px solid rgba(255, 82, 82, 0.2)'
                      : '1px solid rgba(100, 255, 218, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: account.isBlocked
                        ? 'radial-gradient(circle at 30% 30%, rgba(255, 82, 82, 0.05) 0%, transparent 70%)'
                        : 'radial-gradient(circle at 30% 30%, rgba(2, 136, 209, 0.05) 0%, transparent 70%)',
                      zIndex: 1,
                    },
                  }}
                >
                  <CardContent sx={{ position: 'relative', zIndex: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: account.isBlocked
                            ? 'error.light'
                            : 'primary.light',
                          fontWeight: 'bold',
                        }}
                      >
                        {account.username}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {account.roles.includes(UserRole.ADMIN) && (
                          <Box
                            sx={{
                              backgroundColor: 'rgba(0, 191, 165, 0.1)',
                              color: 'success.light',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                            }}
                          >
                            ADMIN
                          </Box>
                        )}
                        {account.roles.includes(UserRole.PRODUCT_MANAGER) && (
                          <Box
                            sx={{
                              backgroundColor: 'rgba(255, 152, 0, 0.1)',
                              color: 'warning.light',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                            }}
                          >
                            PM
                          </Box>
                        )}
                        {account.isBlocked && (
                          <Box
                            sx={{
                              backgroundColor: 'rgba(255, 82, 82, 0.1)',
                              color: 'error.light',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <BlockIcon fontSize="small" /> BLOCKED
                          </Box>
                        )}
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {account.email}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      component="div"
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 2,
                      }}
                    >
                      <span>Created: {formatDate(account.createdAt)}</span>
                      {account.lastLogin && (
                        <span>Last login: {formatDate(account.lastLogin)}</span>
                      )}
                    </Typography>
                  </CardContent>

                  <Divider sx={{ borderColor: 'rgba(100, 255, 218, 0.1)' }} />

                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate(`/admin/users/${account.id}`)}
                      sx={{
                        color: 'primary.light',
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      onClick={() =>
                        navigate(`/admin/users/${account.id}/edit`)
                      }
                      sx={{
                        color: 'primary.light',
                      }}
                    >
                      Edit
                    </Button>
                    {account.isBlocked ? (
                      <Button
                        size="small"
                        color="success"
                        sx={{
                          ml: 'auto',
                        }}
                      >
                        Unblock
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        color="error"
                        sx={{
                          ml: 'auto',
                        }}
                      >
                        Block
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid2>
            ))}
          </Grid2>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/admin/users')}
              sx={{
                px: 4,
                py: 1,
                borderColor: 'rgba(100, 255, 218, 0.3)',
                '&:hover': {
                  borderColor: 'rgba(100, 255, 218, 0.5)',
                  backgroundColor: 'rgba(100, 255, 218, 0.05)',
                },
              }}
            >
              View All Users
            </Button>
          </Box>
        </Box>

        {/* Quick Links */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 'bold',
              color: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <WavesIcon /> Admin Actions
          </Typography>

          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundImage:
                    'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                  border: '1px solid rgba(100, 255, 218, 0.1)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage:
                      'radial-gradient(circle at 50% 50%, rgba(2, 136, 209, 0.1) 0%, transparent 70%)',
                    zIndex: 1,
                  },
                }}
                onClick={() => navigate('/admin/users/add')}
              >
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <PersonAddIcon
                    sx={{
                      fontSize: 48,
                      color: 'primary.light',
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" color="primary.light" gutterBottom>
                    Add New User
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create a new user account
                  </Typography>
                </Box>
              </Paper>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundImage:
                    'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                  border: '1px solid rgba(100, 255, 218, 0.1)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage:
                      'radial-gradient(circle at 50% 50%, rgba(0, 191, 165, 0.1) 0%, transparent 70%)',
                    zIndex: 1,
                  },
                }}
                onClick={() => navigate('/admin/users?role=ADMIN')}
              >
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <AdminIcon
                    sx={{
                      fontSize: 48,
                      color: 'success.light',
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" color="success.light" gutterBottom>
                    Manage Admins
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View and manage admin users
                  </Typography>
                </Box>
              </Paper>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundImage:
                    'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                  border: '1px solid rgba(100, 255, 218, 0.1)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage:
                      'radial-gradient(circle at 50% 50%, rgba(255, 152, 0, 0.1) 0%, transparent 70%)',
                    zIndex: 1,
                  },
                }}
                onClick={() => navigate('/admin/users?role=PRODUCT_MANAGER')}
              >
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <ProductManagerIcon
                    sx={{
                      fontSize: 48,
                      color: 'warning.light',
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" color="warning.light" gutterBottom>
                    Manage Product Managers
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View and manage product managers
                  </Typography>
                </Box>
              </Paper>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundImage:
                    'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                  border: '1px solid rgba(100, 255, 218, 0.1)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage:
                      'radial-gradient(circle at 50% 50%, rgba(255, 82, 82, 0.1) 0%, transparent 70%)',
                    zIndex: 1,
                  },
                }}
                onClick={() => navigate('/admin/users?status=blocked')}
              >
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <BlockIcon
                    sx={{
                      fontSize: 48,
                      color: 'error.light',
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" color="error.light" gutterBottom>
                    Blocked Users
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage blocked user accounts
                  </Typography>
                </Box>
              </Paper>
            </Grid2>
          </Grid2>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboardPage;
