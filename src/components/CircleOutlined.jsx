import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const styles = {
  root: {
    borderRadius: '50%',
    width: '16px',
    height: '16px',
  },
};

function CircleOutlined({ classes, color }) {
  return (
    <div
      className={classes.root}
      style={{
        border: `1px solid${color}`,
      }}
    />
  );
}

CircleOutlined.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
};
export default withStyles(styles)(CircleOutlined);
