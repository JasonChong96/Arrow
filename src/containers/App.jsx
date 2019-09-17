import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';
import Helmet from 'react-helmet';
import styled, { css, ThemeProvider } from 'styled-components';
import treeChanges from 'tree-changes';

import history from 'modules/history';
import theme, { headerHeight } from 'modules/theme';
import { utils } from 'styled-minimal';

import config from 'config';
import { showAlert } from 'actions/index';

import Home from 'routes/Home';
import Private from 'routes/Private';
import NotFound from 'routes/NotFound';

import Header from 'components/Header';
import SystemAlerts from 'containers/SystemAlerts';

import Footer from 'components/Footer';
import GlobalStyles from 'components/GlobalStyles';
import RoutePublic from 'components/RoutePublic';
import RoutePrivate from 'components/RoutePrivate';

import { ActionTypes } from 'constants/index';
import Head from '../components/Head';
import Register from '../routes/Register';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Routes from '../components/Routes';
import Login from '../routes/Login';
import { createMuiTheme } from '@material-ui/core';
import { purple } from '@material-ui/core/colors';

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

export class App extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    const { changedTo } = treeChanges(this.props, nextProps);

    const user = localStorage.getItem('user');
    if (user) {
      dispatch({ type: ActionTypes.USER_LOGIN_SUCCESS });
    }
    if (changedTo('user.isAuthenticated', true)) {
      // dispatch(showAlert('Hello! And welcome!', { variant: 'success', icon: 'bell' }));
    }
  }

  render() {
    const { dispatch, user } = this.props;
    return (
      <Router history={history}>
        <ThemeProvider theme={createMuiTheme(theme)}>
          <AppWrapper logged={user.isAuthenticated}>
            <Helmet
              defer={false}
              htmlAttribsassutes={{ lang: 'pt-br' }}
              encodeSpecialCharacters={true}
              defaultTitle={config.name}
              titleTemplate={`%s | ${config.name}`}
              titleAttributes={{ itemprop: 'name', lang: 'pt-br' }}
            ></Helmet>
            {user.isAuthenticated && <Header dispatch={dispatch} user={user} />}
            {/* <Head /> */}
            <ToastContainer autoClose={3000} hideProgressBar />
            <Main isAuthenticated={user.isAuthenticated}>
              <Switch>
                <Routes
                  isAuthenticated={user.isAuthenticated}
                  paths={{
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
                  }}
                />
                <Route component={NotFound} />
              </Switch>
            </Main>
            {/* <Footer /> */}
            <SystemAlerts />
            <GlobalStyles />
          </AppWrapper>
        </ThemeProvider>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default hot(connect(mapStateToProps)(App));
