import React, { Component } from "react";
import {
    Box,
    Container,
    Typography,
    makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import kioskoService from "./service/kioskoService";
import { toast } from "react-toastify";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Icon from '@mui/material/Icon';
import { CardActionArea } from '@mui/material';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';


class KioskoView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            arrayCategories: [],
            open:false,
            arrayServices:[]
        }
    }

    componentDidMount() {
        this.getAllCategories()
    }

    getAllCategories() {
        kioskoService.findAllCategories()
            .then(response => {
                this.setState({ arrayCategories: response.data })
            }).catch(err => {
                toast.error('error al cargar categorìas')
            })
    }

    useStyles = makeStyles((theme) => ({
        root: {
            backgroundColor: theme.palette.background.dark,
            height: '100%',
            paddingBottom: theme.spacing(3),
            paddingTop: theme.spacing(3)
        }
    }));

    renderCategories() {
        return (
            this.state.arrayCategories.map(
                c => {
                    return (
                        <Grid item xs={6} md={4}>
                            <Card sx={{ minWidth: 50 }}
                                onClickCapture={(e) => this.onClickCategory(e, c.idCategoriaTurnos)}>
                                <CardActionArea>
                                    <CardContent style={{textAlign:'center'}}>
                                        {(c.iconoCategoria !== null && c.iconoCategoria !== '') && <Icon>{c.iconoCategoria}</Icon>}
                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            {c.nombre}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    )
                }
            )
        )
    }

    onClickCategory(e,id) {
        console.log(id)
        this.renderServices(id)
    }

    renderServices(id){
        this.loadServicesByIdCategory(id)
    }

    handleClose(){
        this.setState({open:false})
    }

    loadServicesByIdCategory(id){
        kioskoService.findByIdCategories(id)
        .then(response=>{
            this.setState({arrayServices:response.data})
            this.setState({open:true})
        })
    }

    renderServicesById() {
        return (
            this.state.arrayServices.map(
                s => {
                    return (
                        <React.Fragment>
                            <ListItem onClickCapture={(e) => this.save(s.idCategoriaTurno.idCategoriaTurnos, s.idServicioCategoria)}
                            key={s.idServicioCategoria} button>
                                <ListItemButton>
                                    {(s.iconoServicio !== null && s.iconoServicio !== '') &&
                                        <ListItemIcon>
                                            <Icon>{s.iconoServicio}</Icon>
                                        </ListItemIcon>}
                                    <ListItemText primary={s.nombreServicio} secondary={s.descripcion} />
                                </ListItemButton>
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    )
                }
            )
        )
    }

    save(idCateg,idServicio){
        let data = {
            idCategoriaTurnos : {idCategoriaTurnos:idCateg},
            idServiciosCategoria : {idServicioCategoria:idServicio}
        }

        kioskoService.save(data)
        .then(response=>{
            toast.success('Tome su ticket, gracias!')
        }).catch(err=>{
            toast.error('Error al generar su turno')
        })

    }

    render() {
        const classes = this.useStyles;
        return (
            <Page
                className={classes.root}
                title="Kiosko QueueApp"
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    height="100%"
                    justifyContent="center"
                    marginTop='15px'
                >
                    <Container maxWidth="md">
                    <Grid container spacing={2}>
                        {this.renderCategories()}
                    </Grid>
                    </Container>
                </Box>
                <Dialog
                    fullScreen
                    open={this.state.open}
                    onClose={this.handleClose.bind(this)}
                >
                <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                    edge="start"
                    color="inherit"
                    onClick={this.handleClose.bind(this)}
                    aria-label="close"
                    >
                    <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Seleccione el servicio a solicitar
                    </Typography>
                </Toolbar>
                </AppBar>
                <List style={{marginTop:10}}>
                    {this.renderServicesById()}
                </List>
                
                </Dialog>
            </Page>

        )
    }
}

export default KioskoView;