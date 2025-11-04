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
import AuthenticationService from "src/service/AuthenticationService";

//const SOCKET_URL = 'http://74.208.187.67:8080/Turnos/test-socket';
//const SOCKET_URL = 'https://turnosapi.fly.dev/test-socket';
//const SOCKET_URL = 'http://localhost:8080/test-socket';
const SOCKET_URL = `${AuthenticationService.getApiUrl()}/test-socket`;
export default class TvView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            message: [],
            open: false,
            msg: '',
            audioEnabled: false,      // <- nuevo
            voices: []                // <- cache de voces
        }
        this.audioCtx = null;
        this.supportsTTS = () =>
            'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

    }

    // Click del usuario para habilitar sonido
    enableSound = () => {
        try {
            // 1) AudioContext + tono silencioso muy corto
            const AC = window.AudioContext || window.webkitAudioContext;
            if (AC && !this.audioCtx) this.audioCtx = new AC();
            if (this.audioCtx) {
                if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                gain.gain.value = 0.0001;              // prácticamente silencio
                osc.connect(gain).connect(this.audioCtx.destination);
                osc.start();
                osc.stop(this.audioCtx.currentTime + 0.05);
            }

            // 2) Reproducir 100ms de silencio en <audio> para TVs/Android
            const silentMp3 =
                'data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCA' +
                'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'; // silencio corto
            const a = new Audio(silentMp3);
            a.play().catch(() => { /* ignore */ });

            // 3) “Precalentar” speechSynthesis (volumen 0)
            if (this.supportsTTS()) {
                const warm = new SpeechSynthesisUtterance('.');
                warm.volume = 0;
                window.speechSynthesis.speak(warm);
            }

            this.setState({ audioEnabled: true });
            localStorage.setItem('tv_audio_enabled', '1');
            // feedback visual
            toast.success('Sonido habilitado');
        } catch (e) {
            console.error(e);
            toast.error('No se pudo habilitar el sonido');
        }
    };

    componentDidMount() {
        if (this.supportsTTS()) {
            window.speechSynthesis.onvoiceschanged = () =>
                this.setState({ voices: window.speechSynthesis.getVoices() });
            this.setState({ voices: window.speechSynthesis.getVoices() });
        }
        this.loadturnToShow()
    }

    componentWillMount() {
        // si lo guardaste antes, lo respetas
        const saved = localStorage.getItem('tv_audio_enabled') === '1';
        if (saved) this.state.audioEnabled = true; // set inicial
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

        if (!this.state.audioEnabled) {
            toast.info('Haz clic en "Habilitar sonido" para escuchar los avisos');
        } else {
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
        mensaje.pitch = 0.5;
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
        const { audioEnabled } = this.state;
        return (
            <Context.Consumer>
                {({ stationAttended, destroyStationAttended }) => {
                    return (
                        <Page
                            className={classes.root}
                            title={"Lista de turnos"}
                        >
                            {/* Botón flotante para habilitar sonido, solo si no está activo */}
                            {!audioEnabled && (
                                <Box
                                    position="fixed"
                                    bottom={16}
                                    right={16}
                                    zIndex={2000}
                                    onClick={this.enableSound}
                                    sx={{
                                        cursor: 'pointer',
                                        background: '#3f51b5',
                                        color: '#fff',
                                        px: 2, py: 1, borderRadius: 1, boxShadow: 3
                                    }}
                                >
                                    Habilitar sonido
                                </Box>
                            )}
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
                                            <video controls autoPlay loop width="100%" muted>
                                                <source src={process.env.PUBLIC_URL + '/assets/video/mov_bbb.mp4'} type="video/mp4" />
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
                                        "target": SOCKET_URL,
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
                                        "target": SOCKET_URL,
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