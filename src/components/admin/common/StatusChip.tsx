import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { Block as BlockIcon } from '@mui/icons-material';

type StatusType = 'active' | 'blocked' | 'admin' | 'product_manager';

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  status: StatusType;
  icon?: React.ReactElement;
}

const StatusChip: React.FC<StatusChipProps> = ({
  status,
  icon,
  ...chipProps
}) => {
  const getChipProps = () => {
    switch (status) {
      case 'active':
        return {
          label: 'ACTIVE',
          backgroundColor: 'rgba(0, 191, 165, 0.1)',
          color: 'success.light',
          borderColor: 'rgba(0, 191, 165, 0.3)',
        };
      case 'blocked':
        return {
          label: 'BLOCKED',
          backgroundColor: 'rgba(255, 82, 82, 0.1)',
          color: 'error.light',
          borderColor: 'rgba(255, 82, 82, 0.3)',
          icon: <BlockIcon fontSize="small" />,
        };
      case 'admin':
        return {
          label: 'ADMIN',
          backgroundColor: 'rgba(0, 191, 165, 0.1)',
          color: 'success.light',
          borderColor: 'rgba(0, 191, 165, 0.3)',
        };
      case 'product_manager':
        return {
          label: 'PM',
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          color: 'warning.light',
          borderColor: 'rgba(255, 152, 0, 0.3)',
        };
      default:
        return {
          label: (status as string).toUpperCase(),
          backgroundColor: 'rgba(2, 136, 209, 0.1)',
          color: 'primary.light',
          borderColor: 'rgba(2, 136, 209, 0.3)',
        };
    }
  };

  const chipStyles = getChipProps();

  return (
    <Chip
      size="small"
      icon={icon || chipStyles.icon}
      label={chipStyles.label}
      sx={{
        backgroundColor: chipStyles.backgroundColor,
        color: chipStyles.color,
        borderColor: chipStyles.borderColor,
        ...chipProps.sx,
      }}
      {...chipProps}
    />
  );
};

export default StatusChip;
