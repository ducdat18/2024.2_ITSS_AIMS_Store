import React from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';
import { Waves as WavesIcon } from '@mui/icons-material';

interface SectionContainerProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  sx?: object;
  divider?: boolean;
  titleColor?: string;
  withAnimation?: boolean;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  title,
  icon = <WavesIcon fontSize="small" />,
  children,
  sx = {},
  divider = true,
  titleColor = 'primary.light',
  withAnimation = false,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        mb: 4,
        backgroundImage: 'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
        borderRadius: 2,
        border: '1px solid rgba(100, 255, 218, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        ...(withAnimation && {
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage:
              'radial-gradient(circle at 50% 0%, rgba(2, 136, 209, 0.08) 0%, transparent 70%)',
            opacity: 0.8,
            zIndex: 1,
          },
        }),
        ...sx,
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        {title && (
          <>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: titleColor,
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {icon}
              {title}
            </Typography>
            {divider && (
              <Divider
                sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }}
              />
            )}
          </>
        )}
        {children}
      </Box>
    </Paper>
  );
};

export default SectionContainer;
