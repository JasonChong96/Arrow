import React from 'react';
import { Grid, Box, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import theme from '../modules/theme';


const styles = {

    root: {
        borderRadius: "50%",
        width: '16px',
        height: '16px',
    },
}

function CircleOutlined({ classes, color }) {
    return <div className={classes.root} style={{
        border: '1px solid' + color,
    }}>
    </div>
}

CircleOutlined.propTypes = {
    color: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(CircleOutlined);

