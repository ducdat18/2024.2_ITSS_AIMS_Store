import React from 'react';
import { Paper, Box, Typography, Chip, Divider } from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminIcon,
  Block as BlockIcon,
  CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';
import StatusChip from '../common/StatusChip';
import { UserAccount, UserRole } from '../../../types';

interface UserDetailCardProps {
  user: UserAccount;
  formatDate: (date?: string) => string;
}

const UserDetailCard: React.FC<UserDetailCardProps> = ({
  user,
  formatDate,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundImage: 'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
        border: user.isBlocked
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
          backgroundImage: user.isBlocked
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
            backgroundColor: user.isBlocked
              ? 'rgba(255, 82, 82, 0.1)'
              : 'rgba(2, 136, 209, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            mx: 'auto',
            border: user.isBlocked
              ? '2px solid rgba(255, 82, 82, 0.2)'
              : '2px solid rgba(100, 255, 218, 0.2)',
          }}
        >
          <PersonIcon
            sx={{
              fontSize: 50,
              color: user.isBlocked ? 'error.light' : 'primary.light',
            }}
          />
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: user.isBlocked ? 'error.light' : 'primary.light',
            mb: 0.5,
          }}
        >
          {user.username}
        </Typography>

        <Typography variant="body1" color="text.secondary" gutterBottom>
          {user.email}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            my: 2,
          }}
        >
          {user.roles.map((role) => (
            <StatusChip
              key={role}
              status={role === UserRole.ADMIN ? 'admin' : 'product_manager'}
              icon={
                role === UserRole.ADMIN ? (
                  <AdminIcon fontSize="small" />
                ) : undefined
              }
            />
          ))}
        </Box>

        <Box sx={{ my: 2 }}>
          <StatusChip
            status={user.isBlocked ? 'blocked' : 'active'}
            icon={user.isBlocked ? <BlockIcon fontSize="small" /> : undefined}
          />
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Account ID
          </Typography>
          <Typography variant="body2" color="text.primary" gutterBottom>
            {user.id}
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
            {user.userId}
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
            {formatDate(user.createdAt)}
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
            {formatDate(user.updatedAt)}
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
            {formatDate(user.lastLogin)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserDetailCard;
