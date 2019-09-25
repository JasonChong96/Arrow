import React from 'react';
import { Grid, Box, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import theme from '../modules/theme';


const styles = {
    numberMargin: {
        marginTop: '-8px'
    },

    root: {
        padding: 5,
        margin: 5,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyItems: "start",
        borderRadius: "50%",
        width: 25,
        height: 25,
    },
}

function NumberCircle({ classes, num, color }) {
    return <div className={classes.root} style={{
        backgroundColor: color,
        color: 'black',
    }}>
        <Grid item >
            <Box fontSize={12}>
                {num}
            </Box>
        </Grid>
    </div>
}

NumberCircle.propTypes = {
    tasksLeft: PropTypes.number.isRequired,
    overdue: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
}

NumberCircle.defaultProps = {
    color: theme.palette.primary[200]
}

export default withStyles(styles)(NumberCircle);

