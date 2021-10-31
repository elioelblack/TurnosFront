import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  makeStyles,
  Card,
  CardHeader,
  Divider,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Page from 'src/components/Page';
import clsx from 'clsx';
import moment from 'moment';
import serviceReport from '../service/serviceReport';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import ExplicitIcon from '@material-ui/icons/Explicit';
import CustomizedSnackbars from 'src/components/CustomizedSnackbars';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1)
  },
  productCard: {
    height: '100%'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  grid: {
    marginTop: 15
  }
}));



const ReportAllEncuesta = (data) => {
  const classes = useStyles();
  const [fecha] = useState(new Date())
  const [idEncuesta, setIdEncuesta] = useState('')
  const [openAlert,setOpenAlert] = useState(false);
  const [msj,setMsj] = useState('');
  const [severity,setSeverity] = useState('warning')
  console.log("Recibiendo: " + data.encuestas)

  const handleSubmit = (e) => {
    //alert(e.target.name)
    e.preventDefault()
    let fechaInicio = moment(document.getElementById("fecha-inicio").value).format("YYYY-MM-DD HH:mm:ss");
    let fechaFinal = moment(document.getElementById("fecha-final").value).format("YYYY-MM-DD HH:mm:ss");

    if(idEncuesta===undefined || idEncuesta===''){
      ShowAlert("Debe Seleccionar una Encuesta primero")
    }else{
      let obj = {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFinal,
        imagen: "logo.png",
        idEncuesta:idEncuesta
      }
      console.log(fechaInicio)
      getReport("encuesta", obj)
    }
  }

  const handleSubmitExcel = (e) => {
    //alert(e.target.name)
    e.preventDefault()
    let fechaInicio = moment(document.getElementById("fecha-inicio").value).format("YYYY-MM-DD HH:mm:ss");
    let fechaFinal = moment(document.getElementById("fecha-final").value).format("YYYY-MM-DD HH:mm:ss");

    if(idEncuesta===undefined || idEncuesta===''){
      ShowAlert("Debe Seleccionar una Encuesta primero")
    }else{
      let obj = {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFinal,
        imagen: "logo.png"
      }
      console.log(fechaInicio)
      getReportExcel("encuesta", obj)
    }
  }

  const getReportExcel = (nombre, obj) => {
    serviceReport.loadReportExcel(nombre, obj)
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'encuesta.xlsx'); //or any other extension
        document.body.appendChild(link);
        link.click();
      }).catch(err => {
        console.error(err)
      })
  }

  const getReport = (nombre, obj) => {
    serviceReport.loadReport(nombre, obj)
      .then(response => {
        console.log(response.data)
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'encuesta.pdf'); //or any other extension
        document.body.appendChild(link);
        link.click();
      }).catch(err => {
        console.error(err)
      })
  }

  const handleChange = (e) => {
    setIdEncuesta(e.target.value)
  }

  const ShowAlert = (msj) => {
    let btnShow = document.getElementById("btn-show-alert");
    setOpenAlert(true)
    setMsj(msj)
    btnShow.click()
  }


  return (
    <Page
      className={classes.root}
      title="Reportes index"
    >
      <Container maxWidth={false}>

        <Box mt={1}>
          <Card className={clsx(classes.root)} style={{ padding: 10, backgroundColor: '#BBDEFB', border: '1px solid #0D47A1' }}  >
            <CardHeader
              title="Reporte Todas las Encuestas"
              subheader="Reporte de encuesta entre fechas"
            />
            <form className={classes.container} noValidate autoComplete="off" >
              <Divider style={{ marginBottom: 5 }} />
              <Grid
                container
                spacing={1}
              >
                <Grid
                  className={useStyles.grid}
                  item
                  md={12}
                  sm={12}
                  xs={12}
                >
                  <FormControl className={useStyles.formControl} style={{ marginLeft: 8, marginBottom: 8 }}>
                    <InputLabel id="demo-controlled-open-select-label">Encuesta</InputLabel>
                    <Select
                      native
                      value={idEncuesta}
                      onChange={handleChange}
                      inputProps={{
                        name: 'encuesta',
                        id: 'encuesta',
                      }}
                      fullWidth
                      style={{ width: '250px' }}
                    >
                      <option aria-label="None" value="" />
                      {data.encuestas != undefined && data.encuestas.map((d) => {
                        return (
                          <option aria-label="None" value={d.id} label={d.nombre_encuesta} />
                        )
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid
                  className={useStyles.grid}
                  item
                  lg={6}
                  md={4}
                  sm={6}
                  xs={12}
                >
                  <TextField
                    id="fecha-inicio"
                    label="Fecha Inicio"
                    type="datetime-local"
                    defaultValue={moment(fecha).format("YYYY-MM-DDTHH:mm")}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />

                  <TextField
                    id="fecha-final"
                    label="Fecha Final"
                    type="datetime-local"
                    defaultValue={moment(fecha).format("YYYY-MM-DDTHH:mm")}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    style={{ marginLeft: 10 }}
                    fullWidth
                  />


                </Grid>
                <Grid
                  className={useStyles.grid}
                  item
                  lg={6}
                  md={4}
                  sm={6}
                  xs={12}
                >
                  <Button variant="contained" type="submit" color="secondary" name="btn_export_pdf"
                    style={{ marginTop: 20, marginLeft: 10 }} startIcon={<PictureAsPdfIcon />}
                    onClick={handleSubmit}>Generar PDF</Button>
                  <Button
                    onClick={handleSubmitExcel}
                    variant="contained" type="submit" color="secondary" style={{ marginTop: 20, marginLeft: 10 }} 
                    startIcon={<ExplicitIcon />} >Generar Excel</Button>
                </Grid>

              </Grid>

            </form>
          </Card>
        </Box>
      </Container>
      <CustomizedSnackbars setOpen={openAlert} severity={severity} msj={msj} />
    </Page>
  );
};

export default ReportAllEncuesta;
