import React, { Component} from 'react';
import {
  Box,
  Container,
  makeStyles,
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import UsuarioService from '../service/usuarioService';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

export default class Account extends Component{

  constructor(props){
    super(props)
    this.state={
      dataEncuesta:[],
      dataEncuestaFormated:[],
      user:null
    }
  }

  componentDidMount(){
    this.loadAllEncuestas()
    this.userDetail()
  }

  userDetail (){
    UsuarioService.whoami()
      .then(response=>{
        //console.log("response :"+response.data)
        this.setState( {user:response.data})
      }).catch(
        err=>{
          console.error(err)
        }
      )
  }

  loadAllEncuestas(){
    UsuarioService.findAll()
    .then(response=>{
      //console.log(response.data)
      this.setState({dataEncuesta:response.data})
      this.makeDataEncuesta(response.data)
    }).catch(
      err=>{
        console.error(err)
      }
    )
  }

  makeDataEncuesta(objEncuesta){
    let objTemp = []
    objEncuesta.map(
      a=>{ return(
        objTemp.push(
          {
            nombre: a.primerNombre+' '+a.primerApellido,
            username:a.username,
            fechaNacimiento: moment(a.fechaNacimiento).format('DD/MM/YYYY'),
            id: a.idUsuario,
            rol: a.idRol.nombre,
            button:a.idUsuario
          }
        ))
      }
    )
      this.setState({dataEncuestaFormated:objTemp})
    //console.log(objTemp)
  }

  render(){
    return (
      <Page
        className={useStyles.root}
        title="Lista de Usuarios"
      >
        <Container maxWidth={false}>
          <Toolbar  />
          <Box mt={3}>
            <Results  encuestas={this.state.dataEncuestaFormated} user={this.state.user} />
          </Box>
        </Container>
      </Page>
    );
  }
}

