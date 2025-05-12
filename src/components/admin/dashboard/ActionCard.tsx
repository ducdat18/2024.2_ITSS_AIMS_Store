import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactElement<{ sx?: object }>;
  color: 'primary' | 'success' | 'warning' | 'error';
  linkTo: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  color,
  linkTo,
}) => {
  const navigate = useNavigate();

  const getColorStyles = () => {
    switch (color) {
      case 'success':
        return {
          iconColor: 'success.light',
          gradient:
            'radial-gradient(circle at 50% 50%, rgba(0, 191, 165, 0.1) 0%, transparent 70%)',
        };
      case 'warning':
        return {
          iconColor: 'warning.light',
          gradient:
            'radial-gradient(circle at 50% 50%, rgba(255, 152, 0, 0.1) 0%, transparent 70%)',
        };
      case 'error':
        return {
          iconColor: 'error.light',
          gradient:
            'radial-gradient(circle at 50% 50%, rgba(255, 82, 82, 0.1) 0%, transparent 70%)',
        };
      default:
        return {
          iconColor: 'primary.light',
          gradient:
            'radial-gradient(circle at 50% 50%, rgba(2, 136, 209, 0.1) 0%, transparent 70%)',
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
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s',
        cursor: 'pointer',
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
      onClick={() => navigate(linkTo)}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        {React.cloneElement(icon, {
          sx: {
            fontSize: 48,
            color: colorStyles.iconColor,
            mb: 2,
          } as object,
        })}
        <Typography variant="h6" color={colorStyles.iconColor} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ActionCard;
