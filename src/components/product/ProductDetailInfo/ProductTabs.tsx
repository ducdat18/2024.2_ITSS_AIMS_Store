import React, { useState } from 'react';
import { Box, Paper, Tabs, Tab } from '@mui/material';
import { Info as InfoIcon, MusicNote } from '@mui/icons-material';
import { Product, ProductCategory } from '../../../types';
import BookDetails from './BookDetail';
import CDDetails from './CDDetail';
import Specifications from './Specifications';
import Tracklist from './Tracklist';
import DVDDetails from './DVDDetail';
import LPDetails from './LPDetail';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `product-tab-${index}`,
    'aria-controls': `product-tabpanel-${index}`,
  };
};

interface ProductTabsProps {
  product: Product;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Define tabs based on product category
  const hasMusicTracks =
    product.category === ProductCategory.CD ||
    product.category === ProductCategory.LP;

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        border: '1px solid rgba(100, 255, 218, 0.1)',
        backgroundImage: 'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(100, 255, 218, 0.1)' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="product information tabs"
          sx={{
            '& .MuiTab-root': {
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.light',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.light',
            },
          }}
        >
          <Tab
            label="Details"
            {...a11yProps(0)}
            icon={<InfoIcon />}
            iconPosition="start"
          />
          {hasMusicTracks && (
            <Tab
              label="Tracklist"
              {...a11yProps(1)}
              icon={<MusicNote />}
              iconPosition="start"
            />
          )}
          <Tab
            label="Specifications"
            {...a11yProps(hasMusicTracks ? 2 : 1)}
            icon={<InfoIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={activeTab} index={0}>
        {product.category === ProductCategory.BOOK && (
          <BookDetails product={product} />
        )}
        {product.category === ProductCategory.CD && (
          <CDDetails product={product} />
        )}
        {product.category === ProductCategory.LP && (
          <LPDetails product={product} />
        )}
        {product.category === ProductCategory.DVD && (
          <DVDDetails product={product} />
        )}
      </TabPanel>

      {hasMusicTracks && (
        <TabPanel value={activeTab} index={1}>
          <Tracklist
            tracks={
              product.category === ProductCategory.CD
                ? (product as any).tracklist
                : (product as any).tracklist
            }
          />
        </TabPanel>
      )}

      <TabPanel value={activeTab} index={hasMusicTracks ? 2 : 1}>
        <Specifications product={product} />
      </TabPanel>
    </Paper>
  );
};

export default ProductTabs;
