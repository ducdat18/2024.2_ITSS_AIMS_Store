import React from 'react';
import { Box, Container } from '@mui/material';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  py?:
    | number
    | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  withBackground?: boolean;
  minHeight?: string | number;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 'lg',
  py = { xs: 4, md: 5 },
  withBackground = true,
  minHeight = 'auto',
}) => {
  return (
    <Box
      sx={{
        py,
        position: 'relative',
        overflow: 'hidden',
        minHeight,
        ...(withBackground && {
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(2, 136, 209, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(100, 255, 218, 0.05) 0%, transparent 50%)',
            zIndex: 1,
          },
        }),
      }}
    >
      <Container
        maxWidth={maxWidth}
        sx={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default PageContainer;
