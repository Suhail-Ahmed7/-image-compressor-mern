import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/HeaderComponent.css';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';

const HeaderComponent = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]); // re-check token on every route change

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const drawerContent = (
    <div className="mobile-menu">
      <div className="close-icon">
        <IconButton onClick={toggleDrawer}>
          <CloseIcon />
        </IconButton>
      </div>
      <List>
        <ListItem button component={Link} to="/resize" onClick={toggleDrawer}>
          <ListItemText primary="Resize" />
        </ListItem>
        <ListItem button component={Link} to="/compress" onClick={toggleDrawer}>
          <ListItemText primary="Compress" />
        </ListItem>
        <ListItem button component={Link} to="/convert" onClick={toggleDrawer}>
          <ListItemText primary="Convert" />
        </ListItem>

        {isLoggedIn ? (
          <ListItem button onClick={() => { toggleDrawer(); handleLogout(); }}>
            <ListItemText primary="Logout" />
          </ListItem>
        ) : (
          <>
            <ListItem button component={Link} to="/login" onClick={toggleDrawer}>
              <ListItemText primary="Log in" />
            </ListItem>
            <ListItem button component={Link} to="/signup" onClick={toggleDrawer}>
              <ListItemText primary="Sign up" />
            </ListItem>
          </>
        )}
      </List>
    </div>
  );

  return (
    <header className="header">
      <div className="logo">
        <PhotoCameraIcon className="logo-icon" />
        <span className="logo-text">ImageTools</span>
      </div>

      <nav className="nav-links">
        <Link to="/resize">Resize</Link>
        <Link to="/compress">Compress</Link>
        <Link to="/convert">Convert</Link>
      </nav>

      <div className="auth-buttons">
        {isLoggedIn ? (
          <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login" className="btn login-btn">Log in</Link>
            <Link to="/signup" className="btn signup-btn">Sign up</Link>
          </>
        )}
      </div>

      <IconButton className="menu-icon" onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>

      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer}>
        {drawerContent}
      </Drawer>
    </header>
  );
};

export default HeaderComponent;
