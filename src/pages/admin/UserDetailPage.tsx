// src/pages/admin/UserDetailPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2,
  Paper,
  Button,
  Chip,
  Divider,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarTodayIcon,
  Block as BlockIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  LockReset as ResetPasswordIcon,
  AdminPanelSettings as AdminIcon,
  ShoppingBag as ProductManagerIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { UserAccount } from '../../types';
import { mockAccountService } from '../../mock/mockDataAccount';

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [account, setAccount] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [unblockDialogOpen, setUnblockDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [resetPasswordResult, setResetPasswordResult] = useState<string | null>(
    null
  );

  // Fetch user details
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setLoading(true);
        if (!id) {
          setError('User ID is missing');
          setLoading(false);
          return;
        }

        const data = await mockAccountService.getAccountById(id);
        if (!data) {
          setError('User not found');
          setLoading(false);
          return;
        }

        setAccount(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details. Please try again later.');
        setLoading(false);
      }
    };

    fetchAccount();
  }, [id]);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Execute actions (delete, block, unblock, reset password)
  const executeAction = async (
    action: 'delete' | 'block' | 'unblock' | 'reset'
  ) => {
    if (!account) return;

    try {
      setLoading(true);

      switch (action) {
        case 'delete':
          await mockAccountService.deleteAccount(account.id);
          setActionResult({
            type: 'success',
            message: `User ${account.username} has been deleted.`,
          });
          setTimeout(() => {
            navigate('/admin/users');
          }, 2000);
          break;

        case 'block':
          const blockedAccount = await mockAccountService.blockAccount(
            account.id
          );
          if (blockedAccount) {
            setAccount({ ...account, isBlocked: true });
            setActionResult({
              type: 'success',
              message: `User ${account.username} has been blocked.`,
            });
          }
          break;

        case 'unblock':
          const unblockedAccount = await mockAccountService.unblockAccount(
            account.id
          );
          if (unblockedAccount) {
            setAccount({ ...account, isBlocked: false });
            setActionResult({
              type: 'success',
              message: `User ${account.username} has been unblocked.`,
            });
          }
          break;

        case 'reset':
          const newPassword = await mockAccountService.resetPassword(
            account.id
          );
          setResetPasswordResult(newPassword);
          break;
      }
    } catch (err) {
      console.error(`Error during ${action} action:`, err);
      setActionResult({
        type: 'error',
        message: `Failed to ${action} user. Please try again.`,
      });
    } finally {
      setLoading(false);

      // Close dialogs
      setDeleteDialogOpen(false);
      setBlockDialogOpen(false);
      setUnblockDialogOpen(false);
      setResetPasswordDialogOpen(false);
    }
  };

  if (loading && !account) {
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
          Loading user details...
        </Typography>
      </Box>
    );
  }

  if (error || !account) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert
          severity="error"
          sx={{
            mb: 3,
            backgroundColor: 'rgba(255, 82, 82, 0.1)',
            border: '1px solid rgba(255, 82, 82, 0.3)',
          }}
        >
          {error || 'User not found'}
        </Alert>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/admin/users')}
          startIcon={<ArrowBackIcon />}
          sx={{
            borderColor: 'rgba(100, 255, 218, 0.3)',
            '&:hover': {
              borderColor: 'rgba(100, 255, 218, 0.5)',
              backgroundColor: 'rgba(100, 255, 218, 0.05)',
            },
          }}
        >
          Back to Users
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
        {/* Back button and page title */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/admin/users')}
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
            <PersonIcon /> User Details
          </Typography>
        </Box>

        {actionResult && (
          <Alert
            severity={actionResult.type}
            onClose={() => setActionResult(null)}
            sx={{
              mb: 3,
              backgroundColor:
                actionResult.type === 'success'
                  ? 'rgba(0, 191, 165, 0.1)'
                  : 'rgba(255, 82, 82, 0.1)',
              border: `1px solid ${
                actionResult.type === 'success'
                  ? 'rgba(0, 191, 165, 0.3)'
                  : 'rgba(255, 82, 82, 0.3)'
              }`,
            }}
          >
            {actionResult.message}
          </Alert>
        )}

        {/* User details card */}
        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: account.isBlocked
                  ? '1px solid rgba(255, 82, 82, 0.2)'
                  : '1px solid rgba(100, 255, 218, 0.1)',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: account.isBlocked
                    ? 'radial-gradient(circle at 50% 20%, rgba(255, 82, 82, 0.1) 0%, transparent 70%)'
                    : 'radial-gradient(circle at 50% 20%, rgba(2, 136, 209, 0.1) 0%, transparent 70%)',
                  opacity: 0.8,
                  zIndex: 1,
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    backgroundColor: account.isBlocked
                      ? 'rgba(255, 82, 82, 0.1)'
                      : 'rgba(2, 136, 209, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    mx: 'auto',
                    border: account.isBlocked
                      ? '2px solid rgba(255, 82, 82, 0.2)'
                      : '2px solid rgba(100, 255, 218, 0.2)',
                  }}
                >
                  <PersonIcon
                    sx={{
                      fontSize: 50,
                      color: account.isBlocked
                        ? 'error.light'
                        : 'primary.light',
                    }}
                  />
                </Box>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    color: account.isBlocked ? 'error.light' : 'primary.light',
                    mb: 0.5,
                  }}
                >
                  {account.username}
                </Typography>

                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {account.email}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                    my: 2,
                  }}
                >
                  {account.roles.map((role) => (
                    <Chip
                      key={role}
                      label={role}
                      size="small"
                      icon={
                        role === 'ADMIN' ? (
                          <AdminIcon fontSize="small" />
                        ) : (
                          <ProductManagerIcon fontSize="small" />
                        )
                      }
                      sx={{
                        backgroundColor:
                          role === 'ADMIN'
                            ? 'rgba(0, 191, 165, 0.1)'
                            : 'rgba(255, 152, 0, 0.1)',
                        color:
                          role === 'ADMIN' ? 'success.light' : 'warning.light',
                        borderColor:
                          role === 'ADMIN'
                            ? 'rgba(0, 191, 165, 0.3)'
                            : 'rgba(255, 152, 0, 0.3)',
                      }}
                    />
                  ))}
                </Box>

                <Box sx={{ my: 2 }}>
                  <Chip
                    label={account.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                    size="small"
                    icon={
                      account.isBlocked ? (
                        <BlockIcon fontSize="small" />
                      ) : undefined
                    }
                    sx={{
                      backgroundColor: account.isBlocked
                        ? 'rgba(255, 82, 82, 0.1)'
                        : 'rgba(0, 191, 165, 0.1)',
                      color: account.isBlocked
                        ? 'error.light'
                        : 'success.light',
                      borderColor: account.isBlocked
                        ? 'rgba(255, 82, 82, 0.3)'
                        : 'rgba(0, 191, 165, 0.3)',
                    }}
                  />
                </Box>

                <Divider
                  sx={{ my: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                />

                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Account ID
                  </Typography>
                  <Typography variant="body2" color="text.primary" gutterBottom>
                    {account.id}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                    gutterBottom
                  >
                    User ID
                  </Typography>
                  <Typography variant="body2" color="text.primary" gutterBottom>
                    {account.userId}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                    gutterBottom
                  >
                    Created At
                  </Typography>
                  <Typography variant="body2" color="text.primary" gutterBottom>
                    {formatDate(account.createdAt)}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                    gutterBottom
                  >
                    Last Updated
                  </Typography>
                  <Typography variant="body2" color="text.primary" gutterBottom>
                    {formatDate(account.updatedAt)}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                    gutterBottom
                  >
                    Last Login
                  </Typography>
                  <Typography variant="body2" color="text.primary" gutterBottom>
                    {formatDate(account.lastLogin)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 2,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                mb: 4,
                position: 'relative',
                overflow: 'hidden',
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
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    color: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  Account Information
                </Typography>

                <Divider
                  sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                />

                <Grid2 container spacing={3}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        gutterBottom
                      >
                        <PersonIcon
                          sx={{
                            fontSize: 18,
                            verticalAlign: 'text-bottom',
                            mr: 0.5,
                          }}
                        />
                        Username
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                      >
                        {account.username}
                      </Typography>
                    </Box>
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        gutterBottom
                      >
                        <EmailIcon
                          sx={{
                            fontSize: 18,
                            verticalAlign: 'text-bottom',
                            mr: 0.5,
                          }}
                        />
                        Email
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                      >
                        {account.email}
                      </Typography>
                    </Box>
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        gutterBottom
                      >
                        <AdminIcon
                          sx={{
                            fontSize: 18,
                            verticalAlign: 'text-bottom',
                            mr: 0.5,
                          }}
                        />
                        Roles
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {account.roles.map((role) => (
                          <Chip
                            key={role}
                            label={role}
                            size="small"
                            icon={
                              role === 'ADMIN' ? (
                                <AdminIcon fontSize="small" />
                              ) : (
                                <ProductManagerIcon fontSize="small" />
                              )
                            }
                            sx={{
                              backgroundColor:
                                role === 'ADMIN'
                                  ? 'rgba(0, 191, 165, 0.1)'
                                  : 'rgba(255, 152, 0, 0.1)',
                              color:
                                role === 'ADMIN'
                                  ? 'success.light'
                                  : 'warning.light',
                              borderColor:
                                role === 'ADMIN'
                                  ? 'rgba(0, 191, 165, 0.3)'
                                  : 'rgba(255, 152, 0, 0.3)',
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        gutterBottom
                      >
                        <BlockIcon
                          sx={{
                            fontSize: 18,
                            verticalAlign: 'text-bottom',
                            mr: 0.5,
                          }}
                        />
                        Status
                      </Typography>
                      <Chip
                        label={account.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                        size="small"
                        icon={
                          account.isBlocked ? (
                            <BlockIcon fontSize="small" />
                          ) : undefined
                        }
                        sx={{
                          backgroundColor: account.isBlocked
                            ? 'rgba(255, 82, 82, 0.1)'
                            : 'rgba(0, 191, 165, 0.1)',
                          color: account.isBlocked
                            ? 'error.light'
                            : 'success.light',
                          borderColor: account.isBlocked
                            ? 'rgba(255, 82, 82, 0.3)'
                            : 'rgba(0, 191, 165, 0.3)',
                        }}
                      />
                    </Box>
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        gutterBottom
                      >
                        <CalendarTodayIcon
                          sx={{
                            fontSize: 18,
                            verticalAlign: 'text-bottom',
                            mr: 0.5,
                          }}
                        />
                        Created At
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                      >
                        {formatDate(account.createdAt)}
                      </Typography>
                    </Box>
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        gutterBottom
                      >
                        <CalendarTodayIcon
                          sx={{
                            fontSize: 18,
                            verticalAlign: 'text-bottom',
                            mr: 0.5,
                          }}
                        />
                        Last Login
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                      >
                        {formatDate(account.lastLogin)}
                      </Typography>
                    </Box>
                  </Grid2>
                </Grid2>
              </Box>
            </Paper>

            {/* Actions paper */}
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 2,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage:
                    'radial-gradient(circle at 30% 70%, rgba(2, 136, 209, 0.08) 0%, transparent 70%)',
                  opacity: 0.6,
                  zIndex: 1,
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    color: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  Account Actions
                </Typography>

                <Divider
                  sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                />

                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        navigate(`/admin/users/${account.id}/edit`)
                      }
                      startIcon={<EditIcon />}
                      sx={{
                        py: 1.5,
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
                      Edit User
                    </Button>
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="warning"
                      onClick={() => setResetPasswordDialogOpen(true)}
                      startIcon={<ResetPasswordIcon />}
                      sx={{
                        py: 1.5,
                        borderColor: 'rgba(255, 152, 0, 0.3)',
                        '&:hover': {
                          borderColor: 'rgba(255, 152, 0, 0.5)',
                          backgroundColor: 'rgba(255, 152, 0, 0.05)',
                        },
                      }}
                    >
                      Reset Password
                    </Button>
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    {account.isBlocked ? (
                      <Button
                        fullWidth
                        variant="outlined"
                        color="success"
                        onClick={() => setUnblockDialogOpen(true)}
                        startIcon={<BlockIcon />}
                        sx={{
                          py: 1.5,
                          borderColor: 'rgba(0, 191, 165, 0.3)',
                          '&:hover': {
                            borderColor: 'rgba(0, 191, 165, 0.5)',
                            backgroundColor: 'rgba(0, 191, 165, 0.05)',
                          },
                        }}
                      >
                        Unblock User
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={() => setBlockDialogOpen(true)}
                        startIcon={<BlockIcon />}
                        sx={{
                          py: 1.5,
                          borderColor: 'rgba(255, 82, 82, 0.3)',
                          '&:hover': {
                            borderColor: 'rgba(255, 82, 82, 0.5)',
                            backgroundColor: 'rgba(255, 82, 82, 0.05)',
                          },
                        }}
                      >
                        Block User
                      </Button>
                    )}
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      onClick={() => setDeleteDialogOpen(true)}
                      startIcon={<DeleteIcon />}
                      sx={{
                        py: 1.5,
                        borderColor: 'rgba(255, 82, 82, 0.3)',
                        '&:hover': {
                          borderColor: 'rgba(255, 82, 82, 0.5)',
                          backgroundColor: 'rgba(255, 82, 82, 0.05)',
                        },
                      }}
                    >
                      Delete User
                    </Button>
                  </Grid2>
                </Grid2>
              </Box>
            </Paper>
          </Grid2>
        </Grid2>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(4px)',
            },
          },
          paper: {
            sx: {
              bgcolor: '#0d2538',
              backgroundImage:
                'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
              border: '1px solid rgba(255, 82, 82, 0.2)',
              borderRadius: 2,
              boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.3)',
              p: 1,
            },
          },
        }}
      >
        <DialogTitle sx={{ color: 'error.light' }}>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Are you sure you want to delete the user
            <Typography
              component="span"
              sx={{
                fontWeight: 'bold',
                color: 'error.light',
                mx: 0.5,
              }}
            >
              {account?.username}
            </Typography>
            ? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => executeAction('delete')}
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
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Block User Dialog */}
      <Dialog
        open={blockDialogOpen}
        onClose={() => setBlockDialogOpen(false)}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(4px)',
            },
          },
          paper: {
            sx: {
              bgcolor: '#0d2538',
              backgroundImage:
                'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
              border: '1px solid rgba(255, 82, 82, 0.2)',
              borderRadius: 2,
              boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.3)',
              p: 1,
            },
          },
        }}
      >
        <DialogTitle sx={{ color: 'error.light' }}>Block User</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Are you sure you want to block the user
            <Typography
              component="span"
              sx={{
                fontWeight: 'bold',
                color: 'error.light',
                mx: 0.5,
              }}
            >
              {account?.username}
            </Typography>
            ? They will no longer be able to access the system until unblocked.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setBlockDialogOpen(false)}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => executeAction('block')}
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
            Block User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unblock User Dialog */}
      <Dialog
        open={unblockDialogOpen}
        onClose={() => setUnblockDialogOpen(false)}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(4px)',
            },
          },
          paper: {
            sx: {
              bgcolor: '#0d2538',
              backgroundImage:
                'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
              border: '1px solid rgba(0, 191, 165, 0.2)',
              borderRadius: 2,
              boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.3)',
              p: 1,
            },
          },
        }}
      >
        <DialogTitle sx={{ color: 'success.light' }}>Unblock User</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Are you sure you want to unblock the user
            <Typography
              component="span"
              sx={{
                fontWeight: 'bold',
                color: 'success.light',
                mx: 0.5,
              }}
            >
              {account?.username}
            </Typography>
            ? They will regain access to the system.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setUnblockDialogOpen(false)}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => executeAction('unblock')}
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
            Unblock User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog
        open={resetPasswordDialogOpen}
        onClose={() => {
          setResetPasswordDialogOpen(false);
          setResetPasswordResult(null);
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(4px)',
            },
          },
          paper: {
            sx: {
              bgcolor: '#0d2538',
              backgroundImage:
                'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
              border: '1px solid rgba(255, 152, 0, 0.2)',
              borderRadius: 2,
              boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.3)',
              p: 1,
              maxWidth: resetPasswordResult ? 500 : 400,
            },
          },
        }}
      >
        {resetPasswordResult ? (
          <>
            <DialogTitle sx={{ color: 'success.light' }}>
              Password Reset Complete
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ color: 'text.secondary', mb: 2 }}>
                The password for
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 'bold',
                    color: 'warning.light',
                    mx: 0.5,
                  }}
                >
                  {account?.username}
                </Typography>
                has been reset successfully.
              </DialogContentText>

              <Alert
                severity="info"
                sx={{
                  mb: 2,
                  backgroundColor: 'rgba(2, 136, 209, 0.1)',
                  border: '1px solid rgba(100, 255, 218, 0.2)',
                }}
              >
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    New Temporary Password:
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: 'primary.light',
                    p: 1,
                    backgroundColor: 'rgba(1, 22, 39, 0.5)',
                    borderRadius: 1,
                    border: '1px solid rgba(100, 255, 218, 0.1)',
                  }}
                >
                  {resetPasswordResult}
                </Typography>
              </Alert>

              <Typography variant="caption" color="warning.light">
                Make sure to securely share this password with the user. They
                will need to change this password on their next login.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setResetPasswordDialogOpen(false);
                  setResetPasswordResult(null);
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle sx={{ color: 'warning.light' }}>
              Reset Password
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ color: 'text.secondary' }}>
                Are you sure you want to reset the password for user
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 'bold',
                    color: 'warning.light',
                    mx: 0.5,
                  }}
                >
                  {account?.username}
                </Typography>
                ? A temporary password will be generated and shown to you.
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={() => setResetPasswordDialogOpen(false)}
                sx={{ color: 'text.secondary' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() => executeAction('reset')}
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
                Reset Password
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default UserDetailPage;
