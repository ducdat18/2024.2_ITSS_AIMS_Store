import React from 'react';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
  CircularProgress,
  Grid2,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import RoleSelector from './RoleSelector';
import { UserRole } from '../../../types';

interface UserFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  roles: UserRole[];
  isBlocked: boolean;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  roles?: string;
  general?: string;
}

interface UserFormProps {
  formData: UserFormData;
  errors: FormErrors;
  isEditMode: boolean;
  submitLoading: boolean;
  formTouched: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRoleChange: (role: UserRole) => void;
  onTogglePasswordVisibility: () => void;
  onToggleConfirmPasswordVisibility: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  formData,
  errors,
  isEditMode,
  submitLoading,
  formTouched,
  showPassword,
  showConfirmPassword,
  onInputChange,
  onRoleChange,
  onTogglePasswordVisibility,
  onToggleConfirmPasswordVisibility,
  onSubmit,
  onCancel,
}) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        p: { xs: 3, md: 4 },
        position: 'relative',
        zIndex: 2,
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          color: 'primary.light',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        User Information
      </Typography>
      <Divider sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

      {/* User Information Fields */}
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={onInputChange}
            error={!!errors.username}
            helperText={errors.username}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: 'rgba(100, 255, 218, 0.7)' }} />
                </InputAdornment>
              ),
            }}
            sx={{
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
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onInputChange}
            error={!!errors.email}
            helperText={errors.email}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: 'rgba(100, 255, 218, 0.7)' }} />
                </InputAdornment>
              ),
            }}
            sx={{
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
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label={
              isEditMode
                ? 'New Password (leave blank to keep current)'
                : 'Password'
            }
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={onInputChange}
            error={!!errors.password}
            helperText={errors.password}
            required={!isEditMode}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: 'rgba(100, 255, 218, 0.7)' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={onTogglePasswordVisibility}
                    edge="end"
                    sx={{
                      color: 'rgba(100, 255, 218, 0.7)',
                      '&:hover': {
                        backgroundColor: 'rgba(100, 255, 218, 0.05)',
                      },
                    }}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
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
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={onInputChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            required={!isEditMode || formData.password.length > 0}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: 'rgba(100, 255, 218, 0.7)' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={onToggleConfirmPasswordVisibility}
                    edge="end"
                    sx={{
                      color: 'rgba(100, 255, 218, 0.7)',
                      '&:hover': {
                        backgroundColor: 'rgba(100, 255, 218, 0.05)',
                      },
                    }}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
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
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <Divider sx={{ my: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

          <RoleSelector
            selectedRoles={formData.roles}
            onChange={onRoleChange}
            error={errors.roles}
          />
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <Divider sx={{ my: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isBlocked}
                onChange={onInputChange}
                name="isBlocked"
                sx={{
                  color: 'rgba(255, 82, 82, 0.5)',
                  '&.Mui-checked': {
                    color: 'error.light',
                  },
                }}
              />
            }
            label="Block User"
            sx={{
              '& .MuiFormControlLabel-label': {
                color: formData.isBlocked ? 'error.light' : 'text.secondary',
              },
            }}
          />
          {formData.isBlocked && (
            <Typography
              variant="caption"
              color="error.light"
              sx={{ display: 'block', mt: 0.5 }}
            >
              Blocked users cannot access the system until unblocked.
            </Typography>
          )}
        </Grid2>
      </Grid2>

      {/* Form buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 4,
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          color="error"
          onClick={onCancel}
          startIcon={<CancelIcon />}
          disabled={submitLoading}
          sx={{
            borderColor: 'rgba(255, 82, 82, 0.3)',
            '&:hover': {
              borderColor: 'rgba(255, 82, 82, 0.5)',
              backgroundColor: 'rgba(255, 82, 82, 0.05)',
            },
          }}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={
            submitLoading ? <CircularProgress size={20} /> : <SaveIcon />
          }
          disabled={submitLoading || (!formTouched && isEditMode)}
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
          {submitLoading
            ? 'Saving...'
            : isEditMode
            ? 'Save Changes'
            : 'Create User'}
        </Button>
      </Box>
    </Box>
  );
};

export default UserForm;
