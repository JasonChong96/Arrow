import React from 'react';
import PropTypes from 'prop-types';
import RoutePublic from './RoutePublic';
import RoutePrivate from './RoutePrivate';
import NotFound from 'routes/NotFound';
import { Route } from 'react-router-dom';

export default function Routes({ isAuthenticated, paths }) {
  return (
    <>
      {Object.entries(paths).map(([path, { component, isPublic, exact }], i) => {
        if (isPublic) {
          return (
            <RoutePublic
              key={path}
              isAuthenticated={isAuthenticated}
              path={path}
              exact={exact}
              component={component}
            />
          );
        } else {
          return (
            <RoutePrivate
              key={path}
              isAuthenticated={isAuthenticated}
              path={path}
              exact={exact}
              component={component}
            />
          );
        }
      })}
    </>
  );
}

Routes.propTypes = {
  isAuthenticated: PropTypes.bool,
  paths: PropTypes.object,
};
