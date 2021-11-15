import React, { Component } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
    Box,
    Container,
    makeStyles,
    Card,
    Button,
    TextField,
    CardHeader,
    Divider,
    Grid,
    Select,
    InputLabel, MenuItem,
    FormControlLabel,
    Checkbox, FormControl,
} from '@material-ui/core';
import Page from 'src/components/Page';
import clsx from 'clsx';
import solReact from 'src/js/solReact';import usuarioService from '../service/usuarioService';

const parameter = solReact.getQueryVariable("action");
export default class Usuario extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
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
        }
    }));

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
                                subheader="Detalles de usuario"
                                title={action !== 'update' ? "Crear Usuario" : "Editar Usuario"}
                            />
                            <Divider />
                            <Formik
                                initialValues={{
                                    nombre: '',
                                    nombre_puesto: '',
                                    direccion_puesto: '',
                                    id_encuesta: 1,
                                    referencia: '',
                                    censo: '',
                                    dui: '',
                                    nit: '',
                                    edad: '',
                                    telefono: '',
                                    asociacion: 1,
                                    actividad_comercial: 1,
                                    largo: 0,
                                    ancho: 0,
                                    nombre_beneficiario: '',
                                    direccion_beneficiario: '',
                                    dui_beneficiario: '',
                                    nit_beneficiario: '',
                                    telefono_beneficiario: '',
                                    permiso: false,
                                    cep: '',
                                    fecha_inicio: new Date(),
                                    fecha_fin: new Date(),
                                }}
                                validationSchema={Yup.object().shape({
                                    nombre: Yup.string().max(255).required('Nombre de Usuario es requerido'),
                                    nombre_puesto: Yup.string().max(255).required('Puesto es requerida'),
                                    direccion_puesto: Yup.string().max(255).required('Direccion Puesto es requerida')
                                })}
                                onSubmit={(values, isSubmitting) => {
                                    console.log(values)
                                    isSubmitting = true;
                                    usuarioService.save(values)
                                        .then(response => {
                                            console.log(response.data)
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
                                    handleSubmit, setFieldValue,
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
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <TextField
                                                    error={Boolean(touched.nombre && errors.nombre)}
                                                    fullWidth
                                                    helperText={touched.nombre && errors.nombre}
                                                    label="Nombre"
                                                    margin="dense"
                                                    name="nombre"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    type="text"
                                                    value={values.nombre}
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
                                                <TextField
                                                    fullWidth
                                                    label="DUI"
                                                    margin="dense"
                                                    name="dui"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    type="text"
                                                    value={values.dui}
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
                                                    label="NIT"
                                                    margin="dense"
                                                    name="nit"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    type="text"
                                                    value={values.nit}
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
                                                    control={<Checkbox name="permiso" color="primary" checked={values.permiso}
                                                        onChange={handleChange}
                                                    />}
                                                    label="Activo"
                                                    labelPlacement="start"
                                                />

                                            </Grid>

                                        </Grid>
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
                            </Formik>

                        </Card>
                    </Box>
                </Container>
            </Page>
        )
    }
}