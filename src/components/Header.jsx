import { Toolbar, AppBar, Box, Grid } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Arrow from '@material-ui/icons/KeyboardArrowLeft';
import theme from '../modules/theme';
import { Link } from 'react-router-dom';

const styles = {
  rootHeight: {
    height: '8em',
  },
};

function Header({ classes, contentComponent, backPath, color }) {
  const Component = contentComponent;
  return (
    <AppBar className={classes.titleBar} position="relative" style={{ backgroundColor: color }}>
      <Toolbar style={{ height: '8em' }}>
        <Grid container alignItems="center" direction="column">
          <Grid container item spacing={2}>
            {backPath && <Grid item>
              <Link to={backPath}>
                <Arrow fontSize="large" style={{ color: '#333333', marginTop: '1rem' }} />
              </Link>
            </Grid>}
            <Grid item>
              <Component />
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  contentComponent: PropTypes.func.isRequired,
  backPath: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

Header.defaultProps = {
  color: theme.palette.appBar,
}

export default withStyles(styles)(Header);
