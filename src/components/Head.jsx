import { Toolbar, AppBar, Box, Grid } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Arrow from '@material-ui/icons/KeyboardArrowLeft';
import theme from '../modules/theme';

const styles = {
  titleBar: {
    backgroundColor: theme.palette.appBar,
  },
};

function Head({ classes, title }) {
  return (
    <AppBar className={classes.titleBar} position="relative" style={{ height: '8em' }}>
      <Toolbar style={{ height: '8em' }}>
        <Grid container alignItems="center" direction="column">
          <Grid container item alignItems="center" spacing={2}>
            <Grid item>
              <Arrow fontSize="large" style={{ color: '#333333' }} />
            </Grid>
            <Grid item>
              <Box fontWeight={600} fontSize={34} color="black">
                {title}
              </Box>
            </Grid>
          </Grid>
        </Grid>
        {/* <Drawer open={isMenuOpen} onClick={() => toggleMenu(false)}>
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
        </IconButton> */}
      </Toolbar>
    </AppBar>
  );
}

Head.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(Head);
