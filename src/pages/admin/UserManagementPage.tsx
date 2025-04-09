import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  IconButton,
  Chip,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  InputAdornment,
  Tooltip,
  Menu,
  FormControl,
  Select,
  InputLabel,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Block as BlockIcon,
  LockReset as ResetPasswordIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  ShoppingBag as ProductManagerIcon,
  Clear as ClearIcon,
  MoreVert as MoreVertIcon,
  Waves as WavesIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserAccount, UserRole } from '../../types';
import { mockAccountService } from '../../mock/mockDataAccount';

const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // State
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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

  // Action menu state
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [actionMenuAccountId, setActionMenuAccountId] = useState<string | null>(
    null
  );

  // Filter menu state
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  useEffect(() => {
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
    setPage(0); // Reset to first page when filters change
  }, [accounts, roleFilter, statusFilter, searchQuery]);

  // Open action menu
  const handleActionMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    accountId: string
  ) => {
    setActionMenuAnchor(event.currentTarget);
    setActionMenuAccountId(accountId);
  };

  // Close action menu
  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setActionMenuAccountId(null);
  };

  // Open filter menu
  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  // Close filter menu
  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  // Handle page change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  // Prepare dialog for delete, block, unblock, or reset password
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

    handleActionMenuClose();
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

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Refresh data
  const handleRefresh = async () => {
    try {
      setLoading(true);
      const data = await mockAccountService.getAccounts();
      setAccounts(data);
      setActionResult({
        type: 'success',
        message: 'User list refreshed successfully.',
      });
      setLoading(false);
    } catch (err) {
      console.error('Error refreshing accounts:', err);
      setError('Failed to refresh user accounts. Please try again later.');
      setLoading(false);
    }
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
          Loading user accounts...
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
            User Management
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleRefresh}
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
        <Paper
          elevation={3}
          sx={{
            p: 3,
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
                'radial-gradient(circle at 50% 0%, rgba(2, 136, 209, 0.05) 0%, transparent 70%)',
              opacity: 0.6,
              zIndex: 1,
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: { xs: 'wrap', md: 'nowrap' },
              gap: 2,
              position: 'relative',
              zIndex: 2,
            }}
          >
            {/* Search input */}
            <TextField
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearchChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(100, 255, 218, 0.7)' }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClearSearch}
                      size="small"
                      sx={{ color: 'rgba(100, 255, 218, 0.7)' }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              sx={{
                flexGrow: 1,
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

            {/* Role filter */}
            <FormControl
              sx={{
                flexBasis: { xs: '100%', sm: '220px' },
                flexShrink: 0,
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
            >
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                onChange={handleRoleFilterChange as any}
                label="Role"
                sx={{ minWidth: '120px' }}
              >
                <MenuItem value="ALL">All Roles</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="PRODUCT_MANAGER">Product Manager</MenuItem>
              </Select>
            </FormControl>

            {/* Status filter */}
            <FormControl
              sx={{
                flexBasis: { xs: '100%', sm: '220px' },
                flexShrink: 0,
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
            >
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange as any}
                label="Status"
                sx={{ minWidth: '120px' }}
              >
                <MenuItem value="ALL">All Status</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="BLOCKED">Blocked</MenuItem>
              </Select>
            </FormControl>

            {/* Clear filters button - only show if filters are active */}
            {(roleFilter !== 'ALL' ||
              statusFilter !== 'ALL' ||
              searchQuery) && (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
                sx={{
                  flexShrink: 0,
                  borderColor: 'rgba(100, 255, 218, 0.3)',
                  '&:hover': {
                    borderColor: 'rgba(100, 255, 218, 0.5)',
                    backgroundColor: 'rgba(100, 255, 218, 0.05)',
                  },
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>

          {/* Active filters summary */}
          {(roleFilter !== 'ALL' || statusFilter !== 'ALL' || searchQuery) && (
            <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                Active Filters:
              </Typography>

              {roleFilter !== 'ALL' && (
                <Chip
                  label={`Role: ${roleFilter}`}
                  size="small"
                  onDelete={() => setRoleFilter('ALL')}
                  sx={{
                    backgroundColor: 'rgba(0, 191, 165, 0.1)',
                    borderColor: 'rgba(0, 191, 165, 0.3)',
                    color: 'success.light',
                  }}
                />
              )}

              {statusFilter !== 'ALL' && (
                <Chip
                  label={`Status: ${statusFilter}`}
                  size="small"
                  onDelete={() => setStatusFilter('ALL')}
                  sx={{
                    backgroundColor:
                      statusFilter === 'BLOCKED'
                        ? 'rgba(255, 82, 82, 0.1)'
                        : 'rgba(0, 191, 165, 0.1)',
                    borderColor:
                      statusFilter === 'BLOCKED'
                        ? 'rgba(255, 82, 82, 0.3)'
                        : 'rgba(0, 191, 165, 0.3)',
                    color:
                      statusFilter === 'BLOCKED'
                        ? 'error.light'
                        : 'success.light',
                  }}
                />
              )}

              {searchQuery && (
                <Chip
                  label={`Search: ${searchQuery}`}
                  size="small"
                  onDelete={handleClearSearch}
                  sx={{
                    backgroundColor: 'rgba(2, 136, 209, 0.1)',
                    borderColor: 'rgba(2, 136, 209, 0.3)',
                    color: 'primary.light',
                  }}
                />
              )}
            </Box>
          )}
        </Paper>

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
              : `Showing ${page * rowsPerPage + 1} - ${Math.min(
                  (page + 1) * rowsPerPage,
                  filteredAccounts.length
                )} of ${filteredAccounts.length} users`}
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
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{
            borderRadius: 2,
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            border: '1px solid rgba(100, 255, 218, 0.1)',
            overflow: 'hidden',
          }}
        >
          <Table>
            <TableHead
              sx={{
                backgroundImage:
                  'linear-gradient(135deg, rgba(2, 136, 209, 0.1) 0%, rgba(0, 91, 159, 0.1) 100%)',
                '& .MuiTableCell-root': {
                  fontWeight: 'bold',
                  color: 'primary.light',
                  borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
                },
              }}
            >
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAccounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No users found matching your filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAccounts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((account) => (
                    <TableRow
                      key={account.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '& .MuiTableCell-root': {
                          borderBottom: '1px solid rgba(100, 255, 218, 0.05)',
                        },
                        transition: 'background-color 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(2, 136, 209, 0.05)',
                        },
                        backgroundColor: account.isBlocked
                          ? 'rgba(255, 82, 82, 0.05)'
                          : 'transparent',
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: account.isBlocked
                                ? 'rgba(255, 82, 82, 0.1)'
                                : 'rgba(2, 136, 209, 0.1)',
                              color: account.isBlocked
                                ? 'error.light'
                                : 'primary.light',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 1.5,
                            }}
                          >
                            {account.isBlocked ? (
                              <BlockIcon fontSize="small" />
                            ) : (
                              <PersonAddIcon fontSize="small" />
                            )}
                          </Box>
                          <Typography
                            variant="body1"
                            component="span"
                            sx={{
                              fontWeight: 'medium',
                              color: account.isBlocked
                                ? 'text.disabled'
                                : 'text.primary',
                            }}
                          >
                            {account.username}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
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
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={account.isBlocked ? 'Blocked' : 'Active'}
                          size="small"
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
                      </TableCell>
                      <TableCell>{formatDate(account.createdAt)}</TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 1,
                          }}
                        >
                          <Tooltip title="Edit User">
                            <IconButton
                              size="small"
                              onClick={() =>
                                navigate(`/admin/users/${account.id}/edit`)
                              }
                              sx={{
                                color: 'primary.light',
                                '&:hover': {
                                  backgroundColor: 'rgba(2, 136, 209, 0.1)',
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <IconButton
                            size="small"
                            onClick={(e) => handleActionMenuOpen(e, account.id)}
                            sx={{
                              color: 'text.secondary',
                              '&:hover': {
                                backgroundColor: 'rgba(2, 136, 209, 0.1)',
                                color: 'primary.light',
                              },
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredAccounts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              color: 'text.secondary',
              borderTop: '1px solid rgba(100, 255, 218, 0.1)',
              '& .MuiToolbar-root': {
                padding: 2,
              },
              '& .MuiTablePagination-selectIcon': {
                color: 'primary.light',
              },
              '& .MuiTablePagination-actions button': {
                color: 'primary.light',
              },
            }}
          />
        </TableContainer>
      </Container>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#0d2538',
              backgroundImage:
                'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
              border: '1px solid rgba(100, 255, 218, 0.1)',
              borderRadius: 2,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
              mt: 0.5,
              '& .MuiMenuItem-root': {
                py: 1,
                px: 2,
              },
              '& .MuiMenuItem-root:hover': {
                backgroundColor: 'rgba(2, 136, 209, 0.1)',
              },
            },
          },
        }}
      >
        {actionMenuAccountId && (
          <>
            <MenuItem
              onClick={() => {
                const account = accounts.find(
                  (acc) => acc.id === actionMenuAccountId
                );
                if (account) {
                  navigate(`/admin/users/${account.id}`);
                }
                handleActionMenuClose();
              }}
            >
              <PersonAddIcon
                fontSize="small"
                sx={{ mr: 1.5, color: 'primary.light' }}
              />
              View Details
            </MenuItem>

            <MenuItem
              onClick={() => {
                const account = accounts.find(
                  (acc) => acc.id === actionMenuAccountId
                );
                if (account) {
                  navigate(`/admin/users/${account.id}/edit`);
                }
                handleActionMenuClose();
              }}
            >
              <EditIcon
                fontSize="small"
                sx={{ mr: 1.5, color: 'primary.light' }}
              />
              Edit User
            </MenuItem>

            <MenuItem
              onClick={() => {
                const account = accounts.find(
                  (acc) => acc.id === actionMenuAccountId
                );
                if (account) {
                  prepareAction('reset', account);
                }
              }}
            >
              <ResetPasswordIcon
                fontSize="small"
                sx={{ mr: 1.5, color: 'warning.light' }}
              />
              Reset Password
            </MenuItem>

            <Divider sx={{ my: 1, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

            {accounts.find((acc) => acc.id === actionMenuAccountId)
              ?.isBlocked ? (
              <MenuItem
                onClick={() => {
                  const account = accounts.find(
                    (acc) => acc.id === actionMenuAccountId
                  );
                  if (account) {
                    prepareAction('unblock', account);
                  }
                }}
              >
                <BlockIcon
                  fontSize="small"
                  sx={{ mr: 1.5, color: 'success.light' }}
                />
                Unblock User
              </MenuItem>
            ) : (
              <MenuItem
                onClick={() => {
                  const account = accounts.find(
                    (acc) => acc.id === actionMenuAccountId
                  );
                  if (account) {
                    prepareAction('block', account);
                  }
                }}
              >
                <BlockIcon
                  fontSize="small"
                  sx={{ mr: 1.5, color: 'error.light' }}
                />
                Block User
              </MenuItem>
            )}

            <MenuItem
              onClick={() => {
                const account = accounts.find(
                  (acc) => acc.id === actionMenuAccountId
                );
                if (account) {
                  prepareAction('delete', account);
                }
              }}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon
                fontSize="small"
                sx={{ mr: 1.5, color: 'error.light' }}
              />
              Delete User
            </MenuItem>
          </>
        )}
      </Menu>

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
              {selectedAccount?.username}
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
              {selectedAccount?.username}
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
              {selectedAccount?.username}
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
        onClose={() => setResetPasswordDialogOpen(false)}
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
            },
          },
        }}
      >
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
              {selectedAccount?.username}
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
      </Dialog>
    </Box>
  );
};

export default UserManagementPage;
