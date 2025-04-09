import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid2,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Divider,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  Checkbox,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
import { Address } from '../../types';

// Mock provinces for dropdown
const vietnamProvinces = [
  'Hanoi',
  'Ho Chi Minh City',
  'Da Nang',
  'Hai Phong',
  'Can Tho',
  'An Giang',
  'Ba Ria - Vung Tau',
  'Bac Giang',
  'Bac Kan',
  'Bac Lieu',
  'Bac Ninh',
  'Ben Tre',
  'Binh Dinh',
  'Binh Duong',
  'Binh Phuoc',
  'Binh Thuan',
  'Ca Mau',
  'Cao Bang',
  'Dak Lak',
  'Dak Nong',
  'Dien Bien',
  'Dong Nai',
  'Dong Thap',
  'Gia Lai',
  'Ha Giang',
  'Ha Nam',
  'Ha Tinh',
  'Hai Duong',
  'Hau Giang',
  'Hoa Binh',
  'Hung Yen',
  'Khanh Hoa',
  'Kien Giang',
  'Kon Tum',
  'Lai Chau',
  'Lam Dong',
  'Lang Son',
  'Lao Cai',
  'Long An',
  'Nam Dinh',
  'Nghe An',
  'Ninh Binh',
  'Ninh Thuan',
  'Phu Tho',
  'Phu Yen',
  'Quang Binh',
  'Quang Nam',
  'Quang Ngai',
  'Quang Ninh',
  'Quang Tri',
  'Soc Trang',
  'Son La',
  'Tay Ninh',
  'Thai Binh',
  'Thai Nguyen',
  'Thanh Hoa',
  'Thua Thien Hue',
  'Tien Giang',
  'Tra Vinh',
  'Tuyen Quang',
  'Vinh Long',
  'Vinh Phuc',
  'Yen Bai',
];

// Mock saved addresses
const mockAddresses: Address[] = [
  {
    id: 'addr-001',
    userId: 'user-010',
    name: 'Home Address',
    phone: '0901234567',
    province: 'Hanoi',
    address: '123 Cau Giay Street, Cau Giay District',
    isDefault: true,
  },
  {
    id: 'addr-002',
    userId: 'user-010',
    name: 'Office Address',
    phone: '0909876543',
    province: 'Hanoi',
    address: '456 Tran Duy Hung Street, Cau Giay District',
    isDefault: false,
  },
  {
    id: 'addr-003',
    userId: 'user-010',
    name: "Parent's Home",
    phone: '0912345678',
    province: 'Thai Binh',
    address: '789 Main Street, Thai Binh City',
    isDefault: false,
  },
];

const AccountAddressPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState<
    Omit<Address, 'id' | 'userId'>
  >({
    name: '',
    phone: '',
    province: '',
    address: '',
    isDefault: false,
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [savingAddress, setSavingAddress] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    // Simulate loading addresses from API
    const loadAddresses = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAddresses(mockAddresses);
      } catch (error) {
        console.error('Error loading addresses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, []);

  const handleOpenAddressDialog = () => {
    // Reset form when opening dialog to add new address
    setAddressForm({
      name: '',
      phone: '',
      province: '',
      address: '',
      isDefault: false,
    });
    setEditingAddress(null);
    setFormErrors({});
    setOpenAddressDialog(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      name: address.name,
      phone: address.phone,
      province: address.province,
      address: address.address,
      isDefault: address.isDefault,
    });
    setFormErrors({});
    setOpenAddressDialog(true);
  };

  const handleCloseAddressDialog = () => {
    setOpenAddressDialog(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressForm((prev) => ({
      ...prev,
      isDefault: e.target.checked,
    }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!addressForm.name.trim()) {
      errors.name = 'Address name is required';
    }

    if (!addressForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^0\d{9}$/.test(addressForm.phone.replace(/\s/g, ''))) {
      errors.phone = 'Phone number must be 10 digits starting with 0';
    }

    if (!addressForm.province) {
      errors.province = 'Province is required';
    }

    if (!addressForm.address.trim()) {
      errors.address = 'Address is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) {
      return;
    }

    setSavingAddress(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingAddress) {
        // Update existing address
        const updatedAddresses = addresses.map((addr) =>
          addr.id === editingAddress.id
            ? {
                ...addr,
                ...addressForm,
                // If this address is being set as default, make sure others are not default
                isDefault: addressForm.isDefault ? true : addr.isDefault,
              }
            : {
                ...addr,
                // If this address is being set as default, make sure others are not default
                isDefault: addressForm.isDefault ? false : addr.isDefault,
              }
        );
        setAddresses(updatedAddresses);
        setNotification({
          open: true,
          message: 'Address updated successfully',
          severity: 'success',
        });
      } else {
        // Create new address
        const newAddress: Address = {
          id: `addr-${Date.now()}`,
          userId: 'user-010', // Mock user ID
          ...addressForm,
        };

        // If this is the first address, or this address is being set as default
        if (addresses.length === 0 || addressForm.isDefault) {
          newAddress.isDefault = true;
          // Update existing addresses to not be default
          const updatedAddresses = addresses.map((addr) => ({
            ...addr,
            isDefault: false,
          }));
          setAddresses([...updatedAddresses, newAddress]);
        } else {
          setAddresses([...addresses, newAddress]);
        }

        setNotification({
          open: true,
          message: 'Address added successfully',
          severity: 'success',
        });
      }

      handleCloseAddressDialog();
    } catch (error) {
      console.error('Error saving address:', error);
      setNotification({
        open: true,
        message: 'Failed to save address. Please try again.',
        severity: 'error',
      });
    } finally {
      setSavingAddress(false);
    }
  };

  const handleOpenDeleteConfirm = (addressId: string) => {
    setAddressToDelete(addressId);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setAddressToDelete(null);
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const deletedAddress = addresses.find(
        (addr) => addr.id === addressToDelete
      );
      const updatedAddresses = addresses.filter(
        (addr) => addr.id !== addressToDelete
      );

      // If the deleted address was default and we have other addresses, set a new default
      if (deletedAddress?.isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }

      setAddresses(updatedAddresses);
      setNotification({
        open: true,
        message: 'Address deleted successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error deleting address:', error);
      setNotification({
        open: true,
        message: 'Failed to delete address. Please try again.',
        severity: 'error',
      });
    } finally {
      handleCloseDeleteConfirm();
    }
  };

  const handleSetAsDefault = async (addressId: string) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));

      setAddresses(updatedAddresses);
      setNotification({
        open: true,
        message: 'Default address updated successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating default address:', error);
      setNotification({
        open: true,
        message: 'Failed to update default address. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: 5,
          textAlign: 'center',
          height: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <WavesIcon
          sx={{
            fontSize: 60,
            color: 'primary.light',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(0.95)',
                opacity: 0.7,
              },
              '70%': {
                transform: 'scale(1.1)',
                opacity: 1,
              },
              '100%': {
                transform: 'scale(0.95)',
                opacity: 0.7,
              },
            },
          }}
        />
        <Typography
          variant="h5"
          sx={{
            color: 'text.secondary',
            fontWeight: 'medium',
          }}
        >
          Loading your addresses...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 4, md: 5 },
        position: 'relative',
        overflow: 'hidden',
        minHeight: '70vh',
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
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: 60,
                height: 3,
                background:
                  'linear-gradient(90deg, rgba(100, 255, 218, 0.7), rgba(100, 255, 218, 0.1))',
                borderRadius: 2,
              },
            }}
          >
            <LocationIcon /> My Addresses
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddressDialog}
            sx={{
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
            Add New Address
          </Button>
        </Box>

        {addresses.length === 0 ? (
          <Paper
            elevation={3}
            sx={{
              p: 5,
              textAlign: 'center',
              backgroundImage:
                'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
              borderRadius: 2,
              border: '1px solid rgba(100, 255, 218, 0.1)',
            }}
          >
            <LocationIcon
              sx={{
                fontSize: 60,
                color: 'primary.light',
                mb: 2,
                opacity: 0.5,
              }}
            />
            <Typography variant="h5" color="primary.light" gutterBottom>
              No saved addresses yet
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}
            >
              Save your addresses to make checkout faster and easier. Your
              shipping addresses will be automatically filled out during
              checkout.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenAddressDialog}
              sx={{
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
              Add New Address
            </Button>
          </Paper>
        ) : (
          <Grid2 container spacing={3}>
            {addresses.map((address) => (
              <Grid2 key={address.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundImage:
                      'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                    border: `1px solid ${
                      address.isDefault
                        ? 'rgba(100, 255, 218, 0.3)'
                        : 'rgba(100, 255, 218, 0.1)'
                    }`,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.5)',
                      borderColor: 'rgba(100, 255, 218, 0.3)',
                    },
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {address.isDefault && (
                    <Chip
                      label="Default"
                      color="primary"
                      size="small"
                      icon={<CheckCircleIcon />}
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 2,
                      }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="primary.light"
                        sx={{
                          fontWeight: 'bold',
                          mb: 1,
                          pr: address.isDefault ? 8 : 0,
                        }}
                      >
                        {address.name}
                      </Typography>
                    </Box>

                    <Divider
                      sx={{
                        mb: 2,
                        borderColor: 'rgba(100, 255, 218, 0.1)',
                      }}
                    />

                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                      >
                        {address.address}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {address.province}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Phone: {address.phone}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions
                    sx={{
                      p: 2,
                      pt: 0,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditAddress(address)}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(100, 255, 218, 0.05)',
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleOpenDeleteConfirm(address.id)}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(255, 82, 82, 0.05)',
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    {!address.isDefault && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleSetAsDefault(address.id)}
                        sx={{
                          borderColor: 'rgba(100, 255, 218, 0.3)',
                          '&:hover': {
                            borderColor: 'rgba(100, 255, 218, 0.5)',
                            backgroundColor: 'rgba(100, 255, 218, 0.05)',
                          },
                        }}
                      >
                        Set as Default
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        )}

        {/* Address Dialog */}
        <Dialog
          open={openAddressDialog}
          onClose={handleCloseAddressDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              backgroundImage:
                'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
              border: '1px solid rgba(100, 255, 218, 0.1)',
            },
          }}
        >
          <DialogTitle sx={{ color: 'primary.light' }}>
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </DialogTitle>
          <DialogContent>
            <Grid2 container spacing={2} sx={{ mt: 0.5 }}>
              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Address Name"
                  name="name"
                  value={addressForm.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Home, Office, etc."
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(1, 22, 39, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(1, 22, 39, 0.5)',
                      },
                      '& fieldset': {
                        borderColor: 'rgba(100, 255, 218, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(100, 255, 218, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(100, 255, 218, 0.7)',
                      },
                    },
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={addressForm.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., 0901234567"
                  error={!!formErrors.phone}
                  helperText={formErrors.phone}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(1, 22, 39, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(1, 22, 39, 0.5)',
                      },
                      '& fieldset': {
                        borderColor: 'rgba(100, 255, 218, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(100, 255, 218, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(100, 255, 218, 0.7)',
                      },
                    },
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <TextField
                  select
                  fullWidth
                  label="Province/City"
                  name="province"
                  value={addressForm.province}
                  onChange={handleInputChange}
                  error={!!formErrors.province}
                  helperText={formErrors.province}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(1, 22, 39, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(1, 22, 39, 0.5)',
                      },
                      '& fieldset': {
                        borderColor: 'rgba(100, 255, 218, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(100, 255, 218, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(100, 255, 218, 0.7)',
                      },
                    },
                  }}
                >
                  {vietnamProvinces.map((province) => (
                    <MenuItem key={province} value={province}>
                      {province}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={addressForm.address}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  placeholder="Street address, apartment, building, etc."
                  error={!!formErrors.address}
                  helperText={formErrors.address}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(1, 22, 39, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(1, 22, 39, 0.5)',
                      },
                      '& fieldset': {
                        borderColor: 'rgba(100, 255, 218, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(100, 255, 218, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(100, 255, 218, 0.7)',
                      },
                    },
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Checkbox
                    checked={addressForm.isDefault}
                    onChange={handleCheckboxChange}
                    color="primary"
                    sx={{
                      color: 'rgba(100, 255, 218, 0.5)',
                      '&.Mui-checked': {
                        color: 'primary.light',
                      },
                    }}
                  />
                  <Typography color="text.primary">
                    Set as default address
                  </Typography>
                </Box>
              </Grid2>
            </Grid2>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCloseAddressDialog} disabled={savingAddress}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveAddress}
              variant="contained"
              color="primary"
              startIcon={
                savingAddress ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
              disabled={savingAddress}
            >
              {savingAddress ? 'Saving...' : 'Save Address'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={handleCloseDeleteConfirm}
          PaperProps={{
            sx: {
              backgroundImage:
                'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
              border: '1px solid rgba(255, 82, 82, 0.3)',
            },
          }}
        >
          <DialogTitle sx={{ color: 'error.light' }}>
            Delete Address
          </DialogTitle>
          <DialogContent>
            <Typography color="text.secondary">
              Are you sure you want to delete this address? This action cannot
              be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
            <Button
              onClick={handleDeleteAddress}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AccountAddressPage;
