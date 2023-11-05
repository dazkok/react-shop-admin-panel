import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function InfoDialog(props: {
    dialogData: {
        show: boolean,
        title: string,
        message: string
    },
    setInfoDialog: Function
}) {
    const handleClose = () => {
        props.setInfoDialog({
            show: false,
            title: '',
            message: ''
        });
    };

    return (
        <React.Fragment>
            <Dialog
                open={props.dialogData.show}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {props.dialogData.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {props.dialogData.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant={'contained'} color={'primary'} onClick={handleClose} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}