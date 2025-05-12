import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  LockReset as ResetPasswordIcon,
} from '@mui/icons-material';
import { UserAccount } from '../../../types';

interface UserDetailHeaderProps {
  user: UserAccount;
  onEdit: () => void;
  onDelete: () => void;
  onBlock: () => void;
  onUnblock: () => void;
  onResetPassword: () => void;
}

const UserDetailHeader: React.FC<UserDetailHeaderProps> = ({
  user,
  onEdit,
  onDelete,
  onBlock,
  onUnblock,
  onResetPassword,
}) => {
  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 2,
        backgroundImage: 'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
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

        <Box sx={{ mt: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={onEdit}
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

            <Button
              variant="outlined"
              color="warning"
              onClick={onResetPassword}
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

            {user.isBlocked ? (
              <Button
                variant="outlined"
                color="success"
                onClick={onUnblock}
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
                variant="outlined"
                color="error"
                onClick={onBlock}
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

            <Button
              variant="outlined"
              color="error"
              onClick={onDelete}
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserDetailHeader;
