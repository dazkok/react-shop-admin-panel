import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function DeleteDialog(props: {
    id: number,
    open: boolean,
    onDelete: Function,
    setOpen: Function
}) {
    const handleClose = () => {
        props.setOpen(false);
    };

    const handleDelete = async () => {
        handleClose();
        props.onDelete(props.id);
    };

    return (
        <React.Fragment>
            <Dialog
                open={props.open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to delete?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action cannot be reversed.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant={'contained'} color={'primary'} onClick={handleClose}>No</Button>
                    <Button variant={'contained'} color={'error'} onClick={handleDelete} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}