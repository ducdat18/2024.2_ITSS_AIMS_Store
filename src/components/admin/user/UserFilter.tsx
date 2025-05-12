import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment,
  IconButton,
  Chip,
  Paper,
  Typography,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

interface UserFiltersProps {
  searchQuery: string;
  roleFilter: string;
  statusFilter: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRoleFilterChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  onStatusFilterChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  onClearSearch: () => void;
  onClearFilters: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchQuery,
  roleFilter,
  statusFilter,
  onSearchChange,
  onRoleFilterChange,
  onStatusFilterChange,
  onClearSearch,
  onClearFilters,
}) => {
  const hasActiveFilters =
    roleFilter !== 'ALL' || statusFilter !== 'ALL' || searchQuery !== '';

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
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
          onChange={onSearchChange}
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
                  onClick={onClearSearch}
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
            onChange={onRoleFilterChange as any}
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
            onChange={onStatusFilterChange as any}
            label="Status"
            sx={{ minWidth: '120px' }}
          >
            <MenuItem value="ALL">All Status</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="BLOCKED">Blocked</MenuItem>
          </Select>
        </FormControl>

        {/* Clear filters button - only show if filters are active */}
        {hasActiveFilters && (
          <Button
            variant="outlined"
            color="primary"
            onClick={onClearFilters}
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
      {hasActiveFilters && (
        <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Active Filters:
          </Typography>

          {roleFilter !== 'ALL' && (
            <Chip
              label={`Role: ${roleFilter}`}
              size="small"
              onDelete={() => {
                const event = {
                  target: { value: 'ALL' },
                } as React.ChangeEvent<{ value: unknown }>;
                onRoleFilterChange(event);
              }}
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
              onDelete={() => {
                const event = {
                  target: { value: 'ALL' },
                } as React.ChangeEvent<{ value: unknown }>;
                onStatusFilterChange(event);
              }}
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
                  statusFilter === 'BLOCKED' ? 'error.light' : 'success.light',
              }}
            />
          )}

          {searchQuery && (
            <Chip
              label={`Search: ${searchQuery}`}
              size="small"
              onDelete={onClearSearch}
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
  );
};

export default UserFilters;
