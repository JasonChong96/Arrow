import React, { useState, useEffect } from 'react';
import { withStyles, Grid, Button, Typography, Container, Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Projects } from '../actions/user';
import UserTextField from '../components/UserTextField';
import theme from '../modules/theme';
import PasswordField from '../components/PasswordField';
import Header from '../components/Header';
import TitleOnlyHeader from '../components/TitleOnlyHeader';


function validateEmail(mail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
}

const styles = {
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        margin: '2em 0em 2em 0em',
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
    paperRoot: {
        borderRadius: 20,
        width: '100%',
        height: '100%',
        zIndex: 1200,
        marginTop: '-1em',
        flexGrow: 1,
    },
};

function Projects({ classes }) {
    useEffect(() => {
        dispatch(loadProjects());
    })
    return (
        <>
            <TitleOnlyHeader title="Account Details" backPath="/login" />
            <Paper elevation={5} className={classes.paperRoot}>
                <Container maxWidth="sm">
                </Container>
            </Paper>
        </>
    );
}

Projects.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default connect(null)(withStyles(styles)(Projects));
