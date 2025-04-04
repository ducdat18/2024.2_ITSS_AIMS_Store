// src/components/layout/Footer.tsx
import React from 'react';
import {
  Box,
  Container,
  Grid2,
  Typography,
  Link,
  Divider,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'secondary.main', // Changed to secondary.main (dark color)
        color: 'white',
        mt: 'auto',
        pt: 6,
        pb: 3,
      }}
    >
      <Container>
        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Box className="first-item">
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                AIMS Store
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Link
                    component={RouterLink}
                    to="/about"
                    color="inherit"
                    sx={{ textDecoration: 'none' }}
                  >
                    About AIMS
                  </Link>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Link
                    href="mailto:info@aims.com"
                    color="inherit"
                    sx={{ textDecoration: 'none' }}
                  >
                    Email: trangntt@soict.hust.edu.vn
                  </Link>
                </Box>
                <Box component="li">
                  <Link
                    href="tel:+01234567890"
                    color="inherit"
                    sx={{ textDecoration: 'none' }}
                  >
                    Phone: (+84) 123-456-7890
                  </Link>
                </Box>
              </Box>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Shop By Category
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/products/category/BOOK"
                  color="inherit"
                  sx={{ textDecoration: 'none' }}
                >
                  Books
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/products/category/CD"
                  color="inherit"
                  sx={{ textDecoration: 'none' }}
                >
                  CDs
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/products/category/LP"
                  color="inherit"
                  sx={{ textDecoration: 'none' }}
                >
                  LP Records
                </Link>
              </Box>
              <Box component="li">
                <Link
                  component={RouterLink}
                  to="/products/category/DVD"
                  color="inherit"
                  sx={{ textDecoration: 'none' }}
                >
                  DVDs
                </Link>
              </Box>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Customer Service
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/contact"
                  color="inherit"
                  sx={{ textDecoration: 'none' }}
                >
                  Contact Us
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/shipping"
                  color="inherit"
                  sx={{ textDecoration: 'none' }}
                >
                  Shipping Information
                </Link>
              </Box>
              <Box component="li">
                <Link
                  component={RouterLink}
                  to="/terms"
                  color="inherit"
                  sx={{ textDecoration: 'none' }}
                >
                  Terms & Conditions
                </Link>
              </Box>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="#" color="inherit" aria-label="Facebook">
                <Facebook />
              </Link>
              <Link href="#" color="inherit" aria-label="Twitter">
                <Twitter />
              </Link>
              <Link href="#" color="inherit" aria-label="Instagram">
                <Instagram />
              </Link>
              <Link href="#" color="inherit" aria-label="LinkedIn">
                <LinkedIn />
              </Link>
            </Box>
          </Grid2>
        </Grid2>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 3 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
            &copy; {currentYear} AIMS - An Internet Media Store. All Rights
            Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
