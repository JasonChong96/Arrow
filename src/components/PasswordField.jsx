import React from 'react';
import {
  withStyles,
  FormControl,
  IconButton,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  makeStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import theme from '../modules/theme';

const styles = theme => ({
  formControlRoot: {
    width: '100%',
  },
});

const useInputLabelStyles = makeStyles(() => ({
  root: {
    '&$focused': {
      color: theme.palette.primary[500],
    },
  },
  focused: {},
}));

const useOutlinedInputStyles = makeStyles(() => ({
  root: {
    '&$focused $notchedOutline': {
      borderColor: theme.palette.primary[500],
    },
  },
  focused: {},
  notchedOutline: {},
}));

function PasswordField({
  classes,
  password,
  onChange,
  showPassword,
  toggleShowPassword,
  confirmPassword,
  error,
}) {
  const label = `${confirmPassword ? 'Confirm ' : ''}Password`;
  return (
    <FormControl className={classes.formControlRoot}>
      <InputLabel
        error={error}
        htmlFor="adornment-password"
        variant="outlined"
        classes={useInputLabelStyles()}
      >
        {label}
      </InputLabel>
      <OutlinedInput
        error={error}
        id="adornment-password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={onChange}
        fullWidth
        labelWidth={label.length * 5.5}
        classes={useOutlinedInputStyles()}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={toggleShowPassword}
              onMouseDown={toggleShowPassword}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}

PasswordField.propTypes = {
  classes: PropTypes.object.isRequired,
  confirmPassword: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  showPassword: PropTypes.bool.isRequired,
  toggleShowPassword: PropTypes.func.isRequired,
};

PasswordField.defaultProps = {
  confirmPassword: false,
  error: false,
};

export default withStyles(styles)(PasswordField);
