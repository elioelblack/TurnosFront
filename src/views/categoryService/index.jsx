import React, { Component } from 'react';
import {
    Box,
    Container,
    makeStyles,
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import categoryService from './service/categoryService';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    }
}));

export default class Categories extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            dataFormated: [],
            user: null
        }
    }

    componentDidMount() {
        this.loadAll()
    }

    loadAll() {
        categoryService.findAll()
            .then(response => {
                console.log(response.data)
                this.setState({ data: response.data })
                this.makeDataFormated(response.data)
            }).catch(
                err => {
                    console.error(err)
                }
            )
    }

    makeDataFormated(obj) {
        let objTemp = []
        obj.map(
            (a) => { return (
                objTemp.push(
                    {
                        nombre: a.nombre,
                        descripcion: a.descripcion,
                        fechaCreacion: moment(a.fechaCreacion).format('DD/MM/YYYY HH:MM'),
                        id: a.idCategoriaTurnos,
                        ocupado: a.ocupado,
                        activo: Boolean(a.activo),
                        button:a.idCategoriaTurnos
                    }
                ) )
            }
        )
        this.setState({ dataFormated: objTemp })
    }

    render() {
        return (
            <Page
                className={useStyles.root}
                title="Categorías de servicios"
            >
                <Container maxWidth={false}>
                    <Toolbar/>
                    <Box mt={3}>
                        <Results data={this.state.dataFormated} />
                    </Box>
                </Container>
            </Page>
        );
    }
}

