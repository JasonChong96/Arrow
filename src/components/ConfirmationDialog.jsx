import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';


function ConfirmationDialog({ open, title, content: Content, confirmText, cancelText, onClose, onCancel, onConfirm }) {
    return <Dialog open={open} onClose={onClose}>
        <DialogTitle>
            {title}
        </DialogTitle>
        <DialogContent>
            <Content />
        </DialogContent>
        <DialogActions>
            <Button onClick={onCancel ? onCancel : onClose}>
                {cancelText}
            </Button>
            <Button onClick={onConfirm}>
                {confirmText}
            </Button>
        </DialogActions>
    </Dialog>
}

ConfirmationDialog.defaultProps = {
    confirmText: 'Yes',
    cancelText: 'No',
}

export default ConfirmationDialog;