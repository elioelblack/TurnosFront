import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useEffect } from 'react';
import serviceAudit from './service/serviceAudit';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import moment from 'moment';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export default function FormDialog(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [infoAudit, setInfoAudit] = React.useState([]);
    console.log("En props : " + props.clave)
    const handleClickOpen = () => {
        setOpen(true);
        loadInfoAudit()
    };



    const handleClose = () => {
        setOpen(false);
    };

    const loadInfoAudit = () => {
        serviceAudit.loadAuditByIdPedido(props.clave).then(
            response => {
                setInfoAudit(response.data)
            }
        ).catch(err => {
            console.error(err)
        })
        console.log(serviceAudit.id)
    }

    // De forma similar a componentDidMount y componentDidUpdate
    useEffect(() => {
        // Actualiza el título del documento usando la API del navegador
        //setOpen(props.open);
        //loadInfoAudit()
    }, []);

    return (
        <>
            <Button variant="outlined" color="primary" style={{ marginLeft: 5 }}
            onClick={handleClickOpen} startIcon={<InfoIcon />}
            >
                Histórico
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth maxWidth={"lg"}>
                <DialogTitle id="form-dialog-title">Histórico del registro No. {props.id}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Fecha</TableCell>
                                        <TableCell align="left">Usuario</TableCell>
                                        <TableCell align="left">Acción</TableCell>
                                        <TableCell align="left">Valor anterior</TableCell>
                                        <TableCell align="left">Nuevo valor</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {infoAudit.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell component="th" scope="row">
                                                {moment(row.fecha).format("DD/MM/yyyy hh:mm:ss")}
                                            </TableCell>
                                            <TableCell align="left">{row.last_user}</TableCell>
                                            <TableCell align="left">{row.comentario}</TableCell>
                                            <TableCell align="left">{row.old_value}</TableCell>
                                            <TableCell align="left">{row.new_value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cerrar
            </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}