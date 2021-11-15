import React, { Component } from 'react';
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
import usuarioService,{findByDui,findByNit} from '../service/usuarioService';
import solReact from 'src/js/solReact';
import FormDialog from '../../audit';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const action = solReact.getQueryVariable("action")
class ProfileDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id_usuario:'',
      nombre: '',
      apellido: '',
      segundo_nombre:'',
      segundo_apellido:'',
      username: '',
      password: '',
      id_rol: 2,
      activo: true,
      states: [{value: 1,label: 'Administrador'},
        {value: 2,label: 'Atención'},
      ],
      sexos: [{value: 'M',label: 'M'},
        {value: 'F',label: 'F'},
      ],
      sexo:'',
      email:'',
      dui:'',
      nit:'',
      celular:'',
      telefono:'',
      estados: [
        {
          value: true,
          label: 'Activo'
        },
        {
          value: false,
          label: 'Inactivo'
        },
      ],
      e_nombre:false,
      e_nombre_str:'',
      e_apellido:false,
      e_apellido_str:'',
      e_username:false,
      e_password:false,
      e_mail:false,
      e_estado:false,
      e_sexo:false,
      e_dui:false,
      sucursales: [
        {value: 1,label: 'Central'},
        {value: 2,label: 'Santa Tecla'}
      ],
      id_sucursal:1,
      fecha_nacimiento:new Date(),
      locale:'es',
      msj:'',
      openAlert:false,
      severity:'info',
      redirect:false
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
      let resp = response.data
      this.setState({
        nombre:resp.primerNombre,
        segundo_nombre:resp.segundoNombre,
        apellido:resp.primerApellido,
        segundo_apellido:resp.segundoApellido,
        username:resp.username,
        password:resp.password,
        id_rol:resp.idRol.idRol,
        activo:resp.activo,
        id_sucursal:resp.idSucursal.idSucursal,
        sexo:resp.sexo,
        email:resp.email,
        dui:resp.dui,
        nit:resp.nit,
        celular:resp.celular,
        telefono:resp.telefono,
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

  async onChangeDui(e){
    //console.log(e.target.value)
    let value = String(e.target.value)
    if(value.endsWith('_')||value.endsWith('-')){
      this.setState({e_dui:true,e_dui_msj:'DUI incompleto'})
    }else{
      this.setState({e_dui:false})
      if(value!==''&& await this.validateDui(value)){
        toast.warn("Ya existe un usuario con este número de DUI")
        this.setState({e_dui:true,e_dui_msj:"Usuario duplicado"})
      }else{
        this.setState({e_dui:false})
      }
    }
    this.setState({dui:value})
  }

  async onChangeNit(e){
    let value = String(e.target.value)
    if(value.endsWith('_')||value.endsWith('-')){
      this.setState({e_nit:true,e_nit_msj:'NIT incompleto'})
    }else{
      if(value!==''&& await this.validateNit(value)){
        toast.warn("Ya existe un usuario con este número de NIT")
        this.setState({e_nit:true,e_nit_msj:"Usuario duplicado"})
      }else{
        this.setState({e_nit:false})
      }
    }
    this.setState({nit:value})
  }

  async validateDui(value){
    const userDui = await findByDui(value)
    //console.log(userDui.error)
    if(userDui.status!==undefined){
      //console.log(userDui.data.idUsuario+'>'+this.state.id_usuario)
      if(parseInt(this.state.id_usuario)!==parseInt(userDui.data.idUsuario)){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
  }

  async validateNit(value){
    const userNit = await findByNit(value)
    //console.log(userNit.error)
    if(userNit.status!==undefined){
      //console.log(userNit.data.idUsuario+'>'+this.state.id_usuario)
      if(parseInt(this.state.id_usuario)!==parseInt(userNit.data.idUsuario)){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
  }

  handleChangeMail(e) {
    let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!regEmail.test(e.target.value)){
      this.setState({e_mail:true})
    }else{
      this.setState({
        [e.target.name]: e.target.value,
        e_mail:false
      });
    }
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

  async handleSubmit(e) {
    e.preventDefault();
    if (this.state.nombre === '') {
      toast.warn('Nombre Usuario')
      this.setState({e_nombre:true})
    } else if (this.state.apellido === '') {
      toast.warn('Apellido')
      this.setState({e_apellido:true})
    } else if (this.state.username === '') {
      toast.warn('Username')
      this.setState({e_username:true})
    } else if (this.state.password === '') {
      toast.warn('Contraseña')
      this.setState({e_password:true})
    } else if (this.state.activo === '') {
      toast.warn('Estado')
      this.setState({e_estado:true})
    }else if (this.state.sexo === '') {
      toast.warn('Sexo')
      this.setState({e_sexo:true})
    } else if(this.state.dui!==null&&(this.state.dui.endsWith('-')||this.state.dui.endsWith('_'))){
      toast.warn('Número DUI incompleto')
    } else if(this.state.nit!==null&&(this.state.nit.endsWith('-')||this.state.nit.endsWith('_'))){
      toast.warn('Número NIT incompleto')
    }else if(await this.validateDui(this.state.dui)){
      toast.warn('Ya existe un usuario con el DUI '+this.state.dui)
    }else if(await this.validateNit(this.state.nit)){
      toast.warn('Ya existe un usuario con el NIT '+this.state.nit)
    }else{
      let obj = {
        primerNombre: this.state.nombre,
        segundoNombre:this.state.segundo_nombre,
        primerApellido: this.state.apellido,
        username: this.state.username,
        password: this.state.password,
        idRol: {idRol:this.state.id_rol},
        idSucursal:{idSucursal:parseInt(this.state.id_sucursal)},
        activo:this.state.activo,
        sexo:this.state.sexo,
        email:this.state.email,
        dui:String(this.state.dui)===''?null:this.state.dui,
        nit:this.state.nit===''?null:this.state.nit,
        celular:this.state.celular,
        telefono:this.state.telefono,
        fechaNacimiento:this.state.fecha_nacimiento
      }
      if(action==='update'){
        const idP = solReact.getQueryVariable("id")
        obj.idUsuario = idP
      }
      this.save(obj)
    }
  }

  save(data){
    usuarioService.save(data)
    .then(response=>{
      //console.log(response)
      toast.success("Creado correctamente!")
      this.setState({redirect:true})
      window.location="/app/users";
    }).catch(err=>{
      toast.error(String(err).substring(0,400))
    })
  }

  openModalAudit() {
    //alert("hola mundo");
    this.setState({ openModalAudit: true })
  }

  render() {

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
                md={3}
                xs={12}
              >
                <TextField
                  fullWidth
                  helperText={this.state.e_nombre?"Ingresa el nombre del usuaro, por favor":""}
                  label="Primer nombre"
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
                  label="Segundo nombre"
                  name="segundo_nombre"
                  onChange={this.handleChange.bind(this)}
                  value={this.state.segundo_nombre}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={3}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Primer apellido"
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
                md={3}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Segundo apellido"
                  name="segundo_apellido"
                  onChange={this.handleChange.bind(this)}
                  value={this.state.segundo_apellido}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={3}
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
                md={3}
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
                md={3}
                xs={12}
              >
                <LocalizationProvider  dateAdapter={DateAdapter} locale={'es'} style={{width:'100%'}}>
                  <DatePicker
                    label="Fecha de nacimiento"
                    fullWidth
                    disableFuture
                    value={this.state.fecha_nacimiento}
                    onChange={(newValue) => {
                      this.setState({fecha_nacimiento:newValue});
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid
                item
                md={3}
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
                  helperText={this.state.e_username?"Estado del usuario no puede ser vacío":""}
                  error={this.state.e_estado}
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
                md={3}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Sexo"
                  name="sexo"
                  onChange={this.handleChange.bind(this)}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={this.state.sexo}
                  variant="outlined"
                  helperText={this.state.e_sexo?"Seleccione el sexo del usuario, por favor":""}
                  error={this.state.e_sexo}
                >
                  <option value={null} label='' />
                  {this.state.sexos.map((option) => (
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
                md={3}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  onChange={this.handleChangeMail.bind(this)}
                  type="email"
                  value={this.state.email}
                  variant="outlined"
                  error={this.state.e_mail}
                />
              </Grid>
              <Grid
                item
                md={3}
                xs={12}
              >
                <InputMask mask="99999999-9" value={this.state.dui} onChange={this.onChangeDui.bind(this)} onBlur={this.onChangeDui.bind(this)} >
                  {(inputProps) => <TextField {...inputProps}
                    fullWidth
                    label="DUI"
                    name="dui"
                    value={this.state.dui}
                    type="text"
                    variant="outlined"
                    helperText={this.state.e_dui?this.state.e_dui_msj:""}
                    error={this.state.e_dui}
                  />}
                </InputMask>
              </Grid>
              <Grid
                item
                md={3}
                xs={12}
              >
                <InputMask mask="9999-999999-999-9" value={this.state.nit} onChange={this.onChangeNit.bind(this)} onBlur={this.onChangeNit.bind(this)}>
                  {(inputProps) => <TextField
                    fullWidth
                    label="NIT"
                    name="nit"
                    type="text"
                    value={this.state.nit}
                    variant="outlined"
                    helperText={this.state.e_nit?this.state.e_nit_msj:""}
                    error={this.state.e_nit}
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
                  label="Celular"
                  name="celular"
                  onChange={this.handleChange.bind(this)}
                  type="text"
                  value={this.state.celular}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={3}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Telefono"
                  name="telefono"
                  onChange={this.handleChange.bind(this)}
                  type="text"
                  value={this.state.telefono}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={3}
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
            justifyContent="left"
            p={2}
          >
            {(action!=='view')&&<Button
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
      </form>
    );
  }

}

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;
