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

import Home from 'routes/Home';
import NotFound from 'routes/NotFound';

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
import ProjectDetails from '../routes/ProjectDetails';
import EditTask from '../routes/EditTask';
import EditSubTask from '../routes/EditSubTask';
import JoinProject from '../routes/JoinProject';
import { Detector } from 'react-detect-offline';
import { setConnectionState } from '../actions';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  opacity: 1 !important;
  position: relative;
  transition: opacity 0.5s;
`;

const Main = styled.main`
  min-height: 100vh;
`;

const styles = {
  main: {
    display: 'flex',
    justifyItems: 'start',
    zIndex: 1200,
    flexDirection: 'column',
    minWidth: 350,
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
  '/projects': {
    component: Projects,
    isPublic: false,
    exact: false,
  },
  '/project/:code': {
    component: ProjectDetails,
    isPublic: false,
    exact: true,
  },
  '/project/:code/join/:title': {
    component: JoinProject,
    exact: true,
  },
  '/project/:code/edit': {
    component: CreateProject,
    isPublic: false,
    exact: true,
  },
  '/project/:code/createtask': {
    component: EditTask,
    isPublic: false,
    exact: true,
  },
  '/project/:code/tasks/:taskid': {
    component: EditTask,
    isPublic: false,
    exact: true,
  },
  '/project/:code/tasks/:taskid/createsubtask': {
    component: EditSubTask,
    isPublic: false,
    exact: true,
  },
  '/project/:code/tasks/:taskid/subtasks/:subtaskid': {
    component: EditSubTask,
    isPublic: false,
    exact: true,
  },
  '/createproject': {
    component: CreateProject,
    isPublic: false,
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
      <Router history={history} basename='/'>
        <Detector
          polling={{ url: 'https://bzbee.herokuapp.com/' }}
          render={({ online }) => {
            dispatch(setConnectionState(online))
            return <> </>
          }}
        />
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
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default hot(withStyles(styles)(connect(mapStateToProps)(App)));
