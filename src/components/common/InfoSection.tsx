import React from 'react';
import {
  Box,
  Container,
  Grid2,
  Typography,
  TextField,
  Button,
  Link,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const InfoSection: React.FC = () => {
  return (
    <Box
      component="section"
      className="info_section long_section"
      sx={{
        backgroundColor: '#191e1f',
        color: '#ffffff',
        py: 5,
      }}
    >
      <Container>
        {/* Contact Navigation */}
        <Box
          className="contact_nav"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 2,
            textAlign: 'center',
            flexWrap: { xs: 'wrap', md: 'nowrap' },
          }}
        >
          <Link
            href="tel:+01123456789"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              color: '#ffffff',
              flex: 1,
              textDecoration: 'none',
              mb: { xs: 2, md: 0 },
              '&:hover': { color: (theme) => theme.palette.secondary.main },
            }}
          >
            <PhoneIcon sx={{ fontSize: 28, mr: { sm: 1 } }} />
            <Typography>Call: +01 12345 67890</Typography>
          </Link>

          <Link
            href="mailto:demo@aims.com"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              color: '#ffffff',
              flex: 1,
              textDecoration: 'none',
              mb: { xs: 2, md: 0 },
              '&:hover': { color: (theme) => theme.palette.secondary.main },
            }}
          >
            <EmailIcon sx={{ fontSize: 28, mr: { sm: 1 } }} />
            <Typography>Email: info@aims.com</Typography>
          </Link>

          <Link
            href="#"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              color: '#ffffff',
              flex: 1,
              textDecoration: 'none',
              '&:hover': { color: (theme) => theme.palette.secondary.main },
            }}
          >
            <LocationIcon sx={{ fontSize: 28, mr: { sm: 1 } }} />
            <Typography>Location</Typography>
          </Link>
        </Box>

        {/* Info Content */}
        <Box className="info_top" sx={{ py: 4 }}>
          <Grid2 container spacing={4}>
            <Grid2 size={{ xs: 12, md: 4, sm: 6, lg: 3 }}>
              <Box className="info_links">
                <Typography
                  variant="h4"
                  sx={{
                    textTransform: 'uppercase',
                    position: 'relative',
                    mb: 3,
                  }}
                >
                  QUICK LINKS
                </Typography>
                <Box
                  className="info_links_menu"
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}
                >
                  {[
                    { label: 'Home', path: '/' },
                    { label: 'Books', path: '/products/category/BOOK' },
                    { label: 'CDs', path: '/products/category/CD' },
                    { label: 'LP Records', path: '/products/category/LP' },
                    { label: 'DVDs', path: '/products/category/DVD' },
                    { label: 'About Us', path: '/about' },
                    { label: 'Contact', path: '/contact' },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      component={RouterLink}
                      to={item.path}
                      sx={{
                        color: '#ffffff',
                        textDecoration: 'none',
                        flexBasis: { xs: '100%', md: '50%' },
                        mb: 1,
                        '&:hover': {
                          color: (theme) => theme.palette.secondary.main,
                        },
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </Box>
              </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4, sm: 6, lg: 3 }} sx={{ mx: 'auto' }}>
              <Box className="info_post">
                <Typography variant="h5" sx={{ mb: 2 }}>
                  FEATURED PRODUCTS
                </Typography>
                <Box
                  className="post_box"
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  {/* Product thumbnails would go here */}
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Box
                      key={item}
                      className="img-box"
                      sx={{
                        minWidth: 65,
                        maxWidth: 65,
                        height: 65,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#ffffff',
                        flexBasis: 'calc(33% - 10px)',
                        p: 1,
                        m: 0.5,
                      }}
                    >
                      {/* Placeholder for product image */}
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#e0e0e0',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <Box className="info_form">
                <Typography variant="h4" sx={{ mb: 2 }}>
                  SIGN UP TO OUR NEWSLETTER
                </Typography>
                <Box component="form" sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Enter Your Email"
                    variant="filled"
                    sx={{
                      mb: 2,
                      backgroundColor: '#eaeaea',
                      color: '#101010',
                      '& .MuiFilledInput-input': {
                        p: '12px 12px',
                      },
                      '& .MuiFilledInput-root': {
                        backgroundColor: '#eaeaea',
                        '&:hover': {
                          backgroundColor: '#eaeaea',
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#eaeaea',
                        },
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    sx={{ px: 4 }}
                  >
                    Subscribe
                  </Button>
                </Box>

                <Box
                  className="social_box"
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    mt: 3,
                  }}
                >
                  {[
                    { icon: <FacebookIcon />, label: 'Facebook' },
                    { icon: <TwitterIcon />, label: 'Twitter' },
                    { icon: <LinkedInIcon />, label: 'LinkedIn' },
                    { icon: <InstagramIcon />, label: 'Instagram' },
                  ].map((item, index) => (
                    <Link
                      key={index}
                      href="#"
                      aria-label={item.label}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '5px',
                        width: 45,
                        height: 45,
                        border: '1px solid',
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        fontSize: 18,
                        mr: 1,
                        '&:hover': {
                          color: (theme) => theme.palette.secondary.main,
                          borderColor: (theme) => theme.palette.secondary.main,
                        },
                      }}
                    >
                      {item.icon}
                    </Link>
                  ))}
                </Box>
              </Box>
            </Grid2>
          </Grid2>
        </Box>
      </Container>
    </Box>
  );
};

export default InfoSection;
