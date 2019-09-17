import React, { useState } from 'react';
import {
  withStyles,
  Grid,
  Button,
  Typography,
  Box,
  Container,
} from '@material-ui/core';
import { login } from '../actions/user';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import config from '../config';
import UserTextField from '../components/UserTextField';
import theme from '../modules/theme';
import PasswordField from '../components/PasswordField';
import { Link } from 'react-router-dom';

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
  },
};

function Login({ classes, dispatch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Container maxWidth="sm">
      <form className={classes.formContainer}>
        <Grid container alignItems="center" direction="column" justify="center" spacing={5}>
          <Grid item>
            <Box fontWeight={600} fontSize={34}>
              {config.name}
            </Box>
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
                <Button className={classes.loginButton} onClick={() => dispatch(login(email, password))}>
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
  dispatch: PropTypes.func.isRequired,
};

export default connect(null)(withStyles(styles)(Login));
