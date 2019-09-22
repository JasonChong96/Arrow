import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import { HashRouter, Switch, Route } from 'react-router-dom';
import Helmet from 'react-helmet';
import styled, { css, ThemeProvider } from 'styled-components';
import treeChanges from 'tree-changes';

import history from 'modules/history';
import theme, { headerHeight } from 'modules/theme';
import { utils } from 'styled-minimal';

import config from 'config';

import Home from 'routes/Home';
import Private from 'routes/Private';
import NotFound from 'routes/NotFound';

import Header from 'containers/Header';
import SystemAlerts from 'containers/SystemAlerts';

import GlobalStyles from 'components/GlobalStyles';

import { ActionTypes } from 'constants/index';
import { ToastContainer } from 'react-toastify';
import Register from '../routes/Register';
import 'react-toastify/dist/ReactToastify.css';
import Routes from '../components/Routes';
import Login from '../routes/Login';
import { createMuiTheme } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import Projects from '../routes/Projects';
import CreateProject from '../routes/CreateProject';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  opacity: 1 !important;
  position: relative;
  transition: opacity 0.5s;
`;

const MainPrivate = ({ isAuthenticated }) =>
  isAuthenticated &&
  css`
    padding: ${utils.px(headerHeight)} 0 0;
  `;

const Main = styled.main`
  min-height: 100vh;

  ${MainPrivate};
`;

const styles = {
  main: {
    display: 'flex',
    justifyItems: 'start',
    zIndex: 1200,
    flexDirection: 'column',
  },
};

const routes = {
  '/': {
    component: Home,
    isPublic: true,
    exact: true,
  },
  '/login': {
    component: Login,
    isPublic: true,
    exact: true,
  },
  '/register': {
    component: Register,
    isPublic: true,
    exact: true,
  },
  '/private': {
    component: Private,
    isPublic: false,
    exact: false,
  },
  '/projects': {
    component: Projects,
    isPublic: true,
    exact: false,
  },
  '/project/:code': {
    component: Projects,
    isPublic: true,
    exact: false,
  },
  '/createproject': {
    component: CreateProject,
    isPublic: true,
    exact: false,
  }
}

export class App extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    const { changedTo } = treeChanges(this.props, nextProps);
    const user = localStorage.getItem('user');
    if (user) {
      // dispatch({ type: ActionTypes.USER_LOGIN_SUCCESS });
    }
    if (changedTo('user.isAuthenticated', true)) {
      // dispatch(showAlert('Hello! And welcome!', { variant: 'success', icon: 'bell' }));
    }
  }

  render() {
    const { dispatch, user, classes } = this.props;
    return (
      <HashRouter history={history} basename='/'>
        <ThemeProvider theme={createMuiTheme(theme)}>
          <AppWrapper logged={user.isAuthenticated}>
            <Helmet
              defer={false}
              htmlAttribsassutes={{ lang: 'pt-br' }}
              encodeSpecialCharacters={true}
              defaultTitle={config.name}
              titleTemplate={`%s | ${config.name}`}
              titleAttributes={{ itemprop: 'name', lang: 'pt-br' }}
            />
            {user.isAuthenticated && <Header dispatch={dispatch} user={user} />}
            {/* <Head /> */}
            <ToastContainer autoClose={3000} hideProgressBar />
            <Main isAuthenticated={user.isAuthenticated} className={classes.main}>
              <Switch>
                <Routes
                  isAuthenticated={user.isAuthenticated}
                  paths={routes}
                />
                <Route exact component={NotFound} />
              </Switch>
            </Main>
            {/* <Footer /> */}
            <SystemAlerts />
            <GlobalStyles />
          </AppWrapper>
        </ThemeProvider>
      </HashRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default hot(withStyles(styles)(connect(mapStateToProps)(App)));
