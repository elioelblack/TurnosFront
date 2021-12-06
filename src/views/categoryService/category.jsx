import React, { Component } from "react";
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
    makeStyles, FormControlLabel,
    Tooltip
} from '@material-ui/core';
import Checkbox from '@mui/material/Checkbox';
import Page from 'src/components/Page';
import categoryService from './service/categoryService';
import FormDialog from '../../views/audit';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LinearProgress from '@mui/material/LinearProgress';
import InputMask from 'react-input-mask';
import MultipleSelectChip from "./MultipleSelectChip";

const action = solReact.getQueryVariable("action")

export default class Category extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nombre: '',
            descripcion: '',
            activo: true,
            prefijo:'',
            prioridad:1,
            icono:'',
            isLoading:false,
            rangoPrioridad: [1,2,3,4,5,6,7,8,9,10],
            estaciones:[],
            estacionesSeleted:[]
        }
    }

    componentDidMount() {
        if (action === 'view' || action === 'update') {
            const idParam = solReact.getQueryVariable("id")
            this.loadById(idParam)
            this.setState({ id: idParam })
            this.loadCategoriasPorEstaciones(idParam)
        }
        this.loadAllStation()
    }

    handleChangeMulti=(value)=>{
        console.log(value)
        this.setState({estacionesSeleted:value})
    }

    loadCategoriasPorEstaciones(idCategoria){
        categoryService.findcategoriasPorEstacionesByIdCategoria(idCategoria)
        .then(response=>{
            let data = response.data
            let dataFormated = []
            data.map(e=>{
                dataFormated.push(e.idEstacion.nombre)
            })
            console.log(dataFormated)
            this.setState({estacionesSeleted:dataFormated})
        }).catch(err=>{
            toast.error('Error al cargar estaciones de atencion')
        })
    }

    loadById(id) {
        categoryService.findById(id)
            .then(response => {
                let a = response.data
                this.setState({
                    nombre: a.nombre,
                    descripcion: a.descripcion!=null?a.descripcion:'',
                    activo: a.activo,
                    prefijo:a.prefijoTurno!=null?a.prefijoTurno:'',
                    prioridad:a.prioridad,
                })
            }).catch(err => {
                console.error(err)
            })
    }

    loadAllStation(){
        categoryService.findAllStations()
        .then(response=>{
            this.setState({estaciones:response.data})
        }).catch(err=>{
            toast.error('Error al cargar estaciones de atención')
        })
    }

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

    openModalAudit() {
        this.setState({ openModalAudit: true })
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

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ isLoading: true })
        if (this.state.nombre === '') {
            toast.warn('Nombre de la categoría es requerido')
            this.setState({ e_nombre: true })
            this.setState({ isLoading: false })
        }else if(this.state.prioridad===''){
            toast.warn('Prioridad es requerido')
            this.setState({e_prioridad:true})
            this.setState({ isLoading: false })
        } else {
            let obj = {
                nombre: this.state.nombre,
                descripcion: this.state.descripcion,
                prefijoTurno: this.state.prefijo,
                prioridad: this.state.prioridad,
                activo: this.state.activo,
                iconoCategoria: this.state.icono
            }
            if (action === 'update') {
                const idP = solReact.getQueryVariable("id")
                obj.idCategoriaTurnos = idP
            }
            this.save(obj)
        }
    }

    save(obj) {
        categoryService.save(obj)
            .then(response => {
                toast.success('Guardado correctamente')
                setTimeout(() => {
                    window.location = '/app/categories'
                }, 1000);
            }).catch(err => {
                toast.error(err)
                this.setState({ isLoading: false })
            })
    }

    render() {
        const style = this.useStyles
        return (
            <Page
                className={style.root}
                title="Categoría de turno"
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
                                    subheader="Detalles de categoría de turno"
                                    title="Categoría de turno"
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
                                                helperText={this.state.e_nombre ? "Ingresa el nombre de la categoría, por favor" : ""}
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
                                            <InputMask mask="aa" value={this.state.prefijo.toUpperCase()} onChange={this.handleChange.bind(this)} onBlur={this.handleChange.bind(this)} >
                                                {(inputProps) => <TextField {...inputProps}
                                                    fullWidth
                                                    label="Prefijo"
                                                    name="prefijo"
                                                    value={this.state.prefijo.toUpperCase()}
                                                    type="text"
                                                    variant="outlined"
                                                    helperText={this.state.e_dui ? this.state.e_dui_msj : ""}
                                                    error={this.state.e_dui}
                                                />}
                                            </InputMask>
                                        </Grid>
                                        <Grid
                                            item
                                            md={3}
                                            xs={12}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Prioridad"
                                                name="prioridad"
                                                onChange={this.handleChange.bind(this)}
                                                required
                                                select
                                                SelectProps={{ native: true }}
                                                value={this.state.prioridad}
                                                variant="outlined"
                                            >
                                                {this.state.rangoPrioridad.map((option) => (
                                                    <option
                                                        key={option}
                                                        value={option}
                                                    >
                                                        {option}
                                                    </option>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid
                                            item
                                            md={3}
                                            xs={12}
                                        ><Tooltip title={"Nombre del ícono (Cualquiera de https://fonts.google.com/icons)"}>
                                                <TextField
                                                    fullWidth
                                                    label="Ícono de categoría"
                                                    name="icono"
                                                    onChange={this.handleChange.bind(this)}
                                                    value={this.state.icono}
                                                    variant="outlined"
                                                />
                                            </Tooltip>
                                        </Grid>
                                        <Grid
                                            item
                                            md={3}
                                            xs={12}
                                        >
                                            <MultipleSelectChip data={this.state.estaciones} handleChangeMulti={this.handleChangeMulti} value={this.state.estacionesSeleted}/>
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
                                            onClick={(e) => { window.location = "/app/categories" }}
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