import React, { useState, useEffect } from 'react';
import { Box, Container, Alert, Grid2, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  ShoppingBag as ProductManagerIcon,
  Block as BlockIcon,
  Refresh as RefreshIcon,
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
import { mockAccountService } from '../../mock/mockDataAccount';
import { UserAccount, UserRole } from '../../types';
import LoadingIndicator from '../../components/admin/common/LoadingIndicator';
import PageHeader from '../../components/admin/common/PageHeader';
import ActionCard from '../../components/admin/dashboard/ActionCard';
import StatCard from '../../components/admin/dashboard/StatCard';
import UserCard from '../../components/admin/dashboard/UserCard';
import ConfirmDialog from '../../components/admin/common/ConfirmDialog';
import PageLayout from '../../components/admin/dashboard/PageLayout';

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

  // Dialog state
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [unblockDialogOpen, setUnblockDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

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

  // Prepare block/unblock dialog
  const prepareBlockUser = (user: UserAccount) => {
    setSelectedUser(user);
    setBlockDialogOpen(true);
  };

  const prepareUnblockUser = (user: UserAccount) => {
    setSelectedUser(user);
    setUnblockDialogOpen(true);
  };

  // Execute block/unblock action
  const handleBlockUser = async () => {
    if (!selectedUser) return;

    try {
      await mockAccountService.blockAccount(selectedUser.id);
      // Refresh data
      fetchAccounts();
    } catch (err) {
      console.error('Error blocking user:', err);
      setError('Failed to block user. Please try again later.');
    } finally {
      setBlockDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleUnblockUser = async () => {
    if (!selectedUser) return;

    try {
      await mockAccountService.unblockAccount(selectedUser.id);
      // Refresh data
      fetchAccounts();
    } catch (err) {
      console.error('Error unblocking user:', err);
      setError('Failed to unblock user. Please try again later.');
    } finally {
      setUnblockDialogOpen(false);
      setSelectedUser(null);
    }
  };

  if (loading && accounts.length === 0) {
    return <LoadingIndicator message="Loading admin dashboard..." />;
  }

  // Header actions
  const headerActions = (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={fetchAccounts}
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
    </>
  );

  return (
    <PageLayout>
      <Container maxWidth="lg">
        <PageHeader
          title="Admin Dashboard"
          icon={<AdminIcon />}
          actions={headerActions}
        />

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
            <StatCard
              title="Total Users"
              count={stats.totalUsers}
              icon={<PeopleIcon />}
              color="primary"
              linkTo="/admin/users"
              linkText="View All"
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Administrators"
              count={stats.admins}
              icon={<AdminIcon />}
              color="success"
              linkTo="/admin/users?role=ADMIN"
              linkText="View Admins"
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Product Managers"
              count={stats.productManagers}
              icon={<ProductManagerIcon />}
              color="warning"
              linkTo="/admin/users?role=PRODUCT_MANAGER"
              linkText="View Managers"
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Blocked Users"
              count={stats.blockedUsers}
              icon={<BlockIcon />}
              color="error"
              linkTo="/admin/users?status=blocked"
              linkText="View Blocked"
            />
          </Grid2>
        </Grid2>

        {/* Recent Users */}
        <Box sx={{ mb: 4 }}>
          <PageHeader title="Recent Users" icon={<PersonIcon />} />

          <Grid2 container spacing={3}>
            {accounts.slice(0, 6).map((account) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={account.id}>
                <UserCard
                  user={account}
                  onBlock={() => prepareBlockUser(account)}
                  onUnblock={() => prepareUnblockUser(account)}
                />
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

        {/* Admin Actions */}
        <Box>
          <PageHeader title="Admin Actions" icon={<RefreshIcon />} />

          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <ActionCard
                title="Add New User"
                description="Create a new user account"
                icon={<PersonAddIcon />}
                color="primary"
                linkTo="/admin/users/add"
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <ActionCard
                title="Manage Admins"
                description="View and manage admin users"
                icon={<AdminIcon />}
                color="success"
                linkTo="/admin/users?role=ADMIN"
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <ActionCard
                title="Manage Product Managers"
                description="View and manage product managers"
                icon={<ProductManagerIcon />}
                color="warning"
                linkTo="/admin/users?role=PRODUCT_MANAGER"
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <ActionCard
                title="Blocked Users"
                description="Manage blocked user accounts"
                icon={<BlockIcon />}
                color="error"
                linkTo="/admin/users?status=blocked"
              />
            </Grid2>
          </Grid2>
        </Box>

        {/* Block User Dialog */}
        <ConfirmDialog
          open={blockDialogOpen}
          title="Block User"
          message="Are you sure you want to block the user"
          username={selectedUser?.username}
          confirmText="Block User"
          onConfirm={handleBlockUser}
          onCancel={() => setBlockDialogOpen(false)}
          color="error"
        />

        {/* Unblock User Dialog */}
        <ConfirmDialog
          open={unblockDialogOpen}
          title="Unblock User"
          message="Are you sure you want to unblock the user"
          username={selectedUser?.username}
          confirmText="Unblock User"
          onConfirm={handleUnblockUser}
          onCancel={() => setUnblockDialogOpen(false)}
          color="success"
        />
      </Container>
    </PageLayout>
  );
};

export default AdminDashboardPage;
