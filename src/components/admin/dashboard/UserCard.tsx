import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StatusChip from '../common/StatusChip';
import { UserAccount, UserRole } from '../../../types';

interface UserCardProps {
  user: UserAccount;
  onBlock: (id: string) => void;
  onUnblock: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onBlock, onUnblock }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 2,
        backgroundImage: 'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
        border: user.isBlocked
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
          backgroundImage: user.isBlocked
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
              color: user.isBlocked ? 'error.light' : 'primary.light',
              fontWeight: 'bold',
            }}
          >
            {user.username}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {user.roles.includes(UserRole.ADMIN) && (
              <StatusChip status="admin" />
            )}
            {user.roles.includes(UserRole.PRODUCT_MANAGER) && (
              <StatusChip status="product_manager" />
            )}
            {user.isBlocked && <StatusChip status="blocked" />}
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {user.email}
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
          <span>Created: {formatDate(user.createdAt)}</span>
          {user.lastLogin && (
            <span>Last login: {formatDate(user.lastLogin)}</span>
          )}
        </Typography>
      </CardContent>

      <Divider sx={{ borderColor: 'rgba(100, 255, 218, 0.1)' }} />

      <CardActions>
        <Button
          size="small"
          onClick={() => navigate(`/admin/users/${user.id}`)}
          sx={{ color: 'primary.light' }}
        >
          View Details
        </Button>
        <Button
          size="small"
          onClick={() => navigate(`/admin/users/${user.id}/edit`)}
          sx={{ color: 'primary.light' }}
        >
          Edit
        </Button>
        {user.isBlocked ? (
          <Button
            size="small"
            color="success"
            sx={{ ml: 'auto' }}
            onClick={() => onUnblock(user.id)}
          >
            Unblock
          </Button>
        ) : (
          <Button
            size="small"
            color="error"
            sx={{ ml: 'auto' }}
            onClick={() => onBlock(user.id)}
          >
            Block
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default UserCard;
