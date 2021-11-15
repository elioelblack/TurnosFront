import React, { Component } from 'react';
import {
    Box,
    Container,
    makeStyles,
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';

import stationService from './service/stationService';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    }
}));

export default class StationView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            dataFormated: [],
            user: null
        }
    }

    componentDidMount() {
        this.loadAllStations()
        
    }

    loadAllStations() {
        stationService.findAll()
            .then(response => {
                //console.log(response.data)
                this.setState({ dataEncuesta: response.data })
                //this.makeDataEncuesta(response.data)
            }).catch(
                err => {
                    console.error(err)
                }
            )
    }

    makeDataEncuesta(objEncuesta) {
        let objTemp = []
        objEncuesta.map(
            a => {
                objTemp.push(
                    {
                        nombre: a.nombre,
                        username: a.username,
                        fechaNacimiento: moment(a.fechaNacimiento).format('DD/MM/YYYY'),
                        id: a.idUsuario,
                        rol: a.idRol.nombre,
                        button: a.idUsuario
                    }
                )
            }
        )
        this.setState({ dataEncuestaFormated: objTemp })
        //console.log(objTemp)
    }

    render() {
        return (
            <Page
                className={useStyles.root}
                title="Lista de Estaciones de atención"
            >
                <Container maxWidth={false}>
                    
                    <Box mt={3}>
                        <Results encuestas={this.state.data} />
                    </Box>
                </Container>
            </Page>
        );
    }
}

