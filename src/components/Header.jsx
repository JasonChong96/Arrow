import { Toolbar, AppBar, Box, Grid } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Arrow from '@material-ui/icons/KeyboardArrowLeft';
import theme from '../modules/theme';
import { Link } from 'react-router-dom';

const styles = {
};

function Header({ classes, contentComponent, backPath, color, height, backColor, headerProps }) {
  const Component = contentComponent;
  return (
    <AppBar className={classes.titleBar} position="relative" style={{
      backgroundColor: color,
      height,
    }}>
      <Toolbar style={{ height }}>
        <Grid container alignItems="center" direction="column">
          <Grid container item spacing={2}>
            {backPath && <Grid item>
              <Link to={backPath}>
                <Arrow fontSize="large" style={{ color: backColor, marginTop: '1rem' }} />
              </Link>
            </Grid>}
            <Grid item style={{ flexGrow: 1 }}>
              <Component {...headerProps} />
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar >
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  contentComponent: PropTypes.func.isRequired,
  backPath: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  backColor: PropTypes.string.isRequired,
};

Header.defaultProps = {
  color: theme.palette.appBar,
  height: '8em',
  backColor: '#333333'
}

export default withStyles(styles)(Header);
