import { Toolbar, Paper, AppBar, IconButton, Menu, MenuItem } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import theme from '../modules/theme';
import { withStyles } from '@material-ui/styles';

const styles = {
  titleBar: {
    backgroundColor: theme.palette.appBar,
  },
};

function Head({ classes }) {
  const [isMenuOpen, toggleMenu] = useState(false);
  return (
    <AppBar className={classes.titleBar} position="relative">
      <Toolbar>
        <Drawer open={isMenuOpen} onClick={() => toggleMenu(false)}>
          <Link to="/">
            <MenuItem>Home</MenuItem>
          </Link>
          <Link to="/register">
            <MenuItem>Register</MenuItem>
          </Link>
          <Link to="/login">
            <MenuItem>Log in</MenuItem>
          </Link>
        </Drawer>
        <IconButton onClick={() => toggleMenu(!isMenuOpen)}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

Head.propTypes = {
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Head);
