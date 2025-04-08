// src/pages/productManager/ProductListPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Book as BookIcon,
  Album as CDIcon,
  Radio as LPIcon,
  MovieCreation as DVDIcon,
  ArrowBack as ArrowBackIcon,
  Waves as WavesIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { mockApiService } from '../../mock/mockApi';
import { Product, ProductCategory } from '../../types';
import { formatCurrency } from '../../utils/formatters';

const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] =
    useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await mockApiService.getProducts();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, categoryFilter, products]);

  const filterProducts = () => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.barcode.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter.length > 0) {
      result = result.filter((product) =>
        categoryFilter.includes(product.category)
      );
    }

    setFilteredProducts(result);
    setPage(0); // Reset to first page when filter changes
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryFilterChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setCategoryFilter(event.target.value as string[]);
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        // In a real app, this would call an API
        const updatedProducts = products.filter(
          (product) => product.id !== productToDelete
        );
        setProducts(updatedProducts);
        setSnackbar({
          open: true,
          message: 'Product deleted successfully',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to delete product',
          severity: 'error',
        });
      }
    }
    setOpenDeleteDialog(false);
    setProductToDelete(null);
  };

  const handleSelectionChange = (productId: string) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        if (prev.length < 10) {
          // Maximum 10 products can be selected at once
          return [...prev, productId];
        }
        setSnackbar({
          open: true,
          message: 'You can only select up to 10 products for bulk actions',
          severity: 'warning',
        });
        return prev;
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length > 0) {
      setOpenBulkDeleteDialog(true);
    }
  };

  const handleConfirmBulkDelete = async () => {
    try {
      // In a real app, this would call an API
      const updatedProducts = products.filter(
        (product) => !selectedProducts.includes(product.id)
      );
      setProducts(updatedProducts);
      setSelectedProducts([]);
      setSnackbar({
        open: true,
        message: `${selectedProducts.length} products deleted successfully`,
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete products',
        severity: 'error',
      });
    }
    setOpenBulkDeleteDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getCategoryIcon = (category: ProductCategory) => {
    switch (category) {
      case ProductCategory.BOOK:
        return <BookIcon />;
      case ProductCategory.CD:
        return <CDIcon />;
      case ProductCategory.LP:
        return <LPIcon />;
      case ProductCategory.DVD:
        return <DVDIcon />;
      default:
        return null;
    }
  };

  const getStockStatusColor = (
    quantity: number
  ): 'success' | 'warning' | 'error' => {
    if (quantity > 20) return 'success';
    if (quantity > 5) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
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
        <Typography variant="h5" color="text.secondary">
          Loading products...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: 3,
        minHeight: '100vh',
        backgroundColor: 'background.default',
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
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="primary"
              onClick={() => navigate('/product-management')}
              sx={{ mr: 1, bgcolor: 'rgba(2, 136, 209, 0.1)' }}
            >
              <ArrowBackIcon />
            </IconButton>
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
              <WavesIcon /> Product Management
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/product-management/products/add')}
          >
            Add New Product
          </Button>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            borderRadius: 2,
            border: '1px solid rgba(100, 255, 218, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <TextField
              placeholder="Search products..."
              variant="outlined"
              size="small"
              fullWidth
              sx={{ maxWidth: 500 }}
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(100, 255, 218, 0.7)' }} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                multiple
                displayEmpty
                value={categoryFilter}
                onChange={handleCategoryFilterChange}
                input={<OutlinedInput />}
                renderValue={(selected) => {
                  if ((selected as string[]).length === 0) {
                    return (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          color: 'text.secondary',
                        }}
                      >
                        <FilterListIcon sx={{ mr: 1, fontSize: 20 }} />
                        Filter by Category
                      </Box>
                    );
                  }
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  );
                }}
              >
                {Object.values(ProductCategory).map((category) => (
                  <MenuItem key={category} value={category}>
                    <Checkbox checked={categoryFilter.indexOf(category) > -1} />
                    <ListItemText primary={category} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedProducts.length > 0 && (
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="body2"
                  sx={{ mr: 2, color: 'primary.light' }}
                >
                  {selectedProducts.length}{' '}
                  {selectedProducts.length === 1 ? 'product' : 'products'}{' '}
                  selected
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleBulkDelete}
                  disabled={selectedProducts.length > 10}
                  sx={{
                    borderColor: 'rgba(255, 82, 82, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(255, 82, 82, 0.5)',
                      backgroundColor: 'rgba(255, 82, 82, 0.05)',
                    },
                  }}
                >
                  Delete Selected
                </Button>
              </Box>
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {filteredProducts.length} of {products.length} products
          </Typography>

          <TableContainer
            sx={{
              maxHeight: 'calc(100vh - 300px)',
              '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(100, 255, 218, 0.2)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(100, 255, 218, 0.05)',
              },
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    padding="checkbox"
                    sx={{ bgcolor: 'rgba(1, 22, 39, 0.8)' }}
                  >
                    <Checkbox
                      indeterminate={
                        selectedProducts.length > 0 &&
                        selectedProducts.length < filteredProducts.length
                      }
                      checked={
                        filteredProducts.length > 0 &&
                        selectedProducts.length ===
                          Math.min(filteredProducts.length, 10)
                      }
                      onChange={() => {
                        if (
                          selectedProducts.length ===
                          Math.min(filteredProducts.length, 10)
                        ) {
                          setSelectedProducts([]);
                        } else {
                          // Select up to 10 products
                          setSelectedProducts(
                            filteredProducts
                              .slice(0, 10)
                              .map((product) => product.id)
                          );
                        }
                      }}
                      sx={{
                        color: 'rgba(100, 255, 218, 0.5)',
                        '&.Mui-checked': {
                          color: 'primary.light',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: 'rgba(1, 22, 39, 0.8)',
                      fontWeight: 'bold',
                      color: 'primary.light',
                    }}
                  >
                    Title
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: 'rgba(1, 22, 39, 0.8)',
                      fontWeight: 'bold',
                      color: 'primary.light',
                    }}
                  >
                    Category
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      bgcolor: 'rgba(1, 22, 39, 0.8)',
                      fontWeight: 'bold',
                      color: 'primary.light',
                    }}
                  >
                    Price
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      bgcolor: 'rgba(1, 22, 39, 0.8)',
                      fontWeight: 'bold',
                      color: 'primary.light',
                    }}
                  >
                    Stock
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      bgcolor: 'rgba(1, 22, 39, 0.8)',
                      fontWeight: 'bold',
                      color: 'primary.light',
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <TableRow
                      key={product.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(2, 136, 209, 0.08)',
                        },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectionChange(product.id)}
                          sx={{
                            color: 'rgba(100, 255, 218, 0.5)',
                            '&.Mui-checked': {
                              color: 'primary.light',
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'rgba(2, 136, 209, 0.1)',
                              mr: 2,
                            }}
                          >
                            {getCategoryIcon(product.category)}
                          </Box>
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 'medium' }}
                            >
                              {product.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {product.barcode}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.category}
                          size="small"
                          sx={{ fontWeight: 'medium' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color="primary.light"
                          >
                            {formatCurrency(product.price)}
                          </Typography>
                          {product.discount && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                gap: 1,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  textDecoration: 'line-through',
                                  color: 'text.secondary',
                                }}
                              >
                                {formatCurrency(product.value)}
                              </Typography>
                              <Chip
                                label={`-${product.discount}%`}
                                size="small"
                                color="error"
                                sx={{
                                  height: 20,
                                  '& .MuiChip-label': {
                                    px: 1,
                                    py: 0.5,
                                    fontSize: '0.6rem',
                                  },
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${product.quantity} in stock`}
                          color={getStockStatusColor(product.quantity)}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 1,
                          }}
                        >
                          <Tooltip title="Edit Product">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() =>
                                navigate(
                                  `/product-management/products/edit/${product.id}`
                                )
                              }
                              sx={{ bgcolor: 'rgba(2, 136, 209, 0.1)' }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Product">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteClick(product.id)}
                              sx={{ bgcolor: 'rgba(255, 82, 82, 0.1)' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography color="text.secondary">
                        No products found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredProducts.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
            sx={{
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows':
                {
                  color: 'text.secondary',
                },
            }}
          />
        </Paper>
      </Container>

      {/* Single Product Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            border: '1px solid rgba(255, 82, 82, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ color: 'error.main' }}>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.primary' }}>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            color="primary"
            variant="outlined"
            sx={{
              borderColor: 'rgba(100, 255, 218, 0.3)',
              '&:hover': {
                borderColor: 'rgba(100, 255, 218, 0.5)',
                backgroundColor: 'rgba(100, 255, 218, 0.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            sx={{
              ml: 1,
              bgcolor: 'rgba(255, 82, 82, 0.8)',
              '&:hover': { bgcolor: 'error.main' },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog
        open={openBulkDeleteDialog}
        onClose={() => setOpenBulkDeleteDialog(false)}
        PaperProps={{
          sx: {
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            border: '1px solid rgba(255, 82, 82, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          Bulk Delete Products
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.primary' }}>
            Are you sure you want to delete {selectedProducts.length} selected
            products? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenBulkDeleteDialog(false)}
            color="primary"
            variant="outlined"
            sx={{
              borderColor: 'rgba(100, 255, 218, 0.3)',
              '&:hover': {
                borderColor: 'rgba(100, 255, 218, 0.5)',
                backgroundColor: 'rgba(100, 255, 218, 0.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmBulkDelete}
            color="error"
            variant="contained"
            sx={{
              ml: 1,
              bgcolor: 'rgba(255, 82, 82, 0.8)',
              '&:hover': { bgcolor: 'error.main' },
            }}
          >
            Delete {selectedProducts.length} Products
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductListPage;
