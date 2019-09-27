import { Button, Container, Grid, Typography, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../actions/user';
import PasswordField from '../components/PasswordField';
import UserTextField from '../components/UserTextField';
import theme from '../modules/theme';
import { ReactComponent as Logo } from './logo.svg';

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
  loginButton: {
    background: theme.palette.primary[500],
    borderRadius: '200px',
    width: '100%',
    color: 'white',
    textTransform: 'none',
  },
  createAccountButton: {
    width: '100%',
    color: theme.palette.primary[500],
    textTransform: 'none',
    borderRadius: '200px',
    textDecoration: 'none',
  },
};

function Login({ classes, dispatch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Container maxWidth="sm">
      <form className={classes.formContainer}>
        <Grid container alignItems="center" direction="column" justify="center" spacing={1}>
          <Grid item>
            <Logo style={{ fontSize: '10em' }} />
          </Grid>
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
                label="Email"
                type="Email"
                onChange={event => setEmail(event.target.value)}
                value={email}
              />
            </Grid>
            <Grid item className={classes.width}>
              <PasswordField
                password={password}
                onChange={event => setPassword(event.target.value)}
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
                <Button
                  className={classes.loginButton}
                  onClick={() => dispatch(login(email, password))}
                >
                  <Typography variant="h5">Log In</Typography>
                </Button>
              </Grid>
              <Grid item className={classes.width}>
                <Link to="/register">
                  <Button className={classes.createAccountButton}>
                    <Typography variant="h5">Create Account</Typography>
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(null)(withStyles(styles)(Login));
