import { Toolbar, AppBar, Box, Grid } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Arrow from '@material-ui/icons/KeyboardArrowLeft';
import { Link } from 'react-router-dom';
import theme from '../modules/theme';

const styles = {
  contentWrapper: {
    flexGrow: 1,
  },
  backIcon: {
    marginTop: '1rem',
  },
};

function Header({ classes, contentComponent, backPath, color, height, backColor, headerProps }) {
  const Component = contentComponent;
  return (
    <AppBar
      className={classes.titleBar}
      position="relative"
      style={{
        backgroundColor: color,
        height,
      }}
    >
      <Toolbar style={{ height }}>
        <Grid container alignItems="center" direction="column">
          <Grid container item spacing={2}>
            {backPath && (
              <Grid item>
                <Link to={backPath}>
                  <Arrow
                    fontSize="large"
                    className={classes.backIcon}
                    style={{ color: backColor }}
                  />
                </Link>
              </Grid>
            )}
            <Grid item className={classes.contentWrapper}>
              <Component {...headerProps} />
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  backColor: PropTypes.string.isRequired,
  backPath: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
  contentComponent: PropTypes.func.isRequired,
  height: PropTypes.string.isRequired,
};

Header.defaultProps = {
  color: theme.palette.appBar,
  height: '8em',
  backColor: '#333333',
};

export default withStyles(styles)(Header);
