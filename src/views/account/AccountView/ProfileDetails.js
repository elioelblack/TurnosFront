import React, { Component } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles
} from '@material-ui/core';
import CustomizedSnackbars from '../../../components/CustomizedSnackbars';
import usuarioService from '../service/usuarioService';
import solReact from 'src/js/solReact';
import FormDialog from '../../audit';

const action = solReact.getQueryVariable("action")
class ProfileDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id_usuario:'',
      nombre: '',
      apellido: '',
      username: '',
      password: '',
      id_rol: 2,
      activo: true,
      states: [
        {
          value: 1,
          label: 'Administrador'
        },
        {
          value: 2,
          label: 'Tecnico'
        },
      ],
      estados: [
        {
          value: 1,
          label: 'Activo'
        },
        {
          value: 2,
          label: 'Inactivo'
        },
      ],
      e_nombre:false,
      e_nombre_str:'',
      e_apellido:false,
      e_apellido_str:'',
      e_username:false,
      e_password:false,
      distrito: [
        {
          value: 1,
          label: 'No especificado'
        }
      ],
      id_distrito:1
    }
  }

  componentDidMount(){
    
    if(action==='view' || action==='update'){
      const idParam = solReact.getQueryVariable("id")
      this.loadUserById(idParam)
      this.setState({id_usuario:idParam})
    }

  }

  loadUserById(id){
    usuarioService.findById(id)
    .then(response=> {
      console.log()
      let resp = response.data
      this.setState({
        nombre:resp.nombre,
        apellido:resp.apellido,
        username:resp.username,
        password:resp.password,
        id_rol:resp.id_rol.id_rol,
        activo:resp.activo,
        id_distrito:resp.id_distrito,
      })
    }).catch(err=>{
      console.error(err)
    })
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  };


  useStyles = makeStyles(() => ({
    root: {}
  }));

  useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: 'black',
      minHeight: '20px',
      paddingBottom: theme.spacing(3),
      paddingTop: theme.spacing(3),
      paddingLeft: 10
    }
  }));

  handleSubmit(e) {
    console.log(e.target.novalidate)
    e.preventDefault();
    if (this.state.nombre === '') {
      this.ShowAlert('Nombre Usuario')
      this.setState({e_nombre:true})
    } else if (this.state.apellido === '') {
      this.ShowAlert('Apellido')
      this.setState({e_apellido:true})
    } else if (this.state.username === '') {
      this.ShowAlert('Username')
      this.setState({e_username:true})
    } else if (this.state.password === '') {
      this.ShowAlert('Contraseña')
      this.setState({e_password:true})
    } else{
      console.log({...this.state})
      let obj = {
        nombre: this.state.nombre,
        apellido: this.state.apellido,
        username: this.state.username,
        password: this.state.password,
        id_rol: {id_rol:this.state.id_rol},
        id_distrito:this.state.id_distrito,
        activo:this.state.activo
      }
      if(action==='update'){
        const idP = solReact.getQueryVariable("id")
        obj.id_user = idP
      }
      this.save(obj)
    }
  }

  save(data){
    usuarioService.save(data)
    .then(response=>{
      console.log(response)
      this.ShowSuccess("Creado correctamente!")
      window.location = "/app/users"
    }).catch(err=>{
      console.error(err)
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

  ShowSuccess(msj) {
    let btnShow = document.getElementById("btn-show-alert");
    this.setState({
        openAlert: true,
        msj: msj,
        severity: 'succsess'
    })
    btnShow.click()
  }

  openModalAudit() {
    //alert("hola mundo");
    this.setState({ openModalAudit: true })
  }

  render() {
    const classes = this.useStyles;
    return (
      <form
        autoComplete="off"
        noValidate    
        onSubmit={this.handleSubmit.bind(this)}    
      >
        <Card>
          <CardHeader
            subheader="Detalles del usuario"
            title="Usuario"
          />
          <Divider />
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  helperText={this.state.e_nombre?"Ingresa el nombre del usuaro, por favor":""}
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
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Apellido"
                  name="apellido"
                  onChange={this.handleChange.bind(this)}
                  required
                  value={this.state.apellido}
                  variant="outlined"
                  helperText={this.state.e_apellido?"Ingresa el Apellido del usuaro, por favor":""}
                  error={this.state.e_apellido}
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  onChange={this.handleChange.bind(this)}
                  required
                  value={this.state.username}
                  variant="outlined"
                  helperText={this.state.e_username?"Ingresa el Username del usuaro, por favor":""}
                  error={this.state.e_username}
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Contraseña"
                  name="password"
                  onChange={this.handleChange.bind(this)}
                  type="password"
                  value={this.state.password}
                  variant="outlined"
                  helperText={this.state.e_password?"Ingresa la Contraseña del usuaro, por favor":""}
                  error={this.state.e_password}
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Estado"
                  name="activo"
                  onChange={this.handleChange.bind(this)}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={this.state.activo}
                  variant="outlined"
                >
                  {this.state.estados.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Rol"
                  name="id_rol"
                  onChange={this.handleChange.bind(this)}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={this.state.id_rol}
                  variant="outlined"
                >
                  {this.state.states.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Distrito"
                  name="id_distrito"
                  onChange={this.handleChange.bind(this)}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={this.state.id_distrito}
                  variant="outlined"
                >
                  {this.state.distrito.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <Box
            display="flex"
            justifyContent="flex-end"
            p={2}
          >
            {(action!='view')&&<Button
              color="primary"
              variant="contained"
              type="submit"
            >
              Guardar
            </Button>}
            <Button
              color="primary"
              variant="contained"
              style={{marginLeft:5}}
              onClick={(e)=>{window.location="/app/users"}}
            >
              Regresar
            </Button>
            <FormDialog  onClick={this.openModalAudit.bind(this)} open={this.state.openModalAudit} clave={"usuario/"+this.state.id_usuario} id={this.state.id_usuario} />
          </Box>
        </Card>
        <CustomizedSnackbars setOpen={this.state.openAlert} severity={this.state.severity} msj={this.state.msj} />
      </form>
    );
  }

}

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;
