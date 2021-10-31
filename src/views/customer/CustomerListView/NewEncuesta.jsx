import React, { Component } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
    Box,
    Container,
    makeStyles,
    Card,
    Button,
    Typography,
    TextField,
    CardHeader,
    Divider,
    Grid,
    Paper, Select,
    TableContainer, Table, InputLabel, MenuItem,
    TableHead, TableRow, TableCell, FormControlLabel,
    TableBody, Checkbox, Radio, RadioGroup, FormControl, FormLabel
} from '@material-ui/core';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import clsx from 'clsx';
import EncuestaService, { findAllr } from '../service/encuestaService';
import solReact from 'src/js/solReact';
import InputGeneric from '../../../components/InputGeneric';
import CustomizedSnackbars from '../../../components/CustomizedSnackbars';
import encuestaService from '../service/encuestaService';
import moment from 'moment';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
  import DateFnsUtils from '@date-io/date-fns';
import FormDialog from '../../audit';
import InputMask from 'react-input-mask';
import Tooltip from '@material-ui/core/Tooltip';
import { FormHelperText } from '@material-ui/core';

const parameter = solReact.getQueryVariable("action");
export default class NewEncuesta extends Component {
    constructor(props) {
        super(props)
        this.state = {
            infoEncuesta: {},
            preguntas: [],
            items: [],
            respuestas: [],
            isError: false,
            helperText: '',
            nombre_usuario: '',
            nombre_puesto: '',
            direccion_puesto: '',
            openAlert: false,
            msj: '',
            severity: 'info',
            permiso2:false,
            fecha_inicio:new Date(),
            fecha_fin:new Date(),
            openModalAudit:false,
            id_distrito_from_user:0,
            arrayEncuestas:[],
            id_encuesta:null
        }
    }

    componentDidMount() {
        const action = solReact.getQueryVariable("action");
        let idPedido = null;
        if (action === 'update') {
            idPedido = solReact.getQueryVariable("id")
            this.loadEncuestaInfo(idPedido)
            this.loadPreguntasByIdEncuesta(idPedido)
            this.loadRespuestaByIdPedido(idPedido)
        }
        this.loadDistritoFromUser();
        this.loadEncuestas();
        //await this.onExistPatientById(parameter2);
        //console.log("action: " + parameter)
    }

    loadDistritoFromUser(){
        EncuestaService.whoami()
        .then(response=>{
            console.log("whoami: " + response.data.id_distrito)
            this.setState({id_distrito_from_user:response.data.id_distrito})
        })
    }

    loadEncuestas(){
        EncuestaService.getAllEncuestas()
        .then(
            response=>{
                this.setState({arrayEncuestas:response.data})
            }
        ).catch(err=>console.error(err))
    }

    loadEncuestaInfo(id) {
        EncuestaService.findById(id)
            .then(response => {
                console.log(response.data)
                this.setState({ infoEncuesta: response.data })
                this.setState({
                    nombre_usuario: this.state.infoEncuesta.nombre_usuario,
                    nombre_puesto: this.state.infoEncuesta.nombre_puesto,
                    direccion_puesto: this.state.infoEncuesta.direccion_puesto,
                    referencia:this.state.infoEncuesta.referencia,
                    censo:response.data.censo,
                    dui:response.data.dui,
                    nit:response.data.nit,
                    edad:'fixme',
                    telefono:response.data.telefono,
                    asociacion:parseInt(response.data.asociacion),
                    actividad_comercial:parseInt(response.data.actividad_comercial),
                    largo:response.data.largo,
                    ancho:response.data.ancho,
                    nombre_beneficiario:response.data.nombre_beneficiario,
                    direccion_beneficiario:response.data.direccion_beneficiario,
                    dui_beneficiario:response.data.dui_beneficiario,
                    nit_beneficiario:response.data.nit_beneficiario,
                    telefono_beneficiario:response.data.telefono_beneficiario,
                    permiso2:response.data.permiso,
                    cep:response.data.cep,
                    fecha_inicio: response.data.fecha_inicio,
                    fecha_fin:response.data.fecha_fin
                })
                //alert(moment(this.state.fecha_fin).format("YYYY-MM-DD"))
            }).catch(
                err => {
                    console.error(err)
                }
            )
    }

    loadPreguntasByIdEncuesta(id) {
        EncuestaService.findPreguntasById(id)
            .then(response => {
                //console.info("loadPreguntasByIdEncuesta>")
                //console.log(response.data)
                this.setState({ preguntas: response.data })
                setTimeout(() => { console.log(this.state.infoEncuesta.preguntas) }, 3000);
                this.fillDataPreguntas(response.data)
            }).catch(
                err => {
                    console.error(err)
                }
            )
    }

    loadRespuestaByIdPedido(id) {
        EncuestaService.findRespuestasById(id)
            .then(response => {
                //console.info("loadRespuestaByIdPedido>")
                //console.log(response.data)
                this.setState({ respuestas: response.data })
            }).catch(
                err => {
                    console.error(err)
                }
            )
    }



    fillDataPreguntas(objP) {
        const datosJson = objP
        let jerarquia = datosJson.reduce((acc, elem) => {
            acc[elem.categoria] = acc[elem.categoria] || [];
            if (!acc[elem.categoria].includes(elem.id_pregunta)) {
                acc[elem.categoria].push(
                    ({
                        "id_pregunta": elem.id_pregunta,
                        "last_user": elem.last_user,
                        "nombre_pregunta": elem.nombre_pregunta,
                        "estado": elem.estado,
                        "categoria": elem.categoria,
                        "id_respuesta_selected": elem.id_respuesta_selected
                    })
                );
            }
            return acc;
        }, {});

        //console.info("jerarquia>")
        //console.log(jerarquia)
        let result = []
        for (var i in jerarquia) {
            result.push([i, jerarquia[i]]);
        }
        //console.log(result)
        this.setState({ items: result })
        //this.makeDataTable(jerarquia)
    }

    makeDataTable(preguntas) {
        let result = []
        for (var i in preguntas) {
            result.push([i, preguntas[i]]);
        }
        //console.log(result)
        this.setState({ items: result })

    }

    openModalAudit(){
        //alert("hola mundo");
        this.setState({openModalAudit:true})
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.nombre_usuario === '') {
            this.ShowAlert('Nombre Usuario')
        } else if (this.state.nombre_puesto === '') {
            this.ShowAlert('Nombre Puesto')
        } else if (this.state.direccion_puesto === '') {
            this.ShowAlert('Dirección Puesto')
        }else{
            const idParam = solReact.getQueryVariable("id")
            let obj = {
                nombre_usuario: this.state.nombre_usuario,
                nombre_puesto: this.state.nombre_puesto,
                direccion_puesto: this.state.direccion_puesto,
                id: idParam,
                referencia:this.state.referencia,
                    censo:this.state.censo,
                    dui:this.state.dui,
                    nit:this.state.nit,
                    edad:'fixme',
                    telefono:this.state.telefono,
                    asociacion:parseInt(this.state.asociacion),
                    actividad_comercial:parseInt(this.state.actividad_comercial),
                    largo:this.state.largo,
                    ancho:this.state.ancho,
                    nombre_beneficiario:this.state.nombre_beneficiario,
                    direccion_beneficiario:this.state.direccion_beneficiario,
                    dui_beneficiario:this.state.dui_beneficiario,
                    nit_beneficiario:this.state.nit_beneficiario,
                    telefono_beneficiario:this.state.telefono_beneficiario,
                    permiso:this.state.permiso2,
                    cep:this.state.cep,
                    fecha_inicio: this.state.fecha_inicio,
                    fecha_fin:this.state.fecha_fin
            }

            this.update(idParam, obj)
        }
    }

    update(id, data) {
        let btnShow = document.getElementById("btn-show-alert");
        EncuestaService.updatePedido(id, data)
            .then(response => {
                //console.log(response)
                this.setState({
                    openAlert: true,
                    msj: "Modificado correctamente!",
                    severity: 'success'
                })
                btnShow.click()
            }).catch(err => {
                console.error(err)
                this.setState({
                    openAlert: true,
                    msj: err,
                    severity: 'error'
                })
                btnShow.click()
            })
    }

    ShowAlert(campo) {
        let btnShow = document.getElementById("btn-show-alert");
        this.setState({
            openAlert: true,
            msj: campo + " no puede ser vacío!",
            severity: 'warning'
        })
        btnShow.click()
    }

    onChanteText(e) {
        console.log(e.target.name)
        console.log(e.target.value)
        this.setState({ [e.target.name]: e.target.value })
        //this.setState({[e.target.name]:[e.value]})
    }

    onChanteChk(e) {
        console.log(e.target.name)
        console.log(e.target.checked)
        this.setState({ [e.target.name]: e.target.checked })
        //this.setState({[e.target.name]:[e.value]})
    }

    useStyles2 = makeStyles((theme) => ({
        root: {
            backgroundColor: 'black',
            minHeight: '20px',
            paddingBottom: theme.spacing(3),
            paddingTop: theme.spacing(3),
            paddingLeft: 10
        },
        root2: {
            ...theme.typography,
        },
        paper: {
            padding: theme.spacing(3),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        formControl: {
            display: 'block',
            width: '100 %',
            padding: '.375rem .75rem',
            fontSize: '1rem',
            lineHeight: '1.5',
            color: '#495057',
            backgrounColor: '#fff',
            backgroundClip: 'padding - box',
            border: '1px solid #ced4da',
            borderRadius: '.25rem',
            transition: 'border - color .15s ease -in -out, box - shadow .15s ease -in -out'
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
    }));
    onclickPermiso=(e)=>{
        alert(e)
    }


    render() {
        const action = parameter;
        const classes = this.useStyles2;
        return (
            <Page
                className={classes.root}
                title="Encuesta"
            >
                <Container maxWidth={false}>
                    <Box mt={3}>
                        <Card className={clsx(classes.root2)} style={{ padding: 10 }} >
                            <CardHeader
                                subheader="Ficha de Identificación del Usuario/Puesto"
                                title={action !== 'update' ? "Crear encuesta" : "Editar Solicitd"}
                            />
                            <Divider />
                            {(action === 'new') &&
                                <Formik
                                    initialValues={{
                                        nombre_usuario: '',
                                        nombre_puesto: '',
                                        direccion_puesto: '',
                                        id_encuesta: 0,
                                        referencia:'',
                                        censo:'',
                                        dui:'',
                                        nit:'',
                                        edad:'',
                                        telefono:'',
                                        asociacion:1,
                                        actividad_comercial:1,
                                        largo:0,
                                        ancho:0,
                                        nombre_beneficiario:'',
                                        direccion_beneficiario:'',
                                        dui_beneficiario:'',
                                        nit_beneficiario:'',
                                        telefono_beneficiario:'',
                                        permiso:false,
                                        cep:'',
                                        fecha_inicio:new Date(),
                                        fecha_fin:new Date(),
                                        id_distrito:this.state.id_distrito_from_user
                                    }}
                                    validationSchema={Yup.object().shape({
                                        nombre_usuario: Yup.string().max(255).required('Usuario es requerido'),
                                        nombre_puesto: Yup.string().max(255).required('Puesto es requerida'),
                                        direccion_puesto: Yup.string().max(255).required('Direccion Puesto es requerida'),
                                        nit:Yup.string().max(255).required('NIT es requerido'),
                                        telefono:Yup.string().max(255).required('Telefono es requerido'),
                                        largo:Yup.string().max(255).required('Largo es requerido'),
                                        ancho:Yup.string().max(255).required('Ancho es requerido'),
                                        cep:Yup.string().max(255).required('CEP es requerido'),
                                        id_encuesta:Yup.number().min(1,'No puede se vacío')
                                    })}
                                    onSubmit={(values, isSubmitting) => {
                                        values.id_distrito = this.state.id_distrito_from_user;
                                        console.log(values)
                                        isSubmitting = true;
                                        EncuestaService.save(values)
                                            .then(response => {
                                                //console.log(response.data)
                                                window.location = "encuesta?action=update&id=" + response.data.id
                                            }).catch(
                                                err => {
                                                    console.error(err)
                                                }
                                            )
                                    }}
                                >
                                    {({
                                        errors,
                                        handleBlur,
                                        handleChange,
                                        handleSubmit,setFieldValue,
                                        isSubmitionCompleted,
                                        touched,
                                        values
                                    }) => (
                                        <form onSubmit={handleSubmit}>
                                            <Grid
                                                container
                                                spacing={2}
                                                wrap="wrap"
                                            >
                                                <Grid
                                                    className={classes.item}
                                                    item
                                                    md={6}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <FormControl style={{ width: "100%", marginTop:10 }} error={Boolean(touched.id_encuesta && errors.id_encuesta)} variant="outlined" className={classes.formControl}>
                                                        <InputLabel id="demo-simple-select-outlined-label">Encuesta</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-outlined-label"
                                                            id="id_encuesta"
                                                            name="id_encuesta"
                                                            value={parseInt(values.id_encuesta)}
                                                            onChange={handleChange}
                                                            label="Seleccione la encuesta"
                                                            fullWidth
                                                            margin="dense"
                                                            error={Boolean(touched.id_encuesta && errors.id_encuesta)}
                                                        >
                                                            <MenuItem value={0}>Seleccione encuesta</MenuItem>
                                                            {
                                                                this.state.arrayEncuestas.map(
                                                                    e=>{
                                                                        return(
                                                                            <MenuItem key={e.id} value={e.id}>{e.nombre_encuesta}</MenuItem>
                                                                        )
                                                                    }
                                                                )
                                                            }
                                                        </Select>
                                                        <FormHelperText>Seleccione una encuesta</FormHelperText>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                container
                                                spacing={2}
                                                wrap="wrap"
                                            >
                                                <Grid
                                                    className={classes.item}
                                                    item
                                                    md={6}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <TextField
                                                        error={Boolean(touched.nombre_usuario && errors.nombre_usuario)}
                                                        fullWidth
                                                        helperText={touched.nombre_usuario && errors.nombre_usuario}
                                                        label="Nombre de usuario"
                                                        margin="dense"
                                                        name="nombre_usuario"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        type="text"
                                                        value={values.nombre_usuario}
                                                        variant="outlined"
                                                    />
                                                    <TextField
                                                        error={Boolean(touched.nombre_puesto && errors.nombre_puesto)}
                                                        fullWidth
                                                        helperText={touched.nombre_puesto && errors.nombre_puesto}
                                                        label="Nombre del puesto"
                                                        margin="dense"
                                                        name="nombre_puesto"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        type="text"
                                                        value={values.nombre_puesto}
                                                        variant="outlined"
                                                    />
                                                    <TextField
                                                        error={Boolean(touched.direccion_puesto && errors.direccion_puesto)}
                                                        fullWidth
                                                        helperText={touched.direccion_puesto && errors.direccion_puesto}
                                                        label="Dirección del puesto"
                                                        margin="dense"
                                                        name="direccion_puesto"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        type="text"
                                                        value={values.direccion_puesto}
                                                        variant="outlined"
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                container
                                                spacing={2}
                                                wrap="wrap"
                                            >
                                                <Grid
                                                    className={classes.item}
                                                    item
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <TextField
                                                        fullWidth
                                                        label="No. Referencia"
                                                        margin="dense"
                                                        name="referencia"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        type="text"
                                                        value={values.referencia}
                                                        variant="outlined"
                                                    />
                                                </Grid>
                                                <Grid
                                                    className={classes.item}
                                                    item
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <TextField
                                                        fullWidth
                                                        label="Censo"
                                                        margin="dense"
                                                        name="censo"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        type="text"
                                                        value={values.censo}
                                                        variant="outlined"
                                                    />
                                                </Grid>
                                                <Grid
                                                    className={classes.item}
                                                    item
                                                    md={4}
                                                    sm={4}
                                                    xs={12}
                                                >
                                                    <InputMask mask="99999999-9" value={values.dui} onChange={handleChange} onBlur={handleBlur}>
                                                    {(inputProps) =><TextField
                                                            fullWidth
                                                            label="DUI"
                                                            margin="dense"
                                                            name="dui"
                                                            type="text"
                                                            value={values.dui}
                                                            variant="outlined"
                                                        />}
                                                    </InputMask>
                                                </Grid>
                                                <Grid
                                                    className={classes.item}
                                                    item
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <InputMask mask="9999-999999-999-9" value={values.nit} onChange={handleChange} onBlur={handleBlur}>
                                                        {(inputProps) =><TextField
                                                            fullWidth
                                                            label="NIT"
                                                            margin="dense"
                                                            name="nit"
                                                            type="text"
                                                            value={values.nit}
                                                            variant="outlined"
                                                            error={Boolean(touched.nit && errors.nit)}
                                                            helperText={touched.nit && errors.nit}
                                                        />}
                                                    </InputMask>
                                                </Grid>
                                                <Grid
                                                    className={classes.item}
                                                    item
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >

                                                    <TextField
                                                        fullWidth
                                                        label="Edad"
                                                        margin="dense"
                                                        name="edad"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        type="text"
                                                        value={values.edad}
                                                        variant="outlined"
                                                        disabled
                                                    />
                                                </Grid>
                                                <Grid
                                                    className={classes.item}
                                                    item
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >

                                                    <TextField
                                                        fullWidth
                                                        label="Telefono"
                                                        margin="dense"
                                                        name="telefono"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        type="text"
                                                        value={values.telefono}
                                                        variant="outlined"
                                                        error={Boolean(touched.telefono && errors.telefono)}
                                                        helperText={touched.telefono && errors.telefono}
                                                    />
                                                </Grid>
                                                <Grid
                                                    className={classes.item}
                                                    item
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <FormControl style={{ width: "100%" }} variant="outlined" className={classes.formControl}>
                                                        <InputLabel id="demo-simple-select-outlined-label">Asociacion</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-outlined-label"
                                                            id="demo-simple-select-outlined"
                                                            value={values.asociacion}
                                                            onChange={handleChange}
                                                            label="Asociacion"
                                                            fullWidth
                                                            margin="dense"
                                                        >
                                                            <MenuItem value={1}>No especificada</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>

                                                <Grid
                                                    className={classes.item}
                                                    item
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <FormControl style={{ width: "100%" }} variant="outlined" className={classes.formControl}>
                                                        <InputLabel id="demo-simple-select-outlined-label">Actividad Comercial</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-outlined-label"
                                                            id="demo-simple-select-outlined"
                                                            value={values.actividad_comercial}
                                                            onChange={handleChange}
                                                            label="Actividad Comercial"
                                                            fullWidth
                                                            margin="dense"
                                                        >
                                                            <MenuItem value={1}>No especificada</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>

                                            </Grid>
                                            <Box my={2} style={{}}>
                                                <fieldset style={{ borderRadius: 3, borderColor: 'rgba(0, 0, 0, 0.12)', padding: 3 }}>
                                                    <legend style={{ margin: 5 }}>Espacio público:</legend>
                                                    <Grid
                                                        container
                                                        spacing={2}
                                                        wrap="wrap"
                                                    >
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                fullWidth
                                                                label="Largo"
                                                                margin="dense"
                                                                name="largo"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                type="text"
                                                                value={values.largo}
                                                                variant="outlined"
                                                                style={{ margin: 10 }}
                                                                error={Boolean(touched.largo && errors.largo)}
                                                                helperText={touched.largo && errors.largo}
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                fullWidth
                                                                label="Ancho"
                                                                margin="dense"
                                                                name="ancho"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                type="text"
                                                                value={values.ancho}
                                                                variant="outlined"
                                                                style={{ margin: 10 }}
                                                                error={Boolean(touched.ancho && errors.ancho)}
                                                                helperText={touched.ancho && errors.ancho}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </fieldset>
                                            </Box>
                                            {/***********************BOX BENEFICIARIO*********************/}
                                            <Box my={2} style={{}}>
                                                <fieldset style={{ borderRadius: 3, borderColor: 'rgba(0, 0, 0, 0.12)', padding: 3 }}>
                                                    <legend style={{ margin: 5 }}>Beneficiario:</legend>
                                                    <Grid
                                                        container
                                                        spacing={2}
                                                        wrap="wrap"
                                                    >
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                fullWidth
                                                                label="Nombre beneficiario"
                                                                margin="dense"
                                                                name="nombre_beneficiario"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                type="text"
                                                                value={values.nombre_beneficiario}
                                                                variant="outlined"
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                fullWidth
                                                                label="Direccion beneficiario"
                                                                margin="dense"
                                                                name="direccion_beneficiario"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                type="text"
                                                                value={values.direccion_beneficiario}
                                                                variant="outlined"
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <InputMask mask="99999999-9" value={values.dui_beneficiario} onChange={handleChange} onBlur={handleBlur}>
                                                            {(inputProps) =><TextField
                                                                    fullWidth
                                                                    label="DUI beneficiario"
                                                                    margin="dense"
                                                                    name="dui_beneficiario"
                                                                    type="text"
                                                                    value={values.dui_beneficiario}
                                                                    variant="outlined"
                                                                />}
                                                            </InputMask>
                                                        </Grid>
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <InputMask mask="9999-999999-999-9" value={values.nit_beneficiario} onChange={handleChange} onBlur={handleBlur}>
                                                            {(inputProps) =><TextField
                                                                    fullWidth
                                                                    label="NIT beneficiario"
                                                                    margin="dense"
                                                                    name="nit_beneficiario"
                                                                    type="text"
                                                                    value={values.nit_beneficiario}
                                                                    variant="outlined"
                                                                />}
                                                            </InputMask>
                                                        </Grid>
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                fullWidth
                                                                label="Telefono beneficiario"
                                                                margin="dense"
                                                                name="telefono_beneficiario"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                type="text"
                                                                value={values.telefono_beneficiario}
                                                                variant="outlined"
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </fieldset>
                                            </Box>
                                            <Grid
                                                container
                                                spacing={2}
                                                wrap="wrap"
                                            >
                                                <Grid
                                                    className={classes.item}
                                                    item
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <FormControlLabel
                                                        value={values.permiso}
                                                        control={<Checkbox name="permiso" color="primary" checked={this.state.permiso} 
                                                        onChange={handleChange} 
                                                        />}
                                                        label="¿Tiene permiso de comercialización?"
                                                        labelPlacement="start"
                                                    />

                                                </Grid>

                                            </Grid>
                                            <Box my={2} id="box-permiso" style={(!values.permiso)?{display:'none'}:{}}>
                                                <fieldset style={{ borderRadius: 3, borderColor: 'rgba(0, 0, 0, 0.12)', padding: 3 }}>
                                                    <legend style={{ margin: 5 }}>Permiso:</legend>
                                                    <Grid
                                                        container
                                                        spacing={2}
                                                        wrap="wrap"
                                                    >
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                fullWidth
                                                                label="EXP. CEP"
                                                                margin="dense"
                                                                name="cep"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                type="number"
                                                                value={values.cep}
                                                                variant="outlined"
                                                                error={Boolean(touched.cep && errors.cep)}
                                                                helperText={touched.cep && errors.cep}
                                                                inputProps={{ max: 13 }}
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <FormControl style={{ width: "100%" }} variant="outlined" className={classes.formControl}>
                                                                <InputLabel id="demo-simple-select-outlined-label">Distrito</InputLabel>
                                                                <Select
                                                                    labelId="demo-simple-select-outlined-label"
                                                                    id="demo-simple-select-outlined"
                                                                    name={"id_distrito"}
                                                                    value={this.state.id_distrito_from_user}
                                                                    onChange={handleChange}
                                                                    label="Delegación distrital"
                                                                    fullWidth
                                                                    margin="dense"
                                                                    disabled
                                                                >
                                                                    <MenuItem value="">
                                                                        <em>None</em>
                                                                    </MenuItem>
                                                                    <MenuItem value={1}>No especificado</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                id="fecha_inicio"
                                                                label="Fecha Inicio"
                                                                type="date"
                                                                defaultValue={moment(new Date(values.fecha_inicio)).format("YYYY-MM-DD")}
                                                                className={classes.textField}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                id="fecha_fin"
                                                                label="Fecha Fin"
                                                                type="date"
                                                                defaultValue={moment(new Date(values.fecha_fin)).format("YYYY-MM-DD")}
                                                                className={classes.textField}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </fieldset>
                                            </Box>
                                            <Box my={2}>
                                                <Button
                                                    color="primary"
                                                    disabled={isSubmitionCompleted}
                                                    fullWidth
                                                    size="large"
                                                    type="submit"
                                                    variant="contained"
                                                >
                                                    Guardar
                                                </Button>
                                            </Box>
                                        </form>
                                    )}
                                </Formik>/*Termina condicion si es duferente de new*/}
                            {
                                (action === 'update' && action.length > 0) &&
                                <>
                                    <form onSubmit={this.handleSubmit.bind(this)} noValidate autoComplete="off">
                                        <div style={{width:'100%'}}>
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography className={classes.heading}>Datos principales</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                    <Grid
                                                        container
                                                        spacing={2}
                                                        wrap="wrap"
                                                    >
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={12}
                                                            sm={12}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                fullWidth
                                                                label="Nombre de usuario"
                                                                margin="dense"
                                                                name="nombre_usuario"
                                                                onChange={this.onChanteText.bind(this)}
                                                                type="text"
                                                                value={this.state.nombre_usuario}
                                                                variant="outlined"
                                                                required
                                                            />
                                                        </Grid>

                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={12}
                                                            sm={12}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                fullWidth
                                                                label="Nombre Puesto"
                                                                margin="dense"
                                                                name="nombre_puesto"
                                                                onChange={this.onChanteText.bind(this)}
                                                                type="text"
                                                                value={this.state.nombre_puesto}
                                                                variant="outlined"
                                                                required
                                                            />
                                                        </Grid>

                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={12}
                                                            sm={12}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                fullWidth
                                                                label="Dirección Puesto"
                                                                required
                                                                margin="dense"
                                                                name="direccion_puesto"
                                                                onChange={this.onChanteText.bind(this)}
                                                                type="text"
                                                                value={this.state.direccion_puesto}
                                                                variant="outlined"
                                                            />
                                                        </Grid>
                                                    </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                        <Accordion>
                                            <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel2a-content"
                                            id="panel2a-header"
                                            >
                                            <Typography className={classes.heading}>Datos del puesto</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            <Grid
                                            container
                                                spacing={2}
                                                wrap="wrap"
                                            >
                                                <Grid
                                                    className={classes.item}
                                                    item
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <TextField
                                                        fullWidth
                                                        label="No. Referencia"
                                                        margin="dense"
                                                        name="referencia"
                                                        onBlur={this.onChanteText.bind(this)}
                                                        onChange={this.onChanteText.bind(this)}
                                                        type="text"
                                                        value={this.state.referencia}
                                                        variant="outlined"
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                                <Grid
                                                    className={classes.item}
                                                    item
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <TextField
                                                        fullWidth
                                                        label="Censo"
                                                        margin="dense"
                                                        name="censo"
                                                        onBlur={this.onChanteText.bind(this)}
                                                        onChange={this.onChanteText.bind(this)}
                                                        type="text"
                                                        value={this.state.censo}
                                                        variant="outlined"
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                                <Grid
                                                    className={classes.item}
                                                    item
                                                    md={4}
                                                    sm={4}
                                                    xs={12}
                                                >
                                                    <InputMask mask="99999999-9" value={this.state.dui} onBlur={this.onChanteText.bind(this)} onChange={this.onChanteText.bind(this)}>
                                                    {(inputProps) =><TextField
                                                            fullWidth
                                                            label="DUI"
                                                            margin="dense"
                                                            name="dui"
                                                            type="text"
                                                            value={this.state.dui}
                                                            variant="outlined"
                                                            InputLabelProps={{ shrink: true }}
                                                        />}
                                                    </InputMask>
                                                </Grid>
                                                <Grid
                                                    className={classes.item}
                                                    item
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <InputMask mask="9999-999999-999-9" value={this.state.nit} onBlur={this.onChanteText.bind(this)} onChange={this.onChanteText.bind(this)}>
                                                        {(inputProps) =><TextField
                                                            fullWidth
                                                            label="NIT"
                                                            margin="dense"
                                                            name="nit"
                                                            type="text"
                                                            value={this.state.nit}
                                                            variant="outlined"
                                                            InputLabelProps={{ shrink: true }}
                                                        />}
                                                    </InputMask>
                                                </Grid>
                                                <Grid
                                                    className={classes.item}
                                                    item
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >

                                                    <TextField
                                                        fullWidth
                                                        label="Edad"
                                                        margin="dense"
                                                        name="edad"
                                                        onBlur={this.onChanteText.bind(this)}
                                                        onChange={this.onChanteText.bind(this)}
                                                        type="text"
                                                        value={this.state.edad}
                                                        variant="outlined"
                                                        disabled
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                                <Grid
                                                    className={classes.item}
                                                    item
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >

                                                    <TextField
                                                        fullWidth
                                                        label="Telefono"
                                                        margin="dense"
                                                        name="telefono"
                                                        onBlur={this.onChanteText.bind(this)}
                                                        onChange={this.onChanteText.bind(this)}
                                                        type="text"
                                                        value={this.state.telefono}
                                                        variant="outlined"
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                                <Grid
                                                    className={classes.item}
                                                    item
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <FormControl style={{ width: "100%" }} variant="outlined" className={classes.formControl}>
                                                        <InputLabel id="demo-simple-select-outlined-label">Asociacion</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-outlined-label"
                                                            id="demo-simple-select-outlined"
                                                            value={parseInt(this.state.asociacion)}
                                                            onChange={this.onChanteText.bind(this)}
                                                            label="Asociacion"
                                                            fullWidth
                                                            margin="dense"
                                                        >
                                                            <MenuItem value={1}>No especificada</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>

                                                <Grid
                                                    className={classes.item}
                                                    item
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <FormControl style={{ width: "100%" }} variant="outlined" className={classes.formControl}>
                                                        <InputLabel id="actividad_comercial">Actividad Comercial</InputLabel>
                                                        <Select
                                                            labelId="actividad_comercial"
                                                            id="actividad_comercial"
                                                            name="actividad_comercial"
                                                            value={parseInt(this.state.actividad_comercial)}
                                                            onChange={this.onChanteText.bind(this)}
                                                            label="Actividad Comercial"
                                                            fullWidth
                                                            margin="dense"
                                                        >
                                                            <MenuItem value={1}>No especificada</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Box my={2} style={{width:'100%',padding:10}}>
                                                <fieldset style={{ borderRadius: 3, borderColor: 'rgba(0, 0, 0, 0.12)', padding: 3 }}>
                                                    <legend style={{ margin: 5 }}>Espacio público:</legend>
                                                    <Grid
                                                        container
                                                        spacing={2}
                                                        wrap="wrap"
                                                    >
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                fullWidth
                                                                label="Largo"
                                                                margin="dense"
                                                                name="largo"
                                                                onBlur={this.onChanteText.bind(this)}
                                                                onChange={this.onChanteText.bind(this)}
                                                                type="text"
                                                                value={this.state.largo}
                                                                variant="outlined"
                                                                style={{ margin: 10 }}
                                                                InputLabelProps={{ shrink: true }}
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                fullWidth
                                                                label="Ancho"
                                                                margin="dense"
                                                                name="ancho"
                                                                onBlur={this.onChanteText.bind(this)}
                                                                onChange={this.onChanteText.bind(this)}
                                                                type="text"
                                                                value={this.state.ancho}
                                                                variant="outlined"
                                                                style={{ margin: 10 }}
                                                                InputLabelProps={{ shrink: true }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </fieldset>
                                            </Box>

                                            {/***********************BOX BENEFICIARIO*********************/}
                                            <Box my={2} style={{}}>
                                                <fieldset style={{ borderRadius: 3, borderColor: 'rgba(0, 0, 0, 0.12)', padding: 3 }}>
                                                    <legend style={{ margin: 5 }}>Beneficiario:</legend>
                                                    <Grid
                                                        container
                                                        spacing={2}
                                                        wrap="wrap"
                                                    >
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                fullWidth
                                                                label="Nombre beneficiario"
                                                                margin="dense"
                                                                name="nombre_beneficiario"
                                                                onBlur={this.onChanteText.bind(this)}
                                                                onChange={this.onChanteText.bind(this)}
                                                                type="text"
                                                                value={this.state.nombre_beneficiario}
                                                                variant="outlined"
                                                                InputLabelProps={{ shrink: true }}
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                fullWidth
                                                                label="Direccion beneficiario"
                                                                margin="dense"
                                                                name="direccion_beneficiario"
                                                                onBlur={this.onChanteText.bind(this)}
                                                                onChange={this.onChanteText.bind(this)}
                                                                type="text"
                                                                value={this.state.direccion_beneficiario}
                                                                variant="outlined"
                                                                InputLabelProps={{ shrink: true }}
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                fullWidth
                                                                label="DUI beneficiario"
                                                                margin="dense"
                                                                name="dui_beneficiario"
                                                                onBlur={this.onChanteText.bind(this)}
                                                                onChange={this.onChanteText.bind(this)}
                                                                type="text"
                                                                value={this.state.dui_beneficiario}
                                                                variant="outlined"
                                                                InputLabelProps={{ shrink: true }}
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                fullWidth
                                                                label="NIT beneficiario"
                                                                margin="dense"
                                                                name="nit_beneficiario"
                                                                onBlur={this.onChanteText.bind(this)}
                                                                onChange={this.onChanteText.bind(this)}
                                                                type="text"
                                                                value={this.state.nit_beneficiario}
                                                                variant="outlined"
                                                                inputProps={{ maxLength: 15 }}
                                                                InputLabelProps={{ shrink: true }}
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                fullWidth
                                                                label="Telefono beneficiario"
                                                                margin="dense"
                                                                name="telefono_beneficiario"
                                                                onBlur={this.onChanteText.bind(this)}
                                                                onChange={this.onChanteText.bind(this)}
                                                                type="text"
                                                                value={this.state.telefono_beneficiario}
                                                                variant="outlined"
                                                                InputLabelProps={{ shrink: true }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </fieldset>
                                            </Box>


                                            <Grid
                                                container
                                                spacing={2}
                                                wrap="wrap"
                                            >
                                                <Grid
                                                    className={classes.item}
                                                    item
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <FormControlLabel
                                                        value={this.state.permiso2}
                                                        control={<Checkbox name="permiso2" color="primary" 
                                                        onChange={this.onChanteChk.bind(this)}
                                                        />}
                                                        label="¿Tiene permiso de comercialización?"
                                                        labelPlacement="start"
                                                        checked={Boolean(this.state.permiso2)}
                                                    />

                                                </Grid>

                                            </Grid>
                                            <Box my={2} id="box-permiso" style={(!this.state.permiso2)?{display:'none'}:{}}>
                                                <fieldset style={{ borderRadius: 3, borderColor: 'rgba(0, 0, 0, 0.12)', padding: 3 }}>
                                                    <legend style={{ margin: 5 }}>Permiso:</legend>
                                                    <Grid
                                                        container
                                                        spacing={2}
                                                        wrap="wrap"
                                                    >
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                fullWidth
                                                                label="EXP. CEP"
                                                                margin="dense"
                                                                name="cep"
                                                                onBlur={this.onChanteText.bind(this)}
                                                                onChange={this.onChanteText.bind(this)}
                                                                type="text"
                                                                value={this.state.cep}
                                                                variant="outlined"
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <Tooltip title="Este campo no se puede modificar, está ligado al distrito del usuario">
                                                                <FormControl style={{ width: "100%" }} variant="outlined" className={classes.formControl}>
                                                                    <InputLabel id="demo-simple-select-outlined-label">Delegación distrital</InputLabel>
                                                                    <Select
                                                                        labelId="demo-simple-select-outlined-label"
                                                                        id="demo-simple-select-outlined"
                                                                        value={this.state.id_distrito_from_user}
                                                                        onChange={this.onChanteText.bind(this)}
                                                                        label="Delegación distrital"
                                                                        fullWidth
                                                                        disabled
                                                                        margin="dense"
                                                                    >
                                                                        <MenuItem value="">
                                                                            <em>None</em>
                                                                        </MenuItem>
                                                                        <MenuItem value={1}>No especificado</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Tooltip>
                                                            
                                                        </Grid>
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                id="fecha_inicio"
                                                                label="Fecha Inicio"
                                                                type="date"
                                                                defaultValue={moment(new Date(this.state.fecha_inicio)).format("YYYY-MM-DD")}
                                                                className={classes.textField}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            className={classes.item}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <TextField
                                                                id="fecha_fin"
                                                                label="Fecha Fin"
                                                                type="date"
                                                                defaultValue={moment(this.state.fecha_fin).format("YYYY-MM-DD")}
                                                                className={classes.textField}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                            <span>{moment(this.state.fecha_fin).format("YYYY-MM-DD")}</span>
                                                        </Grid>
                                                    </Grid>
                                                </fieldset>
                                            </Box>
                                            </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                        </div>
                                        <>
                                        <ItemEncuesta items={this.state.items} respuestas={this.state.respuestas} />
                                        <Grid container spacing={3} style={{ margin: 10 }}>
                                            <Grid item xs={12} sm={6} md={6}>
                                                <Button variant="contained" color="primary" type="submit">Guardar</Button>
                                                <Button variant="contained" color="secondary" style={{ marginLeft: 5 }}
                                                    onClick={(e) => window.location = '/app/customers'}
                                                >Cancelar</Button>
                                                <FormDialog  onClick={this.openModalAudit.bind(this)} open={this.state.openModalAudit} clave={"pedido/"+this.state.infoEncuesta.id} id={this.state.infoEncuesta.id} />
                                            </Grid>
                                        </Grid>
                                        </>
                                        <CustomizedSnackbars setOpen={this.state.openAlert} severity={this.state.severity} msj={this.state.msj} />
                                    </form>
                                </>
                            }
                        </Card>
                    </Box>
                </Container>
            </Page>
        );
    }

};
class ItemEncuesta extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textResult:'',
        }
    }

    makeAnswers(e) {

        let id_detalle = String(e.target.id).substring(String(e.target.id).indexOf("_") + 1, String(e.target.id).length)
        let id_respuesta = e.target.value
        //console.log("value>" + id_respuesta)
        //console.log("id_detalle:" + id_detalle)

        let obj = {
            "id": id_detalle,
            "id_respuesta": parseInt(id_respuesta)
        }
        //console.log(obj)
        this.updateRespuesta(id_detalle, obj)
    }

    updateRespuesta(id, obj) {
        EncuestaService.update(id, obj)
            .then(response => {
                //console.log(response)
            }).catch(err => {
                //console.error(err)
            })
    }

    onChangeText(e){
        //console.log(e.target)
        this.setState({ [e.target.name]: e.target.value })

        let id_detalle = String(e.target.id).substring(String(e.target.id).indexOf("_") + 1, String(e.target.id).length)
        let id_respuesta = String(e.target.id).substring(0, String(e.target.id).indexOf("_"))
        let text_result = e.target.value
        //console.log("value>" + id_respuesta)
        //console.log("id_detalle:" + id_detalle)

        let obj = {
            "id": id_detalle,
            "id_respuesta": parseInt(id_respuesta),
            "text_result":text_result
        }
        //console.log(obj)
        this.updateRespuesta(id_detalle, obj)
    }

    //idPk is PK of table detalle_pedido
    fillDataRespuestas(idPregunta) {
        let htmlResponse = this.props.respuestas.map(
            (r, i) => {
                if (r.id_pregunta === idPregunta) {
                    //console.log("entro" + r.id)
                    return (
                        (r.tipo_respuesta===1)?
                        <FormControlLabel
                            value={r.id + ""}
                            control={<Radio color="primary" id={r.id_respuesta + "_" + r.id} onChange={this.makeAnswers.bind(this)} value={r.id_respuesta + ""} />}
                            label={r.respuesta}
                            labelPlacement="end"
                        //checked={(id_respuesta)}
                        />
                        :
                        <TextField
                            fullWidth
                            label={r.respuesta}
                            id={r.id_respuesta + "_" + r.id}
                            margin="dense"
                            name="textResult"
                            onBlur={this.onChangeText.bind(this)}
                            onChange={this.onChangeText.bind(this)}
                            type="text"
                            value={this.state.textResult}
                            variant="outlined"
                            inputProps={{ maxLength: 50 }}
                        />
                    )
                }
            }

        )


        return htmlResponse;
    }

    render() {
        return (<>
            {
                this.props.items.map((item, index) => (
                    <>
                        <TableContainer component={Paper}>
                            <Table style={{ minWidth: 650, marginTop: 5 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center"
                                            style={{ color: 'Highlight', backgroundColor: '#212121' }}
                                            colSpan={3}>{String(item[0])}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell width={'10%'}>Numero</TableCell>
                                        <TableCell width={'60%'} align="left">Pregunta</TableCell>
                                        <TableCell width={'30%'} align="left">Respuesta</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        item[1].map((d, i) => (
                                            <TableRow>
                                                <TableCell>{i + 1}</TableCell>
                                                <TableCell align="left">{d.nombre_pregunta}</TableCell>
                                                <TableCell align="left">
                                                    <FormControl component="fieldset">
                                                        <RadioGroup row aria-label="position" name={"resp_" + d.id_pregunta} defaultValue={d.id_respuesta_selected + ""}>
                                                            {this.fillDataRespuestas(d.id_pregunta, d.id_pk)}
                                                        </RadioGroup>
                                                    </FormControl>
                                                </TableCell>

                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                ))
            }
        </>
        );
    }
}
