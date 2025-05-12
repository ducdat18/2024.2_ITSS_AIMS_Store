import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid2,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import {
  Email as EmailIcon,
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { UserAccount, UserRole } from '../../types';
import { mockAccountService } from '../../mock/mockDataAccount';
import ConfirmDialog from '../../components/admin/common/ConfirmDialog';
import LoadingIndicator from '../../components/admin/common/LoadingIndicator';
import PageHeader from '../../components/admin/common/PageHeader';
import StatusChip from '../../components/admin/common/StatusChip';
import PageLayout from '../../components/admin/dashboard/PageLayout';
import UserDetailCard from '../../components/admin/user/UserDetailCard';
import UserDetailHeader from '../../components/admin/user/UserDetailHeader';

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

      // Close dialogs, except reset password when we want to show the result
      if (action !== 'reset') {
        setDeleteDialogOpen(false);
        setBlockDialogOpen(false);
        setUnblockDialogOpen(false);
        setResetPasswordDialogOpen(false);
      }
    }
  };

  const handleCloseResetPasswordDialog = () => {
    setResetPasswordDialogOpen(false);
    setResetPasswordResult(null);
  };

  if (loading && !account) {
    return <LoadingIndicator message="Loading user details..." />;
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
        <PageHeader
          title="User Details"
          icon={<PersonIcon />}
          onBackClick={() => navigate('/admin/users')}
        />
      </Container>
    );
  }

  return (
    <PageLayout>
      <Container maxWidth="lg">
        {/* Back button and page title */}
        <PageHeader
          title="User Details"
          icon={<PersonIcon />}
          onBackClick={() => navigate('/admin/users')}
        />

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
            <UserDetailCard user={account} formatDate={formatDate} />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 8 }}>
            {/* User Information */}
            <Box
              sx={{
                p: 4,
                mb: 4,
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
                    'radial-gradient(circle at 30% 20%, rgba(2, 136, 209, 0.08) 0%, transparent 70%)',
                  opacity: 0.6,
                  zIndex: 1,
                },
              }}
            >
              <Grid2
                container
                spacing={3}
                sx={{ position: 'relative', zIndex: 2 }}
              >
                <Grid2 size={12}>
                  <PageHeader
                    title="Account Information"
                    icon={<PersonIcon />}
                  />
                </Grid2>

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
                        <StatusChip
                          key={role}
                          status={
                            role === UserRole.ADMIN
                              ? 'admin'
                              : 'product_manager'
                          }
                          icon={
                            role === UserRole.ADMIN ? (
                              <AdminIcon fontSize="small" />
                            ) : (
                              <PersonIcon fontSize="small" />
                            )
                          }
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
                    <StatusChip
                      status={account.isBlocked ? 'blocked' : 'active'}
                      icon={
                        account.isBlocked ? (
                          <BlockIcon fontSize="small" />
                        ) : undefined
                      }
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

            {/* Actions paper */}
            <UserDetailHeader
              user={account}
              onEdit={() => navigate(`/admin/users/${account.id}/edit`)}
              onDelete={() => setDeleteDialogOpen(true)}
              onBlock={() => setBlockDialogOpen(true)}
              onUnblock={() => setUnblockDialogOpen(true)}
              onResetPassword={() => setResetPasswordDialogOpen(true)}
            />
          </Grid2>
        </Grid2>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          title="Delete User"
          message="Are you sure you want to delete the user"
          username={account.username}
          confirmText="Delete"
          onConfirm={() => executeAction('delete')}
          onCancel={() => setDeleteDialogOpen(false)}
          color="error"
        />

        {/* Block User Dialog */}
        <ConfirmDialog
          open={blockDialogOpen}
          title="Block User"
          message="Are you sure you want to block the user"
          username={account.username}
          confirmText="Block User"
          onConfirm={() => executeAction('block')}
          onCancel={() => setBlockDialogOpen(false)}
          color="error"
        />

        {/* Unblock User Dialog */}
        <ConfirmDialog
          open={unblockDialogOpen}
          title="Unblock User"
          message="Are you sure you want to unblock the user"
          username={account.username}
          confirmText="Unblock User"
          onConfirm={() => executeAction('unblock')}
          onCancel={() => setUnblockDialogOpen(false)}
          color="success"
        />

        {/* Reset Password Dialog */}
        <Dialog
          open={resetPasswordDialogOpen}
          onClose={handleCloseResetPasswordDialog}
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
                  onClick={handleCloseResetPasswordDialog}
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
      </Container>
    </PageLayout>
  );
};

export default UserDetailPage;
