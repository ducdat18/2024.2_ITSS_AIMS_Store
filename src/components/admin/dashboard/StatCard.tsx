import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactElement;
  color: 'primary' | 'success' | 'warning' | 'error';
  linkTo: string;
  linkText: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  count,
  icon,
  color,
  linkTo,
  linkText,
}) => {
  const navigate = useNavigate();

  const getColorStyles = () => {
    switch (color) {
      case 'success':
        return {
          iconBg: 'rgba(0, 191, 165, 0.1)',
          iconColor: 'success.light',
          borderColor: 'rgba(0, 191, 165, 0.3)',
          gradient:
            'radial-gradient(circle at 30% 30%, rgba(0, 191, 165, 0.1) 0%, transparent 70%)',
        };
      case 'warning':
        return {
          iconBg: 'rgba(255, 152, 0, 0.1)',
          iconColor: 'warning.light',
          borderColor: 'rgba(255, 152, 0, 0.3)',
          gradient:
            'radial-gradient(circle at 30% 30%, rgba(255, 152, 0, 0.1) 0%, transparent 70%)',
        };
      case 'error':
        return {
          iconBg: 'rgba(255, 82, 82, 0.1)',
          iconColor: 'error.light',
          borderColor: 'rgba(255, 82, 82, 0.3)',
          gradient:
            'radial-gradient(circle at 30% 30%, rgba(255, 82, 82, 0.1) 0%, transparent 70%)',
        };
      default:
        return {
          iconBg: 'rgba(100, 255, 218, 0.1)',
          iconColor: 'primary.light',
          borderColor: 'rgba(100, 255, 218, 0.3)',
          gradient:
            'radial-gradient(circle at 30% 30%, rgba(2, 136, 209, 0.1) 0%, transparent 70%)',
        };
    }
  };

  const colorStyles = getColorStyles();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundImage: 'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
        border: '1px solid rgba(100, 255, 218, 0.1)',
        height: '100%',
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
          backgroundImage: colorStyles.gradient,
          zIndex: 1,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              backgroundColor: colorStyles.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            <Box sx={{ color: colorStyles.iconColor, fontSize: 28 }}>
              {React.cloneElement(icon)}
            </Box>
          </Box>
          <Box>
            <Typography
              variant="h4"
              color={colorStyles.iconColor}
              fontWeight="bold"
            >
              {count}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
        <Button
          fullWidth
          variant="outlined"
          color={color}
          size="small"
          onClick={() => navigate(linkTo)}
          sx={{
            mt: 1,
            borderColor: colorStyles.borderColor,
            '&:hover': {
              borderColor: colorStyles.borderColor.replace('0.3', '0.5'),
              backgroundColor: colorStyles.iconBg,
            },
          }}
        >
          {linkText}
        </Button>
      </Box>
    </Paper>
  );
};

export default StatCard;
