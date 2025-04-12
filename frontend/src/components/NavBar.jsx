import React, { useEffect, useState } from "react";
import { fetchUser } from "../utils/auth";
import { useTheme } from "../context/ThemeContext";
import { IconButton, Menu, MenuItem, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const data = await fetchUser();
      setUser(data);
    };
    checkAuth();
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNavigation = (path) => {
    navigate(`/home/${path}`);
    setMobileMenuOpen(false);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    // Add logout logic
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const navLinks = user
    ? [
        { name: "Home", path: "" },
        { name: "Features", path: "features" },
        { name: "Feedback", path: "feedback" },
        { name: "Settings", path: "settings" },
      ]
    : [
        { name: "Home", path: "features" },
        { name: "Features", path: "feedback" },
        { name: "Feedback", path: "contactus" },
      ];

  return (
    <nav className={`${isDarkMode ? "bg-navy text-white" : "bg-white text-gray-900"} w-full fixed top-0 left-0 z-50 shadow-md`}>
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        {/* Logo/Brand */}
        <div className="text-xl sm:text-2xl font-semibold">Image Caption Generator</div>

        {/* Theme Toggle Center (Hidden on mobile) */}
        <div className="hidden md:block">
          <IconButton onClick={toggleTheme} color="inherit">
            <Brightness4Icon />
          </IconButton>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className={`cursor-pointer p-2 rounded-md transition duration-200 ${isDarkMode ? 'hover:bg-gray-600 hover:text-gray-200' : 'hover:bg-gray-200 hover:text-gray-900'}`}
              onClick={() => handleNavigation(link.path)}
            >
              {link.name}
            </div>
          ))}

          {user ? (
            <div className="relative">
              <div
                className={`flex items-center space-x-2 cursor-pointer p-2 rounded-md transition duration-200 ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                onClick={handleMenuClick}
              >
                <AccountCircleIcon />
                <span>{user.name}</span>
              </div>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleLogout}>
                  <ExitToAppIcon sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <button
              onClick={handleLoginClick}
              className={`py-2 px-4 rounded-md transition duration-200 ${
                isDarkMode
                  ? "bg-white text-black hover:bg-black hover:text-white"
                  : "bg-black text-white hover:bg-white hover:text-black"
              }`}
            >
              Login / Signup
            </button>
          )}
        </div>

        {/* Hamburger for Mobile */}
        <div className="md:hidden flex items-center space-x-2">
          <IconButton onClick={toggleTheme} color="inherit">
            <Brightness4Icon />
          </IconButton>
          <IconButton onClick={() => setMobileMenuOpen(true)} color="inherit">
            <MenuIcon />
          </IconButton>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 250,
            backgroundColor: isDarkMode ? "#1e293b" : "#fff",
            color: isDarkMode ? "#fff" : "#000",
          },
        }}
      >
        <List>
          {navLinks.map((link) => (
            <ListItem button key={link.name} onClick={() => handleNavigation(link.path)}>
              <ListItemText primary={link.name} />
            </ListItem>
          ))}
          {user ? (
            <ListItem button onClick={handleLogout}>
              <ExitToAppIcon sx={{ mr: 1 }} />
              <ListItemText primary="Logout" />
            </ListItem>
          ) : (
            <ListItem button onClick={handleLoginClick}>
              <ListItemText primary="Login / Signup" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </nav>
  );
};

export default Navbar;
