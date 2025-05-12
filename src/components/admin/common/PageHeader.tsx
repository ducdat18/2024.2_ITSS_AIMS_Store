import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

interface PageHeaderProps {
  title: string;
  icon: React.ReactElement;
  onBackClick?: () => void;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  icon,
  onBackClick,
  actions,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {onBackClick && (
          <Button
            variant="outlined"
            color="primary"
            onClick={onBackClick}
            startIcon={<ArrowBackIcon />}
            sx={{
              mr: 2,
              borderColor: 'rgba(100, 255, 218, 0.3)',
              '&:hover': {
                borderColor: 'rgba(100, 255, 218, 0.5)',
                backgroundColor: 'rgba(100, 255, 218, 0.05)',
              },
            }}
          >
            Back
          </Button>
        )}

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
          {icon} {title}
        </Typography>
      </Box>

      {actions && <Box sx={{ display: 'flex', gap: 2 }}>{actions}</Box>}
    </Box>
  );
};

export default PageHeader;
