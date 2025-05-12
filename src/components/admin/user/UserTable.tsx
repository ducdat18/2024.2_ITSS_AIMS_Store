import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Block as BlockIcon,
  Delete as DeleteIcon,
  LockReset as ResetPasswordIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StatusChip from '../common/StatusChip';
import { UserAccount, UserRole } from '../../../types';

interface UserTableProps {
  users: UserAccount[];
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onBlock: (user: UserAccount) => void;
  onUnblock: (user: UserAccount) => void;
  onDelete: (user: UserAccount) => void;
  onResetPassword: (user: UserAccount) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onViewDetails,
  onEdit,
  onBlock,
  onUnblock,
  onDelete,
  onResetPassword,
}) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    user: UserAccount
  ) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedUser(user);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedUser(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          borderRadius: 2,
          backgroundImage: 'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
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
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No users found matching your filters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '& .MuiTableCell-root': {
                        borderBottom: '1px solid rgba(100, 255, 218, 0.05)',
                      },
                      transition: 'background-color 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(2, 136, 209, 0.05)',
                      },
                      backgroundColor: user.isBlocked
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
                            backgroundColor: user.isBlocked
                              ? 'rgba(255, 82, 82, 0.1)'
                              : 'rgba(2, 136, 209, 0.1)',
                            color: user.isBlocked
                              ? 'error.light'
                              : 'primary.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1.5,
                          }}
                        >
                          {user.isBlocked ? (
                            <BlockIcon fontSize="small" />
                          ) : (
                            <PersonIcon fontSize="small" />
                          )}
                        </Box>
                        <Typography
                          variant="body1"
                          component="span"
                          sx={{
                            fontWeight: 'medium',
                            color: user.isBlocked
                              ? 'text.disabled'
                              : 'text.primary',
                          }}
                        >
                          {user.username}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {user.roles.map((role) => (
                          <StatusChip
                            key={role}
                            status={
                              role === UserRole.ADMIN
                                ? 'admin'
                                : 'product_manager'
                            }
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <StatusChip
                        status={user.isBlocked ? 'blocked' : 'active'}
                      />
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
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
                            onClick={() => onEdit(user.id)}
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
                          onClick={(e) => handleActionMenuOpen(e, user)}
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
          count={users.length}
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
        {selectedUser && (
          <>
            <MenuItem
              onClick={() => {
                onViewDetails(selectedUser.id);
                handleActionMenuClose();
              }}
            >
              <PersonIcon
                fontSize="small"
                sx={{ mr: 1.5, color: 'primary.light' }}
              />
              View Details
            </MenuItem>

            <MenuItem
              onClick={() => {
                onEdit(selectedUser.id);
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
                onResetPassword(selectedUser);
                handleActionMenuClose();
              }}
            >
              <ResetPasswordIcon
                fontSize="small"
                sx={{ mr: 1.5, color: 'warning.light' }}
              />
              Reset Password
            </MenuItem>

            <Divider sx={{ my: 1, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

            {selectedUser.isBlocked ? (
              <MenuItem
                onClick={() => {
                  onUnblock(selectedUser);
                  handleActionMenuClose();
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
                  onBlock(selectedUser);
                  handleActionMenuClose();
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
                onDelete(selectedUser);
                handleActionMenuClose();
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
    </>
  );
};

export default UserTable;
