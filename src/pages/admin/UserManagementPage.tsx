import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Alert } from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserAccount, UserRole } from '../../types';
import { mockAccountService } from '../../mock/mockDataAccount';
import ConfirmDialog from '../../components/admin/common/ConfirmDialog';
import LoadingIndicator from '../../components/admin/common/LoadingIndicator';
import PageHeader from '../../components/admin/common/PageHeader';
import PageLayout from '../../components/admin/dashboard/PageLayout';
import UserFilters from '../../components/admin/user/UserFilter';
import UserTable from '../../components/admin/user/UserTable';

const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // State
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState(
    queryParams.get('role') || 'ALL'
  );
  const [statusFilter, setStatusFilter] = useState(
    queryParams.get('status') === 'blocked' ? 'BLOCKED' : 'ALL'
  );

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [unblockDialogOpen, setUnblockDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<UserAccount | null>(
    null
  );
  const [actionResult, setActionResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...accounts];

    // Apply role filter
    if (roleFilter !== 'ALL') {
      result = result.filter((account) =>
        account.roles.includes(roleFilter as UserRole)
      );
    }

    // Apply status filter
    if (statusFilter === 'BLOCKED') {
      result = result.filter((account) => account.isBlocked);
    } else if (statusFilter === 'ACTIVE') {
      result = result.filter((account) => !account.isBlocked);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (account) =>
          account.username.toLowerCase().includes(query) ||
          account.email.toLowerCase().includes(query)
      );
    }

    setFilteredAccounts(result);
  }, [accounts, roleFilter, statusFilter, searchQuery]);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Handle role filter change
  const handleRoleFilterChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const role = event.target.value as string;
    setRoleFilter(role);

    // Update URL query params
    const params = new URLSearchParams(location.search);
    if (role === 'ALL') {
      params.delete('role');
    } else {
      params.set('role', role);
    }

    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  // Handle status filter change
  const handleStatusFilterChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const status = event.target.value as string;
    setStatusFilter(status);

    // Update URL query params
    const params = new URLSearchParams(location.search);
    if (status === 'BLOCKED') {
      params.set('status', 'blocked');
    } else {
      params.delete('status');
    }

    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setRoleFilter('ALL');
    setStatusFilter('ALL');
    setSearchQuery('');

    // Remove all filter query params
    navigate(location.pathname);
  };

  // Fetch accounts
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await mockAccountService.getAccounts();
      setAccounts(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError('Failed to load user accounts. Please try again later.');
      setLoading(false);
    }
  };

  // Prepare action dialog
  const prepareAction = (
    actionType: 'delete' | 'block' | 'unblock' | 'reset',
    account: UserAccount
  ) => {
    setSelectedAccount(account);

    switch (actionType) {
      case 'delete':
        setDeleteDialogOpen(true);
        break;
      case 'block':
        setBlockDialogOpen(true);
        break;
      case 'unblock':
        setUnblockDialogOpen(true);
        break;
      case 'reset':
        setResetPasswordDialogOpen(true);
        break;
    }
  };

  // Execute the selected action
  const executeAction = async (
    actionType: 'delete' | 'block' | 'unblock' | 'reset'
  ) => {
    if (!selectedAccount) return;

    try {
      setLoading(true);

      switch (actionType) {
        case 'delete':
          await mockAccountService.deleteAccount(selectedAccount.id);
          setActionResult({
            type: 'success',
            message: `User ${selectedAccount.username} has been deleted.`,
          });

          // Remove from local state
          setAccounts(accounts.filter((acc) => acc.id !== selectedAccount.id));
          break;

        case 'block':
          const blockedAccount = await mockAccountService.blockAccount(
            selectedAccount.id
          );
          if (blockedAccount) {
            setActionResult({
              type: 'success',
              message: `User ${selectedAccount.username} has been blocked.`,
            });

            // Update in local state
            setAccounts(
              accounts.map((acc) =>
                acc.id === selectedAccount.id
                  ? { ...acc, isBlocked: true }
                  : acc
              )
            );
          }
          break;

        case 'unblock':
          const unblockedAccount = await mockAccountService.unblockAccount(
            selectedAccount.id
          );
          if (unblockedAccount) {
            setActionResult({
              type: 'success',
              message: `User ${selectedAccount.username} has been unblocked.`,
            });

            // Update in local state
            setAccounts(
              accounts.map((acc) =>
                acc.id === selectedAccount.id
                  ? { ...acc, isBlocked: false }
                  : acc
              )
            );
          }
          break;

        case 'reset':
          const newPassword = await mockAccountService.resetPassword(
            selectedAccount.id
          );
          setActionResult({
            type: 'success',
            message: `Password reset for ${selectedAccount.username}. Temporary password: ${newPassword}`,
          });
          break;
      }
    } catch (err) {
      console.error(`Error during ${actionType} action:`, err);
      setActionResult({
        type: 'error',
        message: `Failed to ${actionType} user. Please try again.`,
      });
    } finally {
      setLoading(false);
      setSelectedAccount(null);

      // Close all dialogs
      setDeleteDialogOpen(false);
      setBlockDialogOpen(false);
      setUnblockDialogOpen(false);
      setResetPasswordDialogOpen(false);
    }
  };

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

  if (loading && accounts.length === 0) {
    return <LoadingIndicator message="Loading user accounts..." />;
  }

  return (
    <PageLayout>
      <Container maxWidth="lg">
        <PageHeader
          title="User Management"
          icon={<PeopleIcon />}
          actions={headerActions}
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

        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{
              mb: 3,
              backgroundColor: 'rgba(255, 82, 82, 0.1)',
              border: '1px solid rgba(255, 82, 82, 0.3)',
            }}
          >
            {error}
          </Alert>
        )}

        {/* Filter and search controls */}
        <UserFilters
          searchQuery={searchQuery}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          onSearchChange={handleSearchChange}
          onRoleFilterChange={handleRoleFilterChange}
          onStatusFilterChange={handleStatusFilterChange}
          onClearSearch={handleClearSearch}
          onClearFilters={handleClearFilters}
        />

        {/* Results summary */}
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography color="text.secondary">
            {filteredAccounts.length === 0
              ? 'No users found'
              : `Showing ${filteredAccounts.length} user${
                  filteredAccounts.length !== 1 ? 's' : ''
                }`}
          </Typography>

          {filteredAccounts.length === 0 && (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleClearFilters}
              sx={{
                borderColor: 'rgba(100, 255, 218, 0.3)',
                '&:hover': {
                  borderColor: 'rgba(100, 255, 218, 0.5)',
                  backgroundColor: 'rgba(100, 255, 218, 0.05)',
                },
              }}
            >
              Clear All Filters
            </Button>
          )}
        </Box>

        {/* User table */}
        <UserTable
          users={filteredAccounts}
          onViewDetails={(id) => navigate(`/admin/users/${id}`)}
          onEdit={(id) => navigate(`/admin/users/${id}/edit`)}
          onBlock={(user) => prepareAction('block', user)}
          onUnblock={(user) => prepareAction('unblock', user)}
          onDelete={(user) => prepareAction('delete', user)}
          onResetPassword={(user) => prepareAction('reset', user)}
        />

        {/* Confirmation Dialogs */}
        <ConfirmDialog
          open={deleteDialogOpen}
          title="Delete User"
          message="Are you sure you want to delete the user"
          username={selectedAccount?.username}
          confirmText="Delete"
          onConfirm={() => executeAction('delete')}
          onCancel={() => setDeleteDialogOpen(false)}
          color="error"
        />

        <ConfirmDialog
          open={blockDialogOpen}
          title="Block User"
          message="Are you sure you want to block the user"
          username={selectedAccount?.username}
          confirmText="Block User"
          onConfirm={() => executeAction('block')}
          onCancel={() => setBlockDialogOpen(false)}
          color="error"
        />

        <ConfirmDialog
          open={unblockDialogOpen}
          title="Unblock User"
          message="Are you sure you want to unblock the user"
          username={selectedAccount?.username}
          confirmText="Unblock User"
          onConfirm={() => executeAction('unblock')}
          onCancel={() => setUnblockDialogOpen(false)}
          color="success"
        />

        <ConfirmDialog
          open={resetPasswordDialogOpen}
          title="Reset Password"
          message="Are you sure you want to reset the password for user"
          username={selectedAccount?.username}
          confirmText="Reset Password"
          onConfirm={() => executeAction('reset')}
          onCancel={() => setResetPasswordDialogOpen(false)}
          color="warning"
        />
      </Container>
    </PageLayout>
  );
};

export default UserManagementPage;
