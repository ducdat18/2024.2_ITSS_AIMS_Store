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
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Waves as WavesIcon,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#010e1a',
        backgroundImage: 'linear-gradient(to bottom, #01111d, #010a14)',
        color: '#e6f1ff',
        mt: 'auto',
        pt: 6,
        pb: 3,
        borderTop: '1px solid rgba(100, 255, 218, 0.1)',
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Container>
        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Box className="first-item">
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 'bold',
                  color: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <WavesIcon sx={{ mr: 1 }} />
                AIMS Store
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Link
                    component={RouterLink}
                    to="/about"
                    color="inherit"
                    sx={{
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: 'primary.light',
                      },
                    }}
                  >
                    About AIMS
                  </Link>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Link
                    href="mailto:info@aims.com"
                    color="inherit"
                    sx={{
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: 'primary.light',
                      },
                    }}
                  >
                    Email: trangntt@soict.hust.edu.vn
                  </Link>
                </Box>
                <Box component="li">
                  <Link
                    href="tel:+01234567890"
                    color="inherit"
                    sx={{
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: 'primary.light',
                      },
                    }}
                  >
                    Phone: (+84) 123-456-7890
                  </Link>
                </Box>
              </Box>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 'bold', color: 'primary.light' }}
            >
              Shop By Category
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/products?category=BOOK"
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: 'primary.light',
                    },
                  }}
                >
                  Books
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/products?category=CD"
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: 'primary.light',
                    },
                  }}
                >
                  CDs
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/products?category=LP"
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: 'primary.light',
                    },
                  }}
                >
                  LP Records
                </Link>
              </Box>
              <Box component="li">
                <Link
                  component={RouterLink}
                  to="/products?category=DVD"
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: 'primary.light',
                    },
                  }}
                >
                  DVDs
                </Link>
              </Box>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 'bold', color: 'primary.light' }}
            >
              Customer Service
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/contact"
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: 'primary.light',
                    },
                  }}
                >
                  Contact Us
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/shipping"
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: 'primary.light',
                    },
                  }}
                >
                  Shipping Information
                </Link>
              </Box>
              <Box component="li">
                <Link
                  component={RouterLink}
                  to="/terms"
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: 'primary.light',
                    },
                  }}
                >
                  Terms & Conditions
                </Link>
              </Box>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 'bold', color: 'primary.light' }}
            >
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link
                href="#"
                color="inherit"
                aria-label="Facebook"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(100, 255, 218, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(100, 255, 218, 0.2)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                <Facebook />
              </Link>
              <Link
                href="#"
                color="inherit"
                aria-label="Twitter"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(100, 255, 218, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(100, 255, 218, 0.2)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                <Twitter />
              </Link>
              <Link
                href="#"
                color="inherit"
                aria-label="Instagram"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(100, 255, 218, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(100, 255, 218, 0.2)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                <Instagram />
              </Link>
              <Link
                href="#"
                color="inherit"
                aria-label="LinkedIn"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(100, 255, 218, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(100, 255, 218, 0.2)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                <LinkedIn />
              </Link>
            </Box>
          </Grid2>
        </Grid2>

        <Divider sx={{ borderColor: 'rgba(100, 255, 218, 0.1)', my: 3 }} />

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
