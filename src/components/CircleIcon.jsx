import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import theme from '../modules/theme';

const styles = {
  numberMargin: {
    marginTop: '-8px',
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyItems: 'start',
    borderRadius: '50%',
  },
};

function CircleIcon({ classes, Icon, length, color, iconColor, opacity, padding }) {
  return (
    <div
      className={classes.root}
      style={{
        backgroundColor: color,
        color: 'white',
        height: length,
        width: length,
        opacity,
        padding,
      }}
    >
      <Icon
        style={{
          color: iconColor,
        }}
      />
    </div>
  );
}

CircleIcon.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.string,
  Icon: PropTypes.node.isRequired,
  iconColor: PropTypes.string.isRequired,
  length: PropTypes.any,
  opacity: PropTypes.number,
  padding: PropTypes.string,
};
CircleIcon.defaultProps = {
  length: 16,
  color: theme.palette.primary[500],
  opacity: 1,
  padding: 1,
};
export default withStyles(styles)(CircleIcon);
