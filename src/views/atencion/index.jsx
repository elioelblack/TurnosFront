import React,{Component} from "react";
import {
    Box,
    Container,
    Typography,
    makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import EstacionAtencion from "./estacionAtencion";

export default class atencionView extends Component{
    constructor(props){
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

    render(){
        const classes = this.useStyles;
        return(
            <Page
                className={classes.root}
                title="Atención de turnos"
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    height="100%"
                    justifyContent="center"
                    marginTop='15px'
                >
                    <EstacionAtencion />
                </Box>
            </Page>
        )
    }
}