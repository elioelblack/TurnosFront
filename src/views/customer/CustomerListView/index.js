import React, { useState, useEffect, Component} from 'react';
import {
  Box,
  Container,
  makeStyles,
  Button
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import data from './data';
import EncuestaService,{findAllr} from '../service/encuestaService';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

export default class CustomerListView extends Component{

  constructor(props){
    super(props)
    this.state={
      data:data,
      dataEncuesta:[],
      dataEncuestaFormated:[]
    }
  }

  componentDidMount(){
    this.loadAllEncuestas()
  }  

  loadAllEncuestas(){
    EncuestaService.findAll()
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
      a=>{
        objTemp.push(
          {
            direccion_puesto: a.direccion_puesto,
            elaborado_por: a.elaborado_por,
            fecha_pedido: moment(a.fecha_pedido).format('DD/MM/YYYY HH:MM'),
            id: a.id,
            id_encuesta: a.id_encuesta,
            nombre_puesto: a.nombre_puesto,
            nombre_usuario: a.nombre_usuario,
            button:a.id
          }
        )
      }
    )
      this.setState({dataEncuestaFormated:objTemp})
    //console.log(objTemp)
  }

  render(){
    return (
      <Page
        className={useStyles.root}
        title="Lista de encuestas realizadas"
      >
        <Container maxWidth={false}>   
          <Toolbar  />     
          <Box mt={3}>
            <Results customers={data} encuestas={this.state.dataEncuestaFormated} />
          </Box>
        </Container>
      </Page>
    );
  }
}

