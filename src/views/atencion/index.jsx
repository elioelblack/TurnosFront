import React, { Component } from "react";
import {
    Box,
    makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import EstacionAtencion from "./estacionAtencion";
import Context from 'src/Context';
import AtencionTurno from "./atencionTurno";
export default class atencionView extends Component {
    constructor(props) {
        super(props)
    }

    useStyles = makeStyles((theme) => ({
        root: {
            backgroundColor: theme.palette.background.dark,
            height: '100%',
            paddingBottom: theme.spacing(3),
            paddingTop: theme.spacing(3)
        }
    }));

    render() {
        const classes = this.useStyles;
        return (
            <Context.Consumer>
                {({ stationAttended }) => {
                    return (
                        <Page
                            className={classes.root}
                            title={"Atención de turnos"}
                        >
                            <Box
                                display="flex"
                                flexDirection="column"
                                height="100%"
                                justifyContent="center"
                                marginTop='15px'
                            >
                                {(stationAttended===null||stationAttended===undefined)&&
                                <EstacionAtencion />}
                                {(stationAttended!==null&&stationAttended!==undefined)&&
                                <AtencionTurno estacion={stationAttended}/>}
                            </Box>
                        </Page>
                    )
                }}
            </Context.Consumer>
        )
    }
}