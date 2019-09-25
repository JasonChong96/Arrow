import React, { useState, useEffect } from 'react';
import { TextField, withStyles, Grid, Button, Typography, Box } from '@material-ui/core';
import { login } from '../actions/user';
import PropTypes from 'prop-types';
import theme from '../modules/theme';

const styles = {
  root: {
    color: 'white',
    '& input:valid:focus + fieldset': {
      borderColor: 'white',
    },
    '& input:invalid:focus + fieldset': {
      borderColor: 'white',
    },
    '& .focused': {
      color: 'white',
    },
  },
  input: {
    color: 'white'
  }
};

function WhiteLabelTextField({ classes, color, ...rest }) {
  return (
    <TextField
      InputLabelProps={{
        classes: {
          root: classes.root,
          focused: 'focused',
        },
      }}
      InputProps={{
        className: classes.input,
      }}
      className={classes.root}
      style={{
        backgroundColor: color,
      }}
      {...rest}
    />
  );
}

WhiteLabelTextField.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
};

WhiteLabelTextField.defaultProps = {
  error: false,
  required: false,
}

export default withStyles(styles)(WhiteLabelTextField);
