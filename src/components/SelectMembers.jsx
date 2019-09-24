import React from 'react';
import { Grid, Box, withStyles, ButtonBase } from '@material-ui/core';
import PropTypes from 'prop-types';
import AccountIcon from '@material-ui/icons/AccountCircle';
import CircleIcon from './CircleIcon';
import TickIcon from '@material-ui/icons/Done';


const styles = {
}

function SelectMembers({ classes, members, isChosen }) {
    return members.map(member => (
        <Grid item>
            <ButtonBase>
                <Grid container item direction='column' spacing={1} style={{ width: 'auto' }} alignItems='center'>
                    <Grid item>
                        <CircleIcon
                            Icon={isChosen(member) ? TickIcon : () => <></>}
                            length='32px'
                            padding='8px'
                            opacity={isChosen(member) ? 1 : 0.6}
                            color='#C4C4C4' />
                    </Grid>
                    <Grid item>
                        <Box fontSize={12}>
                            {member.name}
                        </Box>
                    </Grid>
                </Grid>
            </ButtonBase>
        </Grid>
    ))
}

SelectMembers.propTypes = {
    members: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SelectMembers);

