import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  link?: string;
}

interface CustomBreadcrumbsProps {
  items: BreadcrumbItem[];
  mb?: number;
}

const CustomBreadcrumbs: React.FC<CustomBreadcrumbsProps> = ({
  items,
  mb = 3,
}) => {
  return (
    <Breadcrumbs
      sx={{
        mb,
        '& .MuiBreadcrumbs-separator': {
          color: 'rgba(100, 255, 218, 0.3)',
        },
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return isLast ? (
          <Typography key={`${item.label}-${index}`} color="primary.light">
            {item.label}
          </Typography>
        ) : (
          <Link
            key={`${item.label}-${index}`}
            component={RouterLink}
            to={item.link || '#'}
            color="inherit"
            sx={{
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.light',
              },
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default CustomBreadcrumbs;
