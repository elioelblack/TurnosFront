import * as React from "react";
import {
    Typography,
} from '@material-ui/core';
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
        const { text } = this.props;
        let {data} = this.props;
        return (
            <div className="relativeCSS" style={{width:290, textAlign:'center'}}>
                <style type="text/css" media="print">
                    {"\ @page { size: 80mm }\ "}
                </style>
                <img src={process.env.PUBLIC_URL + '/static/logo.png'} alt='logo' />

                <Typography sx={{ ml: 2, flex: 1 }} variant="h4" component="div">
                    Bienvenido a: "Tu empresa"
                </Typography>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h1" component="div">
                    {data.noConsecutivo}
                </Typography>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    {data.fechaCreacion}
                </Typography>
            </div>
        );
    }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
    return <ComponentToPrint ref={ref} text={props.text} />;
});
