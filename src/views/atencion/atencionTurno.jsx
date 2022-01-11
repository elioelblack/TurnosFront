import React, { Component } from "react";
import {
    Button,
    Container,
    Typography,
    Grid,
    Box,
    ButtonGroup,
    BottomNavigation,
    BottomNavigationAction,
    Dialog,DialogTitle,DialogContent,DialogActions,
    Badge,
    LinearProgress
} from '@material-ui/core';
import Toolbar from './Toolbar'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Check from '@material-ui/icons/Check';
import VolumeUp from '@material-ui/icons/VolumeUp';
import atencionService from "./service/atencionService";
import { toast } from "react-toastify";
import SockJsClient from 'react-stomp';

const SOCKET_URL = 'http://localhost:8080/test-socket';
export default class AtencionTurno extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            estacion: this.props.estacion,
            turnSelected:null,
            arrayStates:[],
            SelectedState:1,
            open:false,
            turnDetailSelected:null,
            called:0,
            destroyStationContext:this.props.destroyStationAttended
        }
    }

    componentDidMount(){
        this.loadAllActiveStates()
        this.loadTurnInProgress()
        this.loadSelectStationFromApi()
    }

    loadTurnInProgress(){
        atencionService.findTurnInProgress()
        .then(response=>{
            this.setState({
                turnSelected:response.data,
                turnDetailSelected:response.data.controlTurnoDetalleSet[0],
                called:response.data.controlTurnoDetalleSet[0].noSolicitudes
            })
        }).catch(err=>{
            //console.log('Ningun')
        })
    }

    onClickNext(){
        if(this.state.turnSelected!==null){
            this.loadTurnInProgress()
            toast.warn('Finalice el turno en atención antes de llamar el próximo turno')
        }else{
            atencionService.findNextTurn()
            .then(response=>{
                this.setState({
                    turnSelected:response.data,
                    turnDetailSelected:response.data.controlTurnoDetalleSet[0],
                    called:response.data.controlTurnoDetalleSet[0].noSolicitudes
                })
                this.sendMessage({
                    consecutivo:response.data.noConsecutivo,
                    estacion:JSON.parse(this.state.estacion).nombre
                })
            }).catch(err=>{
                if(err.response.data.status && err.response.data.status===404){
                    toast.warning(err.response.data.message)
                }
            })
        }
    }

    loadAllActiveStates(){
        atencionService.findAllActiveStates()
        .then(response=>{
            this.setState({arrayStates:response.data})
        }).catch(err=>{
            toast.error('Error al cargar los estados del turno')
        })
    }

    renderStates(data){
        return this.state.arrayStates.map(e=>{
            return(
                <BottomNavigationAction key={e.idEstado} value={e.idEstado} label={e.nombre} component={Button}></BottomNavigationAction>
            )
        })
    }

    updateState(idState){
        this.setLoading(true)
        let copyTurn = this.state.turnSelected;
        copyTurn.idEstado={idEstado:idState}
        this.setState({turnSelected:copyTurn})
        this.updateTurn(copyTurn.idControlTurno,copyTurn)
    }

    updateTurn(id,data){
        atencionService.updateTurn(id,data)
        .then(response=>{
            toast.success('Estado del turno '+this.state.turnSelected.noConsecutivo+' actualizado correctamente')
            this.setLoading(false)
        }).catch(err=>{
            toast.error('Error')
            this.setLoading(false)
        })
    }

    onHandleFinalize(){
        this.setState({open:true})
    }

    handleCancel(e){
        this.setState({open:false})
    }

    handleOk(e){
        this.setLoading(true)
        this.completeTurn(this.state.turnSelected.idControlTurno);
    }

    completeTurn(id){
        atencionService.completeTurn(id)
        .then(response=>{
            this.setLoading(false)
            this.handleCancel()
            this.setState({turnSelected:null})
            this.clientRef.sendMessage('/app/hello', JSON.stringify(response.data));
            toast.success('Turno finalizado con éxito')
        }).catch(err=>{
            toast.error('Error')
            this.setLoading(false)
        })
    }

    setLoading(loading){
        this.setState({isLoading:loading})
    }

    increaseCalled(){
        this.setLoading(true)
        atencionService.increaseCalled(this.state.turnSelected.controlTurnoDetalleSet[0].idControlTurnoDetalle)
        .then(response=>{
            this.setState({
                turnDetailSelected:response.data,
                called:response.data.noSolicitudes,
            })
            this.sendMessage({
                consecutivo:this.state.turnSelected.noConsecutivo,
                estacion:JSON.parse(this.state.estacion).nombre
            })
            this.setLoading(false)
        }).catch(err=>{
            toast.error('Error al actualizar llamado')
            this.setLoading(false)
        })
    }

    vacateStation=()=> {
        if (this.state.turnSelected !== null) {
            toast.warn('Finalice el turno en atención antes de dejar de atender esta estación!')
        } else {
            atencionService.vacateStation()
                .then(response => {
                    toast.success('Acción realizada con éxito')
                    this.props.destroyStationAttended()
                    window.location = "atencion"
                }).catch(err => {
                    toast.error('Error ocurrido')
                })
        }
    }

    loadSelectStationFromApi(){
        atencionService.findOccupiedStation()
        .then(response=>{
            //console.log(response.data)
        }).catch(err=>{
            this.props.destroyStationAttended()
        })
    }

    sendMessage = (msg) => {
        console.log(msg)
        this.clientRefTurn.sendMessage('/app/turn', JSON.stringify(msg));
        this.clientRef.sendMessage('/app/hello', JSON.stringify(msg));
       
    }

    render() {
        const buttons = [
            (this.state.turnSelected!==null&&<Button key="one" startIcon={<Badge badgeContent={this.state.called} invisible={this.state.called===0} color="primary"><VolumeUp /></Badge>} onClick={(e)=>this.increaseCalled()}>Rellamar turno</Button>),
            (this.state.turnSelected!==null&&<Button key="two" startIcon={<Check />} onClick={(e)=>this.onHandleFinalize()}>Finalizar turno</Button>),
            <Button key="three" startIcon={<ArrowForwardIosIcon />} onClick={(e)=>this.onClickNext()}>Siguiente turno</Button>
        ];
        return (
            <Container maxWidth="xl">
                <Toolbar title={JSON.parse(this.state.estacion).nombre} vacateStation={this.vacateStation} />
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                        <Typography variant="h3" gutterBottom style={{ margin: 5 }}>
                            {(this.state.turnSelected!==null?'Atendiendo: '+this.state.turnSelected.noConsecutivo:'Sin turno en proceso')}
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
                    {(this.state.turnSelected!==null&&!this.state.isLoading&&
                    <Grid item xs={12} md={6}>
                        <Typography variant="h3" gutterBottom style={{ margin: 5 }}>
                            Estado del turno
                        </Typography>
                        <Box sx={{ width: 500 }}>
                            <BottomNavigation
                                showLabels
                                value={this.state.SelectedState}
                                onChange={(event, newValue) => {
                                    this.setState({SelectedState:newValue})
                                    this.updateState(newValue)
                                }}
                            >
                                {this.renderStates()}
                            </BottomNavigation>
                        </Box>
                    </Grid>
                    )}
                </Grid>
                <Dialog
                    sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 500 } }}
                    maxWidth="md"
                    open={this.state.open}
                >
                    <DialogTitle>¿Finalizar atención del turno {this.state.turnSelected!==null?this.state.turnSelected.noConsecutivo:''}?</DialogTitle>
                    <DialogContent dividers>
                        <Typography variant="body2" gutterBottom>
                            El turno será finalizado y no se puede revertir.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={this.handleCancel.bind(this)}>
                            Cancel
                        </Button>
                        <Button onClick={this.handleOk.bind(this)}>Ok</Button>
                    </DialogActions>
                </Dialog>
                {this.state.isLoading&&<LinearProgress />}
                <SockJsClient
                    url={SOCKET_URL}
                    topics={['/topic/greetings']}
                    onMessage={(msg) => { console.log(msg)}}
                    ref={ (client) => { this.clientRef = client }}
                    //headers={requestOptions}
                    proxy= {{
                            "/ws/**": {
                            "target": "http://localhost:8080/test-socket",
                            "changeOrigin": true
                            }
                        }}
                        debug={ false }
                />
                <SockJsClient
                    url={SOCKET_URL}
                    topics={['/topic/greetings']}
                    onMessage={(msg) => { console.log(msg)}}
                    ref={ (client) => { this.clientRefTurn = client }}
                    //headers={requestOptions}
                    proxy= {{
                            "/ws/**": {
                            "target": "http://localhost:8080/test-socket",
                            "changeOrigin": true
                            }
                        }}
                        debug={ false }
                />
            </Container>
        )
    }
}
