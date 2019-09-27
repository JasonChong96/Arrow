import React, { useState, useEffect } from 'react';
import { TextField, withStyles, Grid, Button, Typography, Box } from '@material-ui/core';
import PropTypes from 'prop-types';
import { login } from '../actions/user';
import theme from '../modules/theme';

const styles = {
  root: {
    '& input:valid:focus + fieldset': {
      borderColor: theme.palette.primary[500],
    },
    '& input:invalid:focus + fieldset': {
      borderColor: theme.palette.primary[500],
    },
    '& .focused': {
      color: theme.palette.primary[500],
    },
  },
};

function UserTextField({ label, value, type, onChange, classes, error, required }) {
  return (
    <TextField
      error={error}
      required={required}
      InputLabelProps={{
        classes: {
          root: classes.root,
          focused: 'focused',
        },
      }}
      label={label}
      variant="outlined"
      type={type}
      onChange={onChange}
      value={value}
      className={classes.root}
      fullWidth
    />
  );
}

UserTextField.propTypes = {
  classes: PropTypes.object.isRequired,
  error: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

UserTextField.defaultProps = {
  error: false,
  required: false,
};

export default withStyles(styles)(UserTextField);
