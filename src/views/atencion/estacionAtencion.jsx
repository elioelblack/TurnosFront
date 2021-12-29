import React, { Component } from "react";
import {
    Button,
    Container,
    Typography
} from '@material-ui/core';
import Grid from '@mui/material/Grid';
import atencionService from "./service/atencionService";
import { toast } from "react-toastify";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import Context from 'src/Context';

export default class EstacionAtencion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrayEstaciones: [],
            open: false,
            isLoading: false,
            estacionSelected: {},
            isStationSelected: false
        }
    }

    componentDidMount() {
        this.loadEstacionesDisponibles()
    }

    loadEstacionesDisponibles() {
        atencionService.findAllEstacionesDisponibles()
            .then(response => {
                this.setState({ arrayEstaciones: response.data })
            }).catch(err => {
                toast.error('Error al cargar estaciones disponibles')
            })
    }

    renderEstaciones() {
        return (
            this.state.arrayEstaciones.map(
                c => {
                    return (
                        <Grid key={c.idEstacion} item xs={6} md={6}>
                            <Card sx={{ minWidth: 50 }}
                                onClickCapture={(e) => this.onClickEstacion(e, c)}>
                                <CardActionArea>
                                    <CardContent style={{ textAlign: 'center' }}>
                                        <Typography sx={{ fontSize: 14 }} color="textPrimary" gutterBottom>
                                            {c.nombre}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    )
                }
            )
        )
    }

    onClickEstacion(e, data) {
        this.setState({
            open: true,
            estacionSelected: data
        })
    }

    handleCancel() {
        this.setState({ open: false })
    }

    handleOk(data) {
        atencionService.save(this.state.estacionSelected)
            .then(response => {
                toast.success('Estación actualizada correctamente.')
                this.setState({ open: false })
                //console.log(response.data)
                this.setStationContext(response.data)
            }).catch(err => {
                //console.error()
                toast.error('Error al actualizar estación!')
            })
    }

    setStationContext(data) {
        //console.log('data ' + data)
        this.setState({ isStationSelected: data })

    }

    render() {
        return (
            <Container maxWidth="xl">
                <Typography variant="h2" gutterBottom component="div" mb={10}>
                    Seleccione la estación que atenderá
                </Typography>
                <Grid container spacing={2}>
                    {this.renderEstaciones()}
                </Grid>
                <Dialog
                    sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
                    maxWidth="xs"
                    open={this.state.open}
                >
                    <DialogTitle>Confirme que va a ocupar {this.state.estacionSelected.nombre}</DialogTitle>
                    <DialogContent dividers>
                        <Typography variant="body1" gutterBottom>
                            Al seleccionar esta estación, nadie más podrá ocuparla, y estará ligada a esta sesión de usuario.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={this.handleCancel.bind(this)}>
                            Cancel
                        </Button>
                        <Button onClick={this.handleOk.bind(this)}>Ok</Button>
                    </DialogActions>
                </Dialog>
                {this.state.isStationSelected && <Context.Consumer>
                    {({ selectStationToAttend }) => {
                        return (
                            selectStationToAttend(this.state.estacionSelected)
                        )
                    }}
                </Context.Consumer>}
            </Container>
        )
    }
}