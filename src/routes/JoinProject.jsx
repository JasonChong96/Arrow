import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { joinProject, setPendingJoin } from '../actions';
import ConfirmationDialog from '../components/ConfirmationDialog';
import Loader from '../components/Loader';
import { push } from '../modules/history';

const JoinProject = ({
  isAuthenticated,
  setPendingJoin,
  joinProject,
  match: {
    params: { code, title },
  },
}) => {
  if (!isAuthenticated) {
    setPendingJoin(code, title);
  }
  return (
    <>
      {isAuthenticated && (
        <>
          <Loader />
          <ConfirmationDialog
            open
            onClose={() => {}}
            onCancel={() => {
              setPendingJoin(null, null);
              push('/projects');
            }}
            onConfirm={() => {
              joinProject(code);
            }}
            title="Join Project"
            content={() => (
              <>
                {' '}
                You've been invited to project '{decodeURIComponent(title)}'
                <br />
                <br />
                Would you like to join this project?.
              </>
            )}
            cancelText="Not Now"
            confirmText="Yes!"
          />
        </>
      )}
      {!isAuthenticated && <Redirect to="/login" />}
    </>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated,
});

const mapDispatchToProps = dispatch => ({
  setPendingJoin: (code, title) => dispatch(setPendingJoin(code, title)),
  joinProject: code => dispatch(joinProject(code)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JoinProject);
