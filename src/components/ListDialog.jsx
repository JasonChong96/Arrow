import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Grid,
  Button,
  ButtonBase,
  Box,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AccountIcon from '@material-ui/icons/AccountCircle';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import theme from '../modules/theme';

const styles = {
  doneButton: {
    background: theme.palette.primary[500],
    borderRadius: '200px',
    color: 'white',
    textTransform: 'none',
    padding: '0.5em 1em 0.5em 1em',
  },
};

function ListDialog({
  classes,
  title,
  entries,
  getLabel,
  open,
  onClose,
  onRemove,
  onConfirm,
  canRemove,
}) {
  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogActions>
        <Grid container direction="column" spacing={1}>
          {entries.map(entry => (
            <>
              <Grid item container>
                <Grid
                  container
                  item
                  alignItems="center"
                  spacing={1}
                  style={{ color: 'black', fontSize: '1.25em' }}
                >
                  <Grid item>
                    <AccountIcon style={{ fontSize: '1.5em' }} />
                  </Grid>
                  <Grid
                    item
                    style={{
                      width: '60%',
                      textAlign: 'start',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    {getLabel(entry)}
                  </Grid>
                  {canRemove(entry) && (
                    <Grid item>
                      <Button onClick={() => onRemove(entry)}>
                        <CloseIcon style={{ fontSize: '2em' }} />
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item>
                <hr
                  style={{
                    border: '0.5px solid #F2F2F2',
                    height: '0.5px',
                    width: '90%',
                  }}
                />
              </Grid>
            </>
          ))}
        </Grid>
      </DialogActions>
      <DialogActions>
        <ButtonBase onClick={onClose}>
          <Box color={theme.palette.primary[500]}>Discard Changes</Box>
        </ButtonBase>
        <ButtonBase onClick={onConfirm}>
          <Box className={classes.doneButton}>Done!</Box>
        </ButtonBase>
      </DialogActions>
    </Dialog>
  );
}

ListDialog.propTypes = {
  canRemove: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  entries: PropTypes.array.isRequired,
  getLabel: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(ListDialog);
