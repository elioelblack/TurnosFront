import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CustomizedSnackbars(props) {
  console.log(props.setOpen)
  const classes = useStyles();
  const [open, setOpen] = React.useState(props.setOpen);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div className={classes.root}>      
      <Snackbar open={open} autoHideDuration={6000} onClose={()=>setOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={()=>setOpen(false)} severity={props.severity}>
          {props.msj}
        </Alert>
      </Snackbar>
      <Button id={"btn-show-alert"} variant="outlined" onClick={handleClick} style={{display:'none'}}>
        Open success snackbar
      </Button>
    </div>
  );
}
