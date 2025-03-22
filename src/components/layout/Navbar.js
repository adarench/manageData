import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Badge, 
  Box, 
  useMediaQuery, 
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { UserContext } from '../../context/UserContext';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { burnoutLevel } = useContext(UserContext);
  const { currentUser, logout } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    { label: 'Dashboard', path: '/', icon: null },
    { label: 'Date Log', path: '/log', icon: <FavoriteIcon /> },
    { label: 'Contacts', path: '/contacts', icon: <PeopleIcon /> },
    { label: 'Assessment', path: '/assessment', icon: <AssessmentIcon /> },
    { label: 'Patterns', path: '/patterns', icon: <TimelineIcon /> },
    { label: 'Decision Helper', path: '/decision-helper', icon: <HelpOutlineIcon /> },
  ];

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/login');
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    navigate('/settings');
  };

  const getBurnoutBadge = () => {
    if (burnoutLevel > 7) return 'error';
    if (burnoutLevel > 4) return 'warning';
    return 'default';
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      {currentUser && (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid #eee'
          }}
        >
          <Avatar 
            src={currentUser.avatar} 
            alt={currentUser.displayName}
            sx={{ width: 64, height: 64, mb: 1 }}
          />
          <Typography variant="subtitle1">{currentUser.displayName}</Typography>
        </Box>
      )}
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.path} 
            component={Link} 
            to={item.path}
            selected={location.pathname === item.path}
            onClick={toggleDrawer}
            sx={{
              backgroundColor: location.pathname === item.path ? 'rgba(211, 47, 47, 0.1)' : 'inherit',
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
              }
            }}
          >
            <ListItemIcon>
              {item.path === '/decision-helper' ? (
                <Badge color={getBurnoutBadge()} variant="dot">
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <Divider />
        <ListItem 
          button 
          component={Link} 
          to="/settings"
          onClick={toggleDrawer}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem 
          button
          onClick={handleLogout}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'white', textDecoration: 'none' }}>
          Dating Insights
        </Typography>
        
        {!isMobile && (
          <Box sx={{ display: 'flex' }}>
            {navItems.map((item) => (
              <Button 
                key={item.path} 
                component={Link} 
                to={item.path}
                color="inherit"
                sx={{ 
                  mx: 1,
                  borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
                }}
                startIcon={item.path === '/decision-helper' ? (
                  <Badge color={getBurnoutBadge()} variant="dot">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
        
        {currentUser && (
          <>
            <IconButton 
              color="inherit" 
              onClick={handleProfileMenuOpen}
              edge="end"
            >
              <Avatar 
                src={currentUser.avatar} 
                alt={currentUser.displayName} 
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              keepMounted
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleSettingsClick}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </>
        )}
        
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
        >
          {drawer}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;