import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2,
  Paper,
  Divider,
  Button,
} from '@mui/material';
import {
  Waves as WavesIcon,
  Schedule as ScheduleIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  RestartAlt as RestartAltIcon,
  Storage as StorageIcon,
  Book as BookIcon,
  Album as CDIcon,
  Radio as LPIcon,
  MovieCreation as DVDIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  // Features data
  const features = [
    {
      icon: <ScheduleIcon />,
      title: 'Available 24/7',
      description:
        'Our platform operates round the clock, allowing you to shop for your favorite media products anytime.',
    },
    {
      icon: <PeopleIcon />,
      title: 'Serves 1,000+ Users',
      description:
        'We can simultaneously serve up to 1,000 customers without any performance impact.',
    },
    {
      icon: <StorageIcon />,
      title: 'Extensive Collection',
      description:
        'Browse our vast collection of books, CDs, LP records, and DVDs from various genres and categories.',
    },
    {
      icon: <SpeedIcon />,
      title: 'Fast Response Time',
      description:
        'Experience quick response times - maximum 2 seconds under normal conditions and 5 seconds during peak hours.',
    },
    {
      icon: <RestartAltIcon />,
      title: 'Reliable Service',
      description:
        'Our platform can operate continuously for 300 hours without failure and quickly resume after incidents.',
    },
  ];

  // Media categories
  const categories = [
    {
      icon: <BookIcon sx={{ fontSize: 40, color: 'primary.light' }} />,
      title: 'Book',
      details:
        'Paperback and hardcover books with detailed information about authors, publishers, and genres.',
    },
    {
      icon: <CDIcon sx={{ fontSize: 40, color: 'primary.light' }} />,
      title: 'CD',
      details:
        'Music collections and albums with artist information, record labels, tracklists, and genres.',
    },
    {
      icon: <LPIcon sx={{ fontSize: 40, color: 'primary.light' }} />,
      title: 'LP Record',
      details:
        'Vinyl records with artist information, comprehensive details about record labels and tracklists.',
    },
    {
      icon: <DVDIcon sx={{ fontSize: 40, color: 'primary.light' }} />,
      title: 'DVD',
      details:
        'Blu-ray and HD-DVD discs with information about directors, runtime, studios, languages, and subtitles.',
    },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
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
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          py: 10,
          position: 'relative',
          backgroundImage:
            'linear-gradient(135deg, #011627 0%, #01111d 50%, #010a14 100%)',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'radial-gradient(circle at 20% 150%, rgba(2, 136, 209, 0.15) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(100, 255, 218, 0.1) 0%, transparent 60%)',
            zIndex: 1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            height: '40%',
            width: '100%',
            bottom: '-5%',
            left: 0,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 1200 120' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 C150,120 350,0 500,100 C650,200 700,0 1200,80 L1200,120 L0,120 Z' style='fill:%23011627;'/%3E%3C/svg%3E\")",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 2,
            opacity: 0.5,
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 5,
            textAlign: 'center',
          }}
        >
          <WavesIcon
            sx={{
              fontSize: 60,
              color: 'primary.light',
              mb: 2,
              filter: 'drop-shadow(0 0 10px rgba(100, 255, 218, 0.5))',
            }}
          />
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              backgroundImage: 'linear-gradient(45deg, #64ffda, #0288d1)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 5px 25px rgba(100, 255, 218, 0.2)',
            }}
          >
            About AIMS
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              maxWidth: 800,
              mx: 'auto',
              mb: 4,
              fontWeight: 'normal',
            }}
          >
            An Internet Media Store dedicated to bringing you the finest
            collection of physical media products
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/products')}
            sx={{
              px: 4,
              py: 1.5,
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'all 0.6s',
              },
              '&:hover::after': {
                left: '100%',
              },
            }}
          >
            Explore Our Collection
          </Button>
        </Container>
      </Box>

      {/* Our Mission Section */}
      <Container
        maxWidth="lg"
        sx={{
          py: 8,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Grid2 container spacing={6} alignItems="center">
          <Grid2 size={{ xs: 12, md: 6 }} order={{ xs: 2, md: 1 }}>
            <Typography
              variant="h3"
              sx={{
                mb: 3,
                fontWeight: 'bold',
                color: 'primary.light',
              }}
            >
              Our Mission
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                fontSize: '1.1rem',
                color: 'text.secondary',
                lineHeight: 1.8,
              }}
            >
              AIMS is a comprehensive e-commerce platform designed to provide
              customers with high-quality physical media products. We believe in
              the enduring value of physical media in an increasingly digital
              world.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                fontSize: '1.1rem',
                color: 'text.secondary',
                lineHeight: 1.8,
              }}
            >
              Our software operates 24/7, allowing new users to easily
              familiarize themselves with our extensive catalog. We pride
              ourselves on our ability to serve up to 1,000 customers
              simultaneously without significant performance reduction.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.1rem',
                color: 'text.secondary',
                lineHeight: 1.8,
              }}
            >
              Each product in our collection is carefully cataloged with
              detailed information to help you make informed decisions, whether
              you're looking for books, CDs, vinyl records, or DVDs.
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }} order={{ xs: 1, md: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: 400,
                  borderRadius: 4,
                  position: 'relative',
                  backgroundImage:
                    'linear-gradient(135deg, rgba(2, 136, 209, 0.1) 0%, rgba(0, 96, 100, 0.1) 100%)',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid rgba(100, 255, 218, 0.1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage:
                      'radial-gradient(circle at 50% 50%, rgba(100, 255, 218, 0.15) 0%, transparent 70%)',
                    zIndex: 1,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 2,
                  }}
                >
                  <WavesIcon
                    sx={{
                      fontSize: 100,
                      color: 'primary.light',
                      mb: 2,
                      opacity: 0.7,
                    }}
                  />
                  <Typography
                    variant="h4"
                    align="center"
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.light',
                      maxWidth: 300,
                    }}
                  >
                    Dive into the world of physical media
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid2>
        </Grid2>
      </Container>

      {/* Key Features Section */}
      <Box
        sx={{
          py: 8,
          backgroundColor: 'rgba(13, 37, 56, 0.3)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{
              mb: 6,
              fontWeight: 'bold',
              color: 'primary.light',
            }}
          >
            Key Features
          </Typography>
          <Grid2 container spacing={4}>
            {features.map((feature, index) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    height: '100%',
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    backgroundImage:
                      'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                    border: '1px solid rgba(100, 255, 218, 0.1)',
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                    },
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundImage:
                        'radial-gradient(circle at 50% 30%, rgba(2, 136, 209, 0.08) 0%, transparent 70%)',
                      opacity: 0.8,
                      zIndex: 1,
                    },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: 'rgba(100, 255, 218, 0.1)',
                      width: 70,
                      height: 70,
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: 3,
                      color: 'primary.light',
                      zIndex: 2,
                    }}
                  >
                    {React.cloneElement(feature.icon, { fontSize: 'large' })}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 2,
                      fontWeight: 'bold',
                      color: 'primary.light',
                      zIndex: 2,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      zIndex: 2,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid2>
            ))}
          </Grid2>
        </Container>
      </Box>

      {/* Product Categories Section */}
      <Container
        maxWidth="lg"
        sx={{
          py: 8,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            mb: 6,
            fontWeight: 'bold',
            color: 'primary.light',
            textAlign: 'center',
          }}
        >
          Our Product Categories
        </Typography>
        <Grid2 container spacing={4}>
          {categories.map((category, index) => (
            <Grid2 size={{ xs: 12, sm: 6 }} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  backgroundImage:
                    'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                  border: '1px solid rgba(100, 255, 218, 0.1)',
                  borderRadius: 2,
                  height: '100%',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                  },
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage:
                      'radial-gradient(circle at 20% 20%, rgba(2, 136, 209, 0.08) 0%, transparent 70%)',
                    opacity: 0.8,
                    zIndex: 1,
                  },
                }}
                onClick={() =>
                  navigate(`/products?category=${category.title.toUpperCase()}`)
                }
              >
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {category.icon}
                    <Typography
                      variant="h5"
                      sx={{
                        ml: 2,
                        fontWeight: 'bold',
                        color: 'primary.light',
                      }}
                    >
                      {category.title}
                    </Typography>
                  </Box>
                  <Divider
                    sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      color: 'text.secondary',
                    }}
                  >
                    {category.details}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                        `/products?category=${category.title.toUpperCase()}`
                      );
                    }}
                    sx={{
                      mt: 1,
                      borderColor: 'rgba(100, 255, 218, 0.3)',
                      '&:hover': {
                        borderColor: 'rgba(100, 255, 218, 0.5)',
                        backgroundColor: 'rgba(100, 255, 218, 0.05)',
                      },
                    }}
                  >
                    Browse {category.title}
                  </Button>
                </Box>
              </Paper>
            </Grid2>
          ))}
        </Grid2>
      </Container>

      {/* Contact CTA Section */}
      <Box
        sx={{
          py: 8,
          backgroundColor: 'rgba(13, 37, 56, 0.3)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={3}
            sx={{
              p: 5,
              textAlign: 'center',
              backgroundImage:
                'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
              border: '1px solid rgba(100, 255, 218, 0.1)',
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage:
                  'radial-gradient(circle at 50% 50%, rgba(2, 136, 209, 0.1) 0%, transparent 70%)',
                opacity: 0.8,
                zIndex: 1,
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  fontWeight: 'bold',
                  color: 'primary.light',
                }}
              >
                Ready to Explore Our Collection?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  color: 'text.secondary',
                  maxWidth: 600,
                  mx: 'auto',
                }}
              >
                Dive into our extensive collection of books, CDs, LP records,
                and DVDs. Find your next favorite media product with AIMS.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/products')}
                  sx={{
                    px: 4,
                    py: 1.2,
                    minWidth: { xs: '100%', sm: 200 },
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background:
                        'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      transition: 'all 0.6s',
                    },
                    '&:hover::after': {
                      left: '100%',
                    },
                  }}
                >
                  Browse Products
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/contact')}
                  sx={{
                    px: 4,
                    py: 1.2,
                    minWidth: { xs: '100%', sm: 200 },
                    borderColor: 'rgba(100, 255, 218, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(100, 255, 218, 0.5)',
                      backgroundColor: 'rgba(100, 255, 218, 0.05)',
                    },
                  }}
                >
                  Contact Us
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;
