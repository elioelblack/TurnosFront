import React, { Component } from 'react';
import solReact from 'src/js/solReact';
import {
    Box,
    Button,
    Container,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    TextField,
    makeStyles, FormControlLabel
} from '@material-ui/core';
import Checkbox from '@mui/material/Checkbox';
import Page from 'src/components/Page';
import stationService from './service/stationService';
import FormDialog from '../../views/audit';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LinearProgress from '@mui/material/LinearProgress';

const action = solReact.getQueryVariable("action")
class StationView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            nombre: '',
            e_nombre: false,
            descripcion: '',
            activo: true,
            sucursales: [
                { value: 1, label: 'Central' }
            ],
            id_sucursal: 1,
            ocupado: false,
            isLoading: false
        }
    }

    componentDidMount() {
        if (action === 'view' || action === 'update') {
            const idParam = solReact.getQueryVariable("id")
            this.loadStationById(idParam)
            this.setState({ id: idParam })
        }
        this.loadAllSites()
    }

    loadAllSites() {
        stationService.findAllSites()
            .then(response => {
                this.setState({sucursales:response.data})
            }).catch(err => {
                toast.error('Error al cargar sucursales')
            })
    }

    loadStationById(id) {
        stationService.findById(id)
            .then(response => {
                let a = response.data
                this.setState({
                    nombre: a.nombre,
                    descripcion: a.descripcion,
                    activo: a.activo,
                    ocupado: a.ocupado,
                    id_sucursal: a.idSucursal.idSucursal
                })
            }).catch(err => {
                console.error(err)
            })
    }

    useStyles = makeStyles((theme) => ({
        root: {
            backgroundColor: theme.palette.background.dark,
            minHeight: '90%',
            paddingBottom: theme.spacing(3),
            paddingTop: theme.spacing(3),
            marginTop: theme.spacing(3)
        }
    }));

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleChangeChk(e) {
        this.setState({
            [e.target.name]: e.target.checked
        });
    };

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ isLoading: true })
        if (this.state.nombre === '') {
            toast.warn('Nombre de la estación es requerido')
            this.setState({ e_nombre: true })
            this.setState({ isLoading: false })
        } else {
            let obj = {
                nombre: this.state.nombre,
                descripcion: this.state.descripcion,
                ocupado: this.state.ocupado,
                idSucursal: { idSucursal: parseInt(this.state.id_sucursal) },
                activo: this.state.activo,
            }
            if (action === 'update') {
                const idP = solReact.getQueryVariable("id")
                obj.idEstacion = idP
            }
            this.save(obj)
        }
    }

    save(obj) {
        stationService.save(obj)
            .then(response => {
                toast.success('Guardado correctamente')
                setTimeout(() => {
                    window.location = '/app/stations'
                }, 1000);
            }).catch(err => {
                console.error(err)
                this.setState({ isLoading: false })
            })
    }

    openModalAudit() {
        this.setState({ openModalAudit: true })
    }

    render() {
        const style = this.useStyles
        return (
            <Page
                className={style.root}
                title="Estación de atención"
            >
                <Container maxWidth={false}>
                    <Box mt={3}>
                        <form
                            autoComplete="off"
                            noValidate
                            onSubmit={this.handleSubmit.bind(this)}
                        >
                            <Card>
                                <CardHeader
                                    subheader="Detalles de Estación de Atención"
                                    title="Estación"
                                />
                                <Divider />
                                <CardContent>
                                    <Grid
                                        container
                                        spacing={3}
                                    >
                                        <Grid
                                            item
                                            md={3}
                                            xs={12}
                                        >
                                            <TextField
                                                fullWidth
                                                helperText={this.state.e_nombre ? "Ingresa el nombre de la estación, por favor" : ""}
                                                label="Nombre"
                                                name="nombre"
                                                onChange={this.handleChange.bind(this)}
                                                required
                                                value={this.state.nombre}
                                                variant="outlined"
                                                error={this.state.e_nombre}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={3}
                                            xs={12}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Descripción"
                                                name="descripcion"
                                                onChange={this.handleChange.bind(this)}
                                                value={this.state.descripcion}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={3}
                                            xs={12}
                                        >
                                            <FormControlLabel control={<Checkbox
                                                checked={this.state.activo}
                                                name="activo"
                                                onChange={this.handleChangeChk.bind(this)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />} label="Activo" />
                                        </Grid>
                                        <Grid
                                            item
                                            md={3}
                                            xs={12}
                                        >
                                            <FormControlLabel control={<Checkbox
                                                checked={this.state.ocupado}
                                                name="ocupado"
                                                onChange={this.handleChangeChk.bind(this)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />} label="Ocupado" />
                                        </Grid>
                                        <Grid
                                            item
                                            md={3}
                                            xs={12}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Sucursal"
                                                name="id_sucursal"
                                                onChange={this.handleChange.bind(this)}
                                                required
                                                select
                                                SelectProps={{ native: true }}
                                                value={this.state.id_sucursal}
                                                variant="outlined"
                                            >
                                                {this.state.sucursales.map((option) => (
                                                    <option
                                                        key={option.idSucursal}
                                                        value={option.idSucursal}
                                                    >
                                                        {option.nombre}
                                                    </option>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <Divider />
                                {!this.state.isLoading ?
                                    <Box
                                        display="flex"
                                        justifyContent="left"
                                        p={2}
                                    >
                                        {(action !== 'view') && <Button
                                            color="primary"
                                            variant="contained"
                                            type="submit"
                                        >
                                            Guardar
                                        </Button>}
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            style={{ marginLeft: 5 }}
                                            onClick={(e) => { window.location = "/app/stations" }}
                                        >
                                            Regresar
                                        </Button>
                                        <FormDialog onClick={this.openModalAudit.bind(this)} open={this.state.openModalAudit} clave={"usuario/" + this.state.id_usuario} id={this.state.id_usuario} />
                                    </Box> : <LinearProgress />}
                            </Card>
                        </form>
                    </Box>
                </Container>
            </Page>
        )
    }
}

export default StationView;