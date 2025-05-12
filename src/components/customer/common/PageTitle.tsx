import React from 'react';
import { Typography, Box } from '@mui/material';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  withUnderline?: boolean;
  gradient?: boolean;
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  subtitle,
  icon,
  align = 'left',
  withUnderline = true,
  gradient = false,
}) => {
  return (
    <Box
      sx={{
        mb: 4,
        textAlign: align,
      }}
    >
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
          mb: 1,
          ...(align === 'center' && { justifyContent: 'center' }),
          ...(withUnderline && {
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: align === 'center' ? '50%' : 0,
              transform: align === 'center' ? 'translateX(-50%)' : 'none',
              width: align === 'center' ? 60 : 60,
              height: 3,
              background:
                'linear-gradient(90deg, rgba(100, 255, 218, 0.7), rgba(100, 255, 218, 0.1))',
              borderRadius: 2,
            },
          }),
          ...(gradient && {
            backgroundImage: 'linear-gradient(45deg, #64ffda, #0288d1)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 5px 25px rgba(100, 255, 218, 0.2)',
          }),
        }}
      >
        {icon}
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            maxWidth: 700,
            mx: align === 'center' ? 'auto' : 0,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default PageTitle;
