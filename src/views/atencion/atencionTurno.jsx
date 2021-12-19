import React, { Component } from "react";
import {
    Button,
    Container,
    Typography,
    Grid,
    Box,
    ButtonGroup,
    BottomNavigation,
    BottomNavigationAction
} from '@material-ui/core';
import Toolbar from './Toolbar'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Check from '@material-ui/icons/Check';
import VolumeUp from '@material-ui/icons/VolumeUp';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationCity';
export default class AtencionTurno extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            estacion: this.props.estacion
        }
    }



    render() {
        const buttons = [
            <Button key="one" startIcon={<VolumeUp />}>Rellamar turno</Button>,
            <Button key="two" startIcon={<Check />}>Finalizar turno</Button>,
            <Button key="three" startIcon={<ArrowForwardIosIcon />}>Siguiente turno</Button>,
        ];
        return (
            <Container maxWidth="xl">
                <Toolbar title={JSON.parse(this.state.estacion).nombre} />
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                        <Typography variant="h2" gutterBottom style={{ margin: 5 }}>
                            Atendiendo:
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                '& > *': {
                                    m: 1,
                                },
                            }}
                        >
                            <ButtonGroup size="large" aria-label="large button group">
                                {buttons}
                            </ButtonGroup>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="h2" gutterBottom style={{ margin: 5 }}>
                            Estado del turno
                        </Typography>
                        <Box sx={{ width: 500 }}>
                            <BottomNavigation
                                showLabels
                                value={0}
                                onChange={(event, newValue) => {
                                    alert(newValue)
                                }}
                            >
                                <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
                                <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
                                <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
                            </BottomNavigation>
                        </Box>
                    </Grid>
                </Grid>

            </Container>
        )
    }
}
