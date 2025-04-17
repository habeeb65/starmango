import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
  Badge,
  Paper,
  Container
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import authService from '../../services/authService';

// Drawer width
const drawerWidth = 260;

// Styled components
const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    width: drawerWidth,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      borderRight: 'none',
      boxShadow: '0 0 20px rgba(0,0,0,0.05)',
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#fff',
    },
  }),
  ...(!open && {
    width: theme.spacing(7),
    '& .MuiDrawer-paper': {
      width: theme.spacing(7),
      boxSizing: 'border-box',
      borderRight: 'none',
      boxShadow: '0 0 20px rgba(0,0,0,0.05)',
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#fff',
      overflowX: 'hidden',
    },
  }),
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));

const StyledAppBar = styled(AppBar)(({ theme, open, isMobile }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#fff',
  color: theme.palette.text.primary,
  boxShadow: '0 0 20px rgba(0,0,0,0.05)',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(!isMobile && {
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
}));

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(1),
  backgroundColor: selected ? theme.palette.primary.light : 'transparent',
  color: selected ? theme.palette.primary.main : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: selected 
      ? theme.palette.primary.light 
      : theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(0, 0, 0, 0.04)',
  },
}));

// Navigation items
const navigation = [
  { name: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { name: 'Products', icon: <InventoryIcon />, path: '/admin/products' },
  { name: 'Sales', icon: <PointOfSaleIcon />, path: '/admin/sales' },
  { name: 'Purchases', icon: <ShoppingCartIcon />, path: '/admin/purchases' },
  { name: 'Customers', icon: <PeopleIcon />, path: '/admin/customers' },
  { name: 'Vendors', icon: <LocalShippingIcon />, path: '/admin/vendors' },
  { name: 'Expenses', icon: <ReceiptIcon />, path: '/admin/expenses' },
  { name: 'Reports', icon: <AssessmentIcon />, path: '/admin/reports' },
];

const AdminLayout = ({ onLogout, onToggleTheme, darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Update drawer state when screen size changes
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    if (onLogout) onLogout();
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setOpen(false);
    }
  };

  const currentUser = authService.getCurrentUser() || { username: 'Admin' };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <StyledAppBar position="fixed" open={open} isMobile={isMobile}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Star Mango Management
          </Typography>

          {/* Theme Toggle */}
          <IconButton color="inherit" onClick={onToggleTheme} sx={{ ml: 1 }}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={handleNotificationMenuOpen} sx={{ ml: 1 }}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile */}
          <Tooltip title="Account settings">
            <IconButton
              color="inherit"
              onClick={handleProfileMenuOpen}
              sx={{ ml: 1 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                {currentUser.username.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </StyledAppBar>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            width: 320,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
      >
        <MenuItem onClick={handleNotificationMenuClose}>
          <ListItemIcon>
            <PointOfSaleIcon fontSize="small" color="success" />
          </ListItemIcon>
          <Box>
            <Typography variant="body2">New sale recorded</Typography>
            <Typography variant="caption" color="text.secondary">5 minutes ago</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationMenuClose}>
          <ListItemIcon>
            <InventoryIcon fontSize="small" color="warning" />
          </ListItemIcon>
          <Box>
            <Typography variant="body2">Low inventory alert: Alphonso</Typography>
            <Typography variant="caption" color="text.secondary">1 hour ago</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationMenuClose}>
          <ListItemIcon>
            <ShoppingCartIcon fontSize="small" color="info" />
          </ListItemIcon>
          <Box>
            <Typography variant="body2">New purchase invoice</Typography>
            <Typography variant="caption" color="text.secondary">3 hours ago</Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleNotificationMenuClose} sx={{ justifyContent: 'center' }}>
          <Typography variant="body2" color="primary">
            View all notifications
          </Typography>
        </MenuItem>
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Sidebar Drawer */}
      <StyledDrawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
      >
        <DrawerHeader>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src="/logo.png"
              alt="Star Mango"
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            {open && (
              <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
                Star Mango
              </Typography>
            )}
          </Box>
          {open && !isMobile && (
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />
        <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <List sx={{ py: 1, flex: 1 }}>
            {navigation.map((item) => {
              const isActive = location.pathname === item.path || 
                               (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <StyledListItem
                  key={item.name}
                  button
                  selected={isActive}
                  onClick={() => handleNavigation(item.path)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive ? 'primary.main' : 'inherit'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && <ListItemText primary={item.name} />}
                </StyledListItem>
              );
            })}
          </List>
          {open && (
            <Box sx={{ p: 2, mt: 'auto' }}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  bgcolor: 'primary.light', 
                  color: 'primary.main',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Need help?
                </Typography>
                <Box component={Link} to="/admin/support" sx={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                    Support Center
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}
        </Box>
      </StyledDrawer>

      {/* Main content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: '100%',
          overflow: 'auto',
          pt: { xs: 8, sm: 9 }
        }}
      >
        <Container maxWidth="xl" sx={{ mb: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout;