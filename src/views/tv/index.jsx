import React, { Component } from "react";
import {
    Box,
    Container,
    Dialog,
    DialogContent,
    Grid,
    makeStyles,
    Typography
} from '@material-ui/core';
import Page from 'src/components/Page';
import Context from "src/Context";
import Results from "./Results";
import SockJsClient from 'react-stomp';
import tvService from "./service/tvService";
import { toast } from "react-toastify";

const SOCKET_URL = 'http://localhost:8080/test-socket';
export default class TvView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            message: [],
            open: false,
            msg: ''
        }
    }

    componentDidMount() {
        if (!'speechSynthesis' in window) return alert("Lo siento, tu navegador no soporta esta tecnología");
        this.loadturnToShow()
    }

    loadturnToShow() {
        tvService.findTurnToShow()
            .then(response => {
                this.setState({ message: response.data })
            }).catch(err => {
                console.log(err)
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

    sendMessage = (msg) => {
        this.clientRef.sendMessage('/app/hello', JSON.stringify(msg));
    }

    onMessageReceived = (msg) => {
        console.log(msg);
        this.setState({ message: msg })
    }

    onMessageReceivedTurn = (msg) => {
        console.log(msg);
        let msgToListen = 'Turno ' + msg.consecutivo + ' en ' + msg.estacion
        console.log(msgToListen)


        let miPrimeraPromise = new Promise((resolve, reject) => {
            // Llamamos a resolve(...) cuando lo que estabamos haciendo finaliza con éxito, y reject(...) cuando falla.
            // En este ejemplo, usamos setTimeout(...) para simular código asíncrono.
            // En la vida real, probablemente uses algo como XHR o una API HTML5.
            this.speakMsg(msgToListen)
            this.onHandleOpenModal(msgToListen)
            setTimeout(function () {
                resolve("¡Éxito!"); // ¡Todo salió bien!
            }, 3000);
        });

        miPrimeraPromise.then((successMessage) => {
            // succesMessage es lo que sea que pasamos en la función resolve(...) de arriba.
            // No tiene por qué ser un string, pero si solo es un mensaje de éxito, probablemente lo sea.
            console.log("¡Sí! " + successMessage);
            this.setState({ open: false })
        });
    }

    onConnected = () => {
        console.log("Connected!!")
    }

    // El click del botón. Aquí sucede la magia
    speakMsg = (msg) => {
        toast.info(msg, {
            position: "top-center",
            autoClose: 3000
        })
        let posibleIndice = 0
        // Seleccionar estos idiomas por defecto, en caso de que existan
        const IDIOMAS_PREFERIDOS = ["es-MX", "es-US", "es-ES", "es_US", "es_ES"];
        let vocesDisponibles = speechSynthesis.getVoices();
        posibleIndice = vocesDisponibles.findIndex(voz => IDIOMAS_PREFERIDOS.includes(voz.lang));
        console.log({ vocesDisponibles })
        let textoAEscuchar = msg;
        let mensaje = new SpeechSynthesisUtterance();
        //mensaje.voice = vocesDisponibles[$voces.value];
        mensaje.voice = vocesDisponibles[posibleIndice];
        mensaje.volume = 1;
        mensaje.rate = 1;
        mensaje.text = textoAEscuchar;
        mensaje.pitch = 0.7;
        // ¡Parla!
        speechSynthesis.speak(mensaje);

    };

    onHandleOpenModal(msg) {
        this.setState({
            open: true,
            msg: msg
        })

    }

    render() {
        const classes = this.useStyles;
        return (
            <Context.Consumer>
                {({ stationAttended, destroyStationAttended }) => {
                    return (
                        <Page
                            className={classes.root}
                            title={"Lista de turnos"}
                        >
                            <Box
                                display="flex"
                                flexDirection="column"
                                height="100%"
                                justifyContent="center"
                                marginTop='15px'
                            >
                                <Container maxWidth={false} >
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={6}>
                                            <Results data={this.state.message} />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <video controls autoPlay loop width="100%">
                                                <source src={process.env.PUBLIC_URL + 'assets/video/mov_bbb.mp4'} type="video/mp4" />
                                                <p>Su navegador no soporta video HTML5. Aquí hay un <a href="rabbit320.mp4">enlace al video</a>.</p>
                                            </video>
                                        </Grid>
                                    </Grid>
                                </Container>
                            </Box>
                            <Dialog
                                sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 500 } }}
                                maxWidth="md"
                                open={this.state.open}
                            >
                                <DialogContent>
                                    <Typography variant="h1" component="div" gutterBottom>
                                        {this.state.msg}
                                    </Typography>
                                </DialogContent>
                            </Dialog>
                            <SockJsClient
                                url={SOCKET_URL}
                                topics={['/topic/greetings']}
                                onMessage={(msg) => { this.onMessageReceived(msg) }}
                                ref={(client) => { this.clientRef = client }}
                                //headers={requestOptions}
                                proxy={{
                                    "/ws/**": {
                                        "target": "http://localhost:8080/test-socket",
                                        "changeOrigin": true
                                    }
                                }}
                                debug={false}
                            />
                            <SockJsClient
                                url={SOCKET_URL}
                                topics={['/topic/turn']}
                                onMessage={(msg) => { this.onMessageReceivedTurn(msg) }}
                                ref={(client) => { this.clientRef = client }}
                                //headers={requestOptions}
                                proxy={{
                                    "/ws/**": {
                                        "target": "http://localhost:8080/test-socket",
                                        "changeOrigin": true
                                    }
                                }}
                                debug={false}
                            />
                        </Page>
                    )
                }}
            </Context.Consumer>
        )
    }
}