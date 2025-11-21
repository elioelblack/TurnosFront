import * as React from "react";
import {
    Typography,
} from '@material-ui/core';
import { Divider } from "@mui/material";

export class ComponentToPrint extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { checked: false };
    }
    canvasEl;
    componentDidMount() {

    }
    setRef = (ref) => (this.canvasEl = ref);

    render() {
        let { data } = this.props;
        return (
            <div id="ticket-root" className="relativeCSS" style={{
                width: 576,            // 👈 ancho real 80 mm
                paddingTop: 5,        // 👈 margen superior
                paddingBottom: 15,     // 👈 margen inferior
                textAlign: 'center'
            }}>
                <style type="text/css" media="print">
                    {" @page { size: 80mm } "}
                </style>
                <img src={process.env.PUBLIC_URL + '/static/logo.png'} alt='logo' style={{ maxWidth: 350, marginBottom: 10 }} />
                <Typography sx={{ ml: 2, flex: 1 }} variant="body3" component="div" style={{ fontSize: '1rem', marginBottom: 1 }}>
                    NextGen Systems
                </Typography>
                <Typography sx={{ ml: 2, flex: 1 }} variant="body3" component="div" style={{ fontSize: '1rem', marginBottom: 1 }}>
                    QueueApp – Sistema de Turnos
                </Typography>
                <Typography sx={{ ml: 2, flex: 1 }} variant="body3" component="div" style={{ fontSize: '1rem', marginBottom: 1 }}>
                    Sucursal: {data?.idSucursal?.nombre || 'Default'}
                </Typography>
                <Typography sx={{ ml: 2, flex: 1 }} variant="body1" component="div" style={{ fontSize: '2rem', marginBottom: 4 }}>
                    Bienvenido a: "Tu empresa"
                </Typography>
                <Divider>-------------------Turno-------------------</Divider>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h1" component="div" style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: 4 }}>
                    {data.noConsecutivo}
                </Typography>
                <Typography sx={{ ml: 2, flex: 1 }} variant="body2" component="div" style={{ fontSize: '1.5rem' }}>
                    {data.fechaCreacion}
                </Typography>

                <Typography sx={{ flex: 1 }} variant="body3" component="div" style={{ fontSize: '1rem', marginTop: 10 }}>
                    Por favor espere a ser llamado en pantalla.
                </Typography>
                <Divider></Divider>
                <Typography sx={{ flex: 1 }} variant="body3" component="div" style={{ fontSize: '0.8rem', marginTop: 10 }}>
                    Sistema de turnos por QueueApp
                </Typography>
                <Typography sx={{ flex: 1 }} variant="body3" component="div" style={{ fontSize: '0.8rem', marginTop: 10 }}>
                    www.nextgensystems.org
                </Typography>
            </div>
        );
    }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
    return <ComponentToPrint ref={ref} text={props.text} />;
});
