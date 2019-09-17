import React, { useState } from 'react';
import {
  withStyles,
  Grid,
  Button,
  Typography,
  Box,
  Container,
} from '@material-ui/core';
import { register } from '../actions/user';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UserTextField from '../components/UserTextField';
import theme from '../modules/theme';
import PasswordField from '../components/PasswordField';
import { showAlert } from 'actions/index';
import { toast } from 'react-toastify';

const styles = {
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: '8em 0em 8em 0em',
  },
  fieldsGrid: {
    width: '85%',
  },
  width: {
    width: '100%',
  },
  signUpButton: {
    background: theme.palette.primary[500],
    borderRadius: '200px',
    width: '100%',
    color: 'white',
    textTransform: 'none',
  },
};

function Register({ classes, dispatch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  function isPasswordValid() {
    return password && password == confirmPassword;
  }
  return (
    <Container maxWidth="sm">
      <form className={classes.formContainer}>
        <Grid container alignItems="center" direction="column" justify="center" spacing={5}>
          <Grid
            container
            item
            alignItems="center"
            direction="column"
            spacing={2}
            className={classes.fieldsGrid}
          >
            <Grid item item className={classes.width}>
              <UserTextField
                error={!displayName}
                label="Display Name"
                type="Name"
                onChange={event => setDisplayName(event.target.value)}
                value={displayName}
              />
            </Grid>
            <Grid item item className={classes.width}>
              <UserTextField
                error={!validateEmail(email)}
                label="Email"
                type="Email"
                onChange={event => setEmail(event.target.value)}
                value={email}
              />
            </Grid>
            <Grid item className={classes.width}>
              <PasswordField
                error={!isPasswordValid()}
                password={password}
                onChange={event => setPassword(event.target.value)}
                showPassword={showPassword}
                toggleShowPassword={() => setShowPassword(!showPassword)}
              />
            </Grid>
            <Grid item className={classes.width}>
              <PasswordField
                error={!isPasswordValid()}
                confirmPassword
                password={confirmPassword}
                onChange={event => setConfirmPassword(event.target.value)}
                showPassword={showPassword}
                toggleShowPassword={() => setShowPassword(!showPassword)}
              />
            </Grid>
            <Grid
              item
              container
              className={classes.width}
              alignItems="center"
              direction="column"
              spacing={1}
            >
              <Grid item className={classes.width}>
                <Button className={classes.signUpButton} onClick={() => {
                  if (!validateEmail(email)) {
                    toast.error("Please enter a valid email address.", { position: toast.POSITION.TOP_RIGHT });
                    return;
                  }
                  if (!isPasswordValid()) {
                    toast.error('Please make sure your passwords match.', { position: toast.POSITION.TOP_RIGHT });
                    return;
                  }
                  dispatch(register(email, password, displayName))
                }}>
                  <Typography variant="h5">Sign Up</Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

function validateEmail(mail)
{
 return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)
}


Register.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect(null)(withStyles(styles)(Register));
