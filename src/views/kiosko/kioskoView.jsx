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
import { Alert, AlertTitle, CardActionArea, Stack } from '@mui/material';
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
import { ComponentToPrint } from "./genericTicket";
import ReactToPrint from 'react-to-print';
import solReact from "src/js/solReact";
import html2canvas from "html2canvas";

const sucursal = solReact.getQueryVariable("sucursal")
class KioskoView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            arrayCategories: [],
            open: false,
            arrayServices: [],
            turnoSeleted: {},
            isError: false,
            msjError: '',
            sucursal: {}
        }
        // referencia al dispositivo USB
        this.usbDevice = null;
        this.usbEndpointOut = null;
    }

    componentDidMount() {
        console.log(sucursal)
        if (sucursal !== undefined && sucursal !== null) {
            this.getAllCategories(sucursal)
            this.getSucursalInfo(sucursal)
        } else {
            toast.error('Sucursal no seleccionada')
        }
    }

    getSucursalInfo(sucursal) {
        kioskoService.loadSucursalInfo(sucursal)
            .then(response => {
                this.setState({
                    sucursal: response.data
                })
            }).catch(err => {
                toast.error('Error al cargar información de sucursal')
            })
    }

    getLogo() {
        kioskoService.getLogoByte()
            .then(response => {
                const base64String = btoa(
                    new Uint8Array(response.data)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                this.setState({ logoByte: base64String });
                return base64String;
            }).catch(err => {
                console.error('Error al cargar logo de usuario', err);
            });
    }

    getAllCategories(sucursal) {
        kioskoService.findAllCategories(sucursal)
            .then(response => {
                this.setState({ arrayCategories: response.data })
            }).catch(err => {
                toast.error('error al cargar categorìas');
                this.setState({
                    isError: true,
                    msjError: String(JSON.stringify(err.response)),
                })
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
                        <Grid key={c.idCategoriaTurnos} item xs={6} md={4}>
                            <Card sx={{ minWidth: 50 }}
                                onClickCapture={(e) => this.onClickCategory(e, c.idCategoriaTurnos)}>
                                <CardActionArea>
                                    <CardContent style={{ textAlign: 'center' }}>
                                        {(c.iconoCategoria !== null && c.iconoCategoria !== '') && <Icon>{c.iconoCategoria}</Icon>}
                                        <Typography sx={{ fontSize: 14 }} color="textPrimary" gutterBottom>
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

    onClickCategory(e, id) {
        this.renderServices(id)
    }

    renderServices(id) {
        this.loadServicesByIdCategory(id)
    }

    handleClose() {
        this.setState({ open: false })
    }

    loadServicesByIdCategory(id) {
        kioskoService.findByIdCategories(id)
            .then(response => {
                if (response.data.length === 0) {
                    this.save(id, null)
                } else {
                    this.setState({ arrayServices: response.data })
                    this.setState({ open: true })
                }
            }).catch(err => {
                console.error(err)
            })
    }

    renderServicesById() {
        return (
            this.state.arrayServices.map(
                s => {
                    return (
                        <React.Fragment key={s.idServicioCategoria}>
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

    // ¿El navegador soporta WebUSB?
    supportsWebUSB = () => {
        return typeof navigator !== 'undefined' && !!navigator.usb;
    };

    // ¿Es Android?
    isAndroid = () => {
        const ua = navigator.userAgent || '';
        return /Android/i.test(ua);
    };

    // ¿Es Chrome (no Firefox) en Android?
    isAndroidChrome = () => {
        const ua = navigator.userAgent || '';
        return this.isAndroid() && /Chrome/i.test(ua) && !/Firefox/i.test(ua);
    };

    // Conectar a la impresora si aún no hay conexión
    connectUsbIfNeeded = async () => {
        if (!this.supportsWebUSB() || !this.isAndroidChrome()) {
            return false;
        }

        try {
            if (!this.usbDevice) {
                // 🔸 Idealmente aquí pones el vendorId real de tu impresora cuando lo sepas
                // De momento dejamos filtros vacíos para que Chrome muestre todos los USB
                const device = await navigator.usb.requestDevice({
                    filters: [ /* { vendorId: 0xXXXX } */]
                });

                await device.open();
                if (device.configuration === null) {
                    await device.selectConfiguration(1);
                }
                const iface = device.configuration.interfaces[0];
                await device.claimInterface(iface.interfaceNumber);

                // Buscar endpoint OUT (para enviar datos a la impresora)
                const alt = iface.alternates[0];
                const outEndpoint = alt.endpoints.find(ep => ep.direction === 'out');

                this.usbDevice = device;
                this.usbEndpointOut = outEndpoint.endpointNumber;
            }

            return true;
        } catch (err) {
            console.error('Error conectando WebUSB:', err);
            toast.error('No se pudo conectar con la impresora USB');
            return false;
        }
    };

    // 1) Capturar el ticket como canvas con html2canvas
    captureTicketCanvas = async () => {
        const element = document.getElementById("ticket-root");
        if (!element) {
            throw new Error("No se encontró el elemento ticket-root");
        }

        // 1) Capturar como está
        const rawCanvas = await html2canvas(element, {
            scale: 1,
            backgroundColor: "#ffffff",
            width: element.offsetWidth,
            height: element.offsetHeight
        });

        console.log("rawCanvas.width:", rawCanvas.width);   // aquí verás 199
        console.log("rawCanvas.height:", rawCanvas.height);

        // 2) Reescalar a 576 px de ancho para papel 80mm
        const targetWidth = 576;
        if (rawCanvas.width === targetWidth) {
            return rawCanvas; // ya está perfecto
        }

        const scale = targetWidth / rawCanvas.width;
        const targetHeight = Math.floor(rawCanvas.height * scale);

        const scaledCanvas = document.createElement("canvas");
        scaledCanvas.width = targetWidth;
        scaledCanvas.height = targetHeight;

        const ctx = scaledCanvas.getContext("2d");
        ctx.drawImage(rawCanvas, 0, 0, targetWidth, targetHeight);

        console.log("scaledCanvas.width:", scaledCanvas.width);   // 576
        console.log("scaledCanvas.height:", scaledCanvas.height);

        return scaledCanvas;
    };

    // 2) Canvas → bytes ESC/POS raster (GS v 0)
    canvasToEscPosRaster = (canvas) => {
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;
        //toast.info("Canvas width: " + width + "px, height: " + height + "px");
        const imageData = ctx.getImageData(0, 0, width, height).data;

        const bytesPerRow = Math.ceil(width / 8);
        const GS = 0x1d;

        const xL = bytesPerRow & 0xff;
        const xH = (bytesPerRow >> 8) & 0xff;
        const yL = height & 0xff;
        const yH = (height >> 8) & 0xff;

        // Cabecera ESC/POS: GS v 0 m xL xH yL yH
        const header = new Uint8Array([
            GS,
            "v".charCodeAt(0),
            "0".charCodeAt(0),
            0x00, // modo normal
            xL,
            xH,
            yL,
            yH,
        ]);

        const imageBytes = new Uint8Array(bytesPerRow * height);

        let offset = 0;

        for (let y = 0; y < height; y++) {
            for (let xByte = 0; xByte < bytesPerRow; xByte++) {
                let byte = 0;
                for (let bit = 0; bit < 8; bit++) {
                    const x = xByte * 8 + bit;
                    if (x >= width) continue;

                    const idx = (y * width + x) * 4;
                    const r = imageData[idx];
                    const g = imageData[idx + 1];
                    const b = imageData[idx + 2];

                    // Luminosidad (gris)
                    const gray = 0.3 * r + 0.59 * g + 0.11 * b;

                    // 1 = negro, 0 = blanco
                    const pixel = gray < 160 ? 1 : 0; // umbral ajustable

                    byte |= pixel << (7 - bit);
                }
                imageBytes[offset++] = byte;
            }
        }

        // Unir header + data en un solo Uint8Array
        const result = new Uint8Array(header.length + imageBytes.length);
        result.set(header, 0);
        result.set(imageBytes, header.length);

        return result;
    };

    // Dentro de tu clase KioskoView
    buildEscPosTicketBytes = () => {
        const { turnoSeleted, sucursal } = this.state;

        const nombreSucursal = sucursal?.nombre || 'Sucursal';
        const codigoTurno =
            turnoSeleted?.noConsecutivo ||
            turnoSeleted?.numeroTurno ||
            turnoSeleted?.idTurno ||
            '';
        const categoria =
            turnoSeleted?.idCategoriaTurnos?.nombre ||
            turnoSeleted?.categoria ||
            '';

        // Si tu API trae fecha de creación, úsala, si no, fecha local
        const fechaRaw = turnoSeleted?.fechaCreacion || turnoSeleted?.fecha || null;
        const fecha = fechaRaw ? new Date(fechaRaw).toLocaleString() : new Date().toLocaleString();

        const encoder = new TextEncoder();

        // Comandos ESC/POS básicos
        const ESC = '\x1B';
        const GS = '\x1D';

        // Vamos a ir armando el ticket en "segmentos" de bytes
        const segments = [];

        // 1) Inicializar impresora
        segments.push(encoder.encode(ESC + '@'));

        // 2) Centrado
        segments.push(encoder.encode(ESC + 'a' + '\x01')); // 0 = izq, 1 = centro, 2 = der

        // 3) LOGO (si existe) → aquí puedes meter bytes ESC/POS de imagen
        const logoBytes = this.buildLogoBytes(); // retorna Uint8Array (puede ser vacío)
        if (logoBytes && logoBytes.length > 0) {
            segments.push(logoBytes);
            segments.push(encoder.encode('\n'));
        } else {
            // Si no tienes logo gráfico aún, puedes dejar un “logo texto”
            segments.push(encoder.encode('QueueApp\n'));
            segments.push(encoder.encode('NextGen Systems - Nombre de tu empresa\n'));
        }

        // 4) Encabezado
        segments.push(encoder.encode('-------------------------\n'));
        segments.push(encoder.encode(nombreSucursal + '\n'));
        segments.push(encoder.encode('Kiosko de Turnos\n'));
        segments.push(encoder.encode('-------------------------\n'));

        // 5) Turno en GRANDE (doble alto y ancho)
        // ESC ! n  → modo de impresión. 0x30 = doble ancho+alto en muchas ESC/POS
        segments.push(encoder.encode(ESC + '!' + '\x30')); // modo grande
        segments.push(encoder.encode('TURNO\n'));
        segments.push(encoder.encode(`${codigoTurno}\n`));
        segments.push(encoder.encode(ESC + '!' + '\x00')); // volver a tamaño normal

        segments.push(encoder.encode('-------------------------\n'));

        // 6) Info adicional (servicio, fecha)
        if (categoria) {
            segments.push(encoder.encode(`Servicio: ${categoria}\n`));
        }
        segments.push(encoder.encode(`Fecha: ${fecha}\n`));
        segments.push(encoder.encode('\n'));

        // 7) Mensaje final
        segments.push(encoder.encode('Por favor, espere a ser llamado.\n'));
        segments.push(encoder.encode('Gracias por su visita.\n\n\n'));

        // 8) Corte de papel
        const cutCommand = encoder.encode(GS + 'V' + '\x00'); // corte total
        segments.push(cutCommand);

        // 9) Unir todos los segmentos en un solo Uint8Array
        let totalLength = 0;
        segments.forEach(seg => { totalLength += seg.length; });

        const result = new Uint8Array(totalLength);
        let offset = 0;
        segments.forEach(seg => {
            result.set(seg, offset);
            offset += seg.length;
        });

        return result;
    };

    // Stub para el logo. Debe devolver Uint8Array con comandos ESC/POS de imagen.
    buildLogoBytes = () => {
        // 🔹 OPCIÓN 1: Dejarlo vacío (sin logo gráfico)
        //return new Uint8Array(0);

        // 🔹 OPCIÓN 2 (a futuro):
        // Cuando tengas los bytes ESC/POS de tu logo (generados desde backend o una herramienta),
        // puedes pegarlos aquí, por ejemplo:
        //
        const raw = this.getLogo(); // comando GS v 0 para raster bit image
        return new Uint8Array(raw);
    };



    printWithWebUSB = async () => {
        try {
            const ok = await this.connectUsbIfNeeded();
            if (!ok) {
                // Si no se pudo conectar, caemos al flujo normal (ReactToPrint)
                const btn = document.getElementById("btnImprimir");
                if (btn) btn.click();
                return;
            }

            //const data = this.buildEscPosTicketBytes();
            //await this.usbDevice.transferOut(this.usbEndpointOut, data);

            // 1) Capturar el HTML del ticket como imagen
            const canvas = await this.captureTicketCanvas();

            // 2) Convertir imagen a ESC/POS raster
            const imgBytes = this.canvasToEscPosRaster(canvas);

            // 3) Enviar a la impresora
            const ESC = 0x1b;
            const GS = 0x1d;
            const encoder = new TextEncoder();

            const preFeed = encoder.encode("\n");    // 4 líneas arriba
            const postFeed = encoder.encode("\n\n\n\n");  // 5 líneas abajo
            const cut = new Uint8Array([GS, "V".charCodeAt(0), 0x00]);

            await this.usbDevice.transferOut(this.usbEndpointOut, preFeed);
            await this.usbDevice.transferOut(this.usbEndpointOut, imgBytes);
            await this.usbDevice.transferOut(this.usbEndpointOut, postFeed);
            await this.usbDevice.transferOut(this.usbEndpointOut, cut);

        } catch (err) {
            console.error('Error al imprimir WebUSB:', err);
            toast.error('No se pudo imprimir en la impresora térmica');
            // fallback a ReactToPrint
            const btn = document.getElementById("btnImprimir");
            if (btn) btn.click();
        }
    };




    save(idCateg, idServicio) {
        let data = {
            idCategoriaTurnos: { idCategoriaTurnos: idCateg },
            controlTurnoDetalleSet: [{}],
            idSucursal: this.state.sucursal
        };
        if (idServicio !== null) {
            data.idServiciosCategoria = { idServicioCategoria: idServicio }
        }

        kioskoService.save(data)
            .then(response => {
                toast.success('Bienvenido: Tome su ticket, por favor');
                this.setState(
                    { turnoSeleted: response.data, open: false },
                    async () => {
                        // 🔀 Lógica de impresión:
                        if (this.isAndroidChrome() && this.supportsWebUSB()) {
                            //toast.info('Imprimiendo ticket vía WebUSB...');
                            // Android + Chrome con WebUSB → impresión directa a USB
                            await this.printWithWebUSB();
                        } else {
                            const logoBytes = this.buildLogoBytes();
                            // Cualquier otro caso → flujo actual (ReactToPrint)
                            //toast.info('Imprimiendo ticket webtoprint normal...');
                            const btn = document.getElementById("btnImprimir");
                            if (btn) btn.click();
                        }
                    }
                );
            })
            .catch(err => {
                toast.error('Error al generar su turno');
            });
    }

    renderTicket() {
        return (ComponentToPrint)
    }

    setComponentRef = (ref) => {
        this.componentRef = ref;
    };

    reactToPrintContent = () => {
        return this.componentRef;
    };

    reactToPrintTrigger = () => {
        // Good
        return <button id="btnImprimir" style={{ display: 'none' }}>Print pure text using a Class Component</button>;
    };
    render() {
        const classes = this.useStyles;
        return (
            <Page
                className={classes.root}
                title="Kiosko QueueApp"
            >
                {this.state.isError &&
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert severity="error">
                            <AlertTitle>Error - Consulte al soporte técnio</AlertTitle>
                            <p>{this.state.msjError}</p>
                        </Alert>
                    </Stack>}
                <Typography style={{ textAlign: 'center', margin: 5 }} variant="h1" component="div" gutterBottom>
                    Bienvenido a "Tu empresa" - ({this.state.sucursal.nombre})
                </Typography>
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
                    <List style={{ marginTop: 10 }}>
                        {this.renderServicesById()}
                    </List>
                </Dialog>
                <ReactToPrint
                    content={this.reactToPrintContent}
                    documentTitle="QueueApp - Ticket"
                    removeAfterPrint
                    trigger={this.reactToPrintTrigger}
                />
                <div
                    style={{
                        opacity: 0,
                        pointerEvents: 'none',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: -1
                    }}
                >
                    <ComponentToPrint ref={this.setComponentRef} data={this.state.turnoSeleted} />
                </div>
            </Page>

        )
    }
}


export default KioskoView;