// src/pages/product-manager/ProductListPage.tsx
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
  Button,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Snackbar,
  Divider,
  SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Book as BookIcon,
  Album as CDIcon,
  Radio as LPIcon,
  MovieCreation as DVDIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { mockApiService } from '../../mock/mockApi';
import { Product, ProductCategory } from '../../types';
import { formatCurrency } from '../../utils/formatters';

// Get category icon
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
      return <BookIcon />;
  }
};

// Get category color
const getCategoryColor = (category: ProductCategory) => {
  switch (category) {
    case ProductCategory.BOOK:
      return 'primary';
    case ProductCategory.CD:
      return 'secondary';
    case ProductCategory.LP:
      return 'warning';
    case ProductCategory.DVD:
      return 'success';
    default:
      return 'default';
  }
};

const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<
    ProductCategory[]
  >([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [deleteMode, setDeleteMode] = useState<'single' | 'multiple'>('single');
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [stockFilter, setStockFilter] = useState<'all' | 'low'>('all');

  // Constants
  const LOW_STOCK_THRESHOLD = 10;
  const MAX_DELETE_COUNT = 10;

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await mockApiService.getProducts();
        setProducts(data);
        filterProducts(data, searchTerm, selectedCategories, stockFilter);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search, categories, and stock level
  const filterProducts = (
    productList: Product[],
    search: string,
    categories: ProductCategory[],
    stock: 'all' | 'low'
  ) => {
    let filtered = [...productList];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          product.barcode.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (categories.length > 0) {
      filtered = filtered.filter((product) =>
        categories.includes(product.category)
      );
    }

    // Stock filter
    if (stock === 'low') {
      filtered = filtered.filter(
        (product) => product.quantity <= LOW_STOCK_THRESHOLD
      );
    }

    setFilteredProducts(filtered);
  };

  // Apply filters when filter parameters change
  useEffect(() => {
    filterProducts(products, searchTerm, selectedCategories, stockFilter);
  }, [searchTerm, selectedCategories, stockFilter]);

  // Handle search term change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle category filter change
  const handleCategoryChange = (
    event: SelectChangeEvent<ProductCategory[]>
  ) => {
    const value = event.target.value as unknown as ProductCategory[];
    setSelectedCategories(value);
  };

  // Handle stock filter change
  const handleStockFilterChange = (event: SelectChangeEvent<'all' | 'low'>) => {
    setStockFilter(event.target.value as 'all' | 'low');
  };

  // Handle page change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setStockFilter('all');
  };

  // Handle checkbox selection for bulk delete
  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.includes(productId);

      // If already selected, remove it
      if (isSelected) {
        return prev.filter((id) => id !== productId);
      }

      // If not selected and under limit, add it
      if (prev.length < MAX_DELETE_COUNT) {
        return [...prev, productId];
      }

      // If at the limit, show warning and don't add
      setSnackbarMessage(
        `You can only select up to ${MAX_DELETE_COUNT} products for deletion`
      );
      setSnackbarOpen(true);
      return prev;
    });
  };

  // Open delete dialog for single product
  const handleOpenDeleteDialog = (productId: string) => {
    setDeleteMode('single');
    setProductToDelete(productId);
    setOpenDeleteDialog(true);
  };

  // Open delete dialog for multiple products
  const handleOpenBulkDeleteDialog = () => {
    if (selectedProducts.length === 0) {
      setSnackbarMessage('No products selected for deletion');
      setSnackbarOpen(true);
      return;
    }

    setDeleteMode('multiple');
    setOpenDeleteDialog(true);
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setProductToDelete(null);
  };

  // Process product deletion
  const handleDeleteProducts = async () => {
    try {
      // In a real implementation, this would call an API to delete the products

      if (deleteMode === 'single' && productToDelete) {
        // Delete single product
        const updatedProducts = products.filter(
          (product) => product.id !== productToDelete
        );
        setProducts(updatedProducts);
        filterProducts(
          updatedProducts,
          searchTerm,
          selectedCategories,
          stockFilter
        );

        setSnackbarMessage('Product deleted successfully');
      } else if (deleteMode === 'multiple') {
        // Delete multiple products
        const updatedProducts = products.filter(
          (product) => !selectedProducts.includes(product.id)
        );
        setProducts(updatedProducts);
        filterProducts(
          updatedProducts,
          searchTerm,
          selectedCategories,
          stockFilter
        );

        setSnackbarMessage(
          `${selectedProducts.length} products deleted successfully`
        );
        setSelectedProducts([]);
      }

      setSnackbarOpen(true);
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting products:', error);
      setSnackbarMessage('Error deleting products. Please try again.');
      setSnackbarOpen(true);
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Calculate visible products for current page
  const visibleProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box
      sx={{
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
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
            Product Management
          </Typography>

          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate('/product-management/products/add')}
              sx={{ ml: 1 }}
            >
              Add Product
            </Button>
          </Box>
        </Box>

        {/* Filter Section */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            border: '1px solid rgba(100, 255, 218, 0.1)',
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: { xs: 2, md: 0 },
              }}
            >
              <FilterListIcon /> Filters
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                width: { xs: '100%', md: 'auto' },
              }}
            >
              <Button
                variant="outlined"
                size="small"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                sx={{
                  borderColor: 'rgba(100, 255, 218, 0.3)',
                  '&:hover': {
                    borderColor: 'rgba(100, 255, 218, 0.5)',
                    backgroundColor: 'rgba(100, 255, 218, 0.05)',
                  },
                }}
              >
                Clear Filters
              </Button>
              <Tooltip title="Refresh">
                <IconButton
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => setLoading(false), 500);
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Divider sx={{ mb: 3, borderColor: 'rgba(100, 255, 218, 0.1)' }} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              placeholder="Search by title, barcode..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'primary.light' }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchTerm('')}
                      sx={{ color: 'text.secondary' }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
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

            <FormControl
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
              <InputLabel>Categories</InputLabel>
              <Select
                multiple
                value={selectedCategories}
                onChange={handleCategoryChange}
                input={<OutlinedInput label="Categories" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as ProductCategory[]).map((category) => (
                      <Chip
                        key={category}
                        label={category}
                        size="small"
                        color={getCategoryColor(category)}
                      />
                    ))}
                  </Box>
                )}
              >
                {Object.values(ProductCategory).map((category) => (
                  <MenuItem key={category} value={category}>
                    <Checkbox
                      checked={selectedCategories.indexOf(category) > -1}
                    />
                    <ListItemText primary={category} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
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
              <InputLabel>Stock Level</InputLabel>
              <Select
                value={stockFilter}
                onChange={handleStockFilterChange}
                label="Stock Level"
              >
                <MenuItem value="all">All Products</MenuItem>
                <MenuItem value="low">
                  Low Stock (≤ {LOW_STOCK_THRESHOLD})
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <Alert
            severity="info"
            sx={{
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'rgba(2, 136, 209, 0.1)',
              border: '1px solid rgba(2, 136, 209, 0.3)',
            }}
            action={
              <Button
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={handleOpenBulkDeleteDialog}
              >
                Delete Selected
              </Button>
            }
          >
            {selectedProducts.length} products selected (max {MAX_DELETE_COUNT})
          </Alert>
        )}

        {/* Products Table */}
        <Paper
          elevation={3}
          sx={{
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            border: '1px solid rgba(100, 255, 218, 0.1)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(1, 22, 39, 0.5)' }}>
                  <TableCell padding="checkbox">
                    {/* Checkbox for bulk select would go here */}
                  </TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Price (VND)</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      Loading products...
                    </TableCell>
                  </TableRow>
                ) : visibleProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(2, 136, 209, 0.08)',
                        },
                        ...(product.quantity <= LOW_STOCK_THRESHOLD && {
                          backgroundColor: 'rgba(255, 152, 0, 0.08)',
                        }),
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 300,
                          cursor: 'pointer',
                        }}
                        onClick={() =>
                          navigate(
                            `/product-management/products/edit/${product.id}`
                          )
                        }
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body1" fontWeight="medium">
                            {product.title}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Barcode: {product.barcode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getCategoryIcon(product.category)}
                          label={product.category}
                          size="small"
                          color={getCategoryColor(product.category)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                          }}
                        >
                          <Typography variant="body2" fontWeight="bold">
                            {formatCurrency(product.price)}
                          </Typography>
                          {product.discount && (
                            <Chip
                              label={`-${product.discount}%`}
                              size="small"
                              color="error"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          color={
                            product.quantity <= LOW_STOCK_THRESHOLD
                              ? 'warning.main'
                              : 'text.primary'
                          }
                          fontWeight={
                            product.quantity <= LOW_STOCK_THRESHOLD
                              ? 'bold'
                              : 'normal'
                          }
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: 0.5,
                          }}
                        >
                          {product.quantity <= LOW_STOCK_THRESHOLD && (
                            <WarningIcon fontSize="small" color="warning" />
                          )}
                          {product.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() =>
                                navigate(
                                  `/product-management/products/edit/${product.id}`
                                )
                              }
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleOpenDeleteDialog(product.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredProducts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">
            {deleteMode === 'single'
              ? 'Delete Product'
              : 'Delete Selected Products'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              {deleteMode === 'single'
                ? 'Are you sure you want to delete this product? This action cannot be undone.'
                : `Are you sure you want to delete ${selectedProducts.length} products? This action cannot be undone.`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleDeleteProducts}
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </Container>
    </Box>
  );
};

export default ProductListPage;
