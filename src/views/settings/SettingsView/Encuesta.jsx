import React, { Component } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    Divider,
    FormControlLabel,
    Grid,
    Typography,
    makeStyles,
    InputLabel,
    Select,
    FormControl,
    TextField

} from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EncuestaService from '../service/EncuestaServie';
import DateFnsUtils from '@date-io/date-fns';
import MaterialUIPickers from './MaterialUIPickers';
import CustomizedSnackbars from '../../../components/CustomizedSnackbars';
import { Error } from '@material-ui/icons';
import moment from 'moment';
import { toInteger } from 'lodash';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const useStyles = makeStyles(({
    root: {},
    item: {
        display: 'flex',
        flexDirection: 'column'
    }
}));
export default class Encuesta extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayEncuestas: [],
            idEncuesta:'',
            open:false,
            nombre_encuesta:'',
            descripcion:'',
            fecha_encuesta:new Date(),
            nombre:'',
            order:1,
            openCat:false,
            idCategoria:'',
            arrayCategoria:[],
            openPreg:false,
            idPregunta:'',
            arrayPreguntas:[],
            nombre_pregunta:'',
            order_pregunta:1,
            pregunta_activo:true,
            nombre_respuesta:'',
            order_respuesta:1,
            arrayRespuestas:[],
            idRespuesta:'',
            openResp:false,
            tipo_respuesta:1,
            respuesta_activo:true,
            action:'new'
        }
    }
    componentDidMount() {
        this.loadAllEncuestas();
    }

    loadAllEncuestas() {
        EncuestaService.findAll()
            .then(response => {
                console.log(response.data)
                this.setState({ arrayEncuestas: response.data })
            }).catch(err => {
                console.error(err)
            })
    }

    loadCategoriaByIdEncuesta(id){
        EncuestaService.findByIdEncuesta(id)
        .then(response=>{
            console.log(response.data)
            this.setState({arrayCategoria:response.data})
        }).catch(err=>{
            console.error(err)
            this.setState({arrayCategoria:[]})
        })
    }

    loadPreguntaByIdCategoria(id){
        EncuestaService.findByIdCategoria(id)
        .then(response=>{
            console.log(response.data)
            this.setState({arrayPreguntas:response.data})
        }).catch(err=>{
            console.error(err)
            this.setState({arrayPreguntas:[]})
        })
    }

    //Respuestas por id de pregunta
    loadRespuestasByIdPregunta(id){
        EncuestaService.findByIdPregunta(id)
        .then(response=>{
            console.log(response.data)
            this.setState({arrayRespuestas:response.data})
        }).catch(err=>{
            console.error(err)
            this.setState({arrayRespuestas:[]})
        })
    }

    ShowAlert(campo){
        let btnShow = document.getElementById("btn-show-alert");
        this.setState({
            openAlert:true,
            msj:campo+" no puede ser vacío!",
            severity:'warning'
        })
        btnShow.click()
    }
    
    handleChange(e){
        //alert(e.target.value)
        this.setState({idEncuesta:e.target.value})
        this.loadCategoriaByIdEncuesta(parseInt(e.target.value))
        this.setState({arrayPreguntas:[],arrayRespuestas:[]})
    }

    handleChangeCategoria(e){
        //alert(e.target.value)
        this.setState({idCategoria:e.target.value})
        this.loadPreguntaByIdCategoria(parseInt(e.target.value))
        this.setState({arrayRespuestas:[]})
    }

    handleChangePregunta(e){
        //alert(e.target.value)
        this.setState({idPregunta:e.target.value})
        this.loadRespuestasByIdPregunta(parseInt(e.target.value))
    }

    handleChangeRespuesta(e){
        this.setState({idRespuesta:e.target.value})
    }

    renderOptsSelect(){
        return this.state.arrayEncuestas.map(
            d=>(
                <option value={d.id}>{d.nombre_encuesta}</option>
            )
        )
    }

    renderOptsSelectCategoria(){
        return this.state.arrayCategoria.map(
            d=>(
                <option value={d.id_categoria}>{d.nombre}</option>
            )
        )
    }

    renderOptsSelectPregunta(){
        return this.state.arrayPreguntas.map(
            d=>(
                <option value={d.id_pregunta}>{d.nombre_pregunta}</option>
            )
        )
    }

    renderOptsSelectRespuesta(){
        return this.state.arrayRespuestas.map(
            d=>(
                <option value={d.id_respuesta}>{d.nombre_respuesta}</option>
            )
        )
    }

    handleClose(e){
        this.setState({
            open:false,
            openCat:false,
            openPreg:false,
            openResp:false
        })
    }

    onClickNueva(e){
        this.setState({
            action:'new',
            nombre_encuesta:'',
            descripcion:'',
            fecha_encuesta:new Date()
        })
        this.setState({open:true})
    }

    onClickEditar(e){
        //this.setState({open:true})
        let idEncuesta = document.getElementById("encuesta").value;
        console.log(idEncuesta)
        if(idEncuesta!==null && idEncuesta!==""){
            const resultado = this.state.arrayEncuestas.find( enc => enc.id == idEncuesta );

            console.log(resultado); // { nombre: 'cerezas', cantidad: 5 }
            if(resultado!==undefined){
                this.setState({
                    action:'update',
                    nombre_encuesta:resultado.nombre_encuesta,
                    descripcion:resultado.descripcion,
                    fecha_encuesta:new Date(resultado.fecha_encuesta)
                })
                this.setState({open:true})
            }
        }
    }

    onClickNuevaCategoria(e) {
        this.setState({
            action:'new',
            nombre:'',
            order:parseInt(this.state.arrayCategoria.length)+1
        })
        this.setState({openCat:true})
    }

    onClickEditarCategoria(e){
        let idCategoria = document.getElementById("categoria").value;
        console.log(idCategoria)
        if(idCategoria!==null && idCategoria!==""){
            const resultado = this.state.arrayCategoria.find( categ => categ.id_categoria == idCategoria );

            console.log(resultado); // { nombre: 'cerezas', cantidad: 5 }
            if(resultado!==undefined){
                this.setState({
                    action:'update',
                    nombre:resultado.nombre,
                    order:resultado.order,
                })
                this.setState({openCat:true})
            }
        }
    }

    onClickNuevaPregunta(e) {
        this.setState({
            action:'new',
            nombre_pregunta:'',
            order_pregunta:parseInt(this.state.arrayPreguntas.length)+1,
            pregunta_activo:true
        })
        this.setState({openPreg:true})
    }

    onClickEditarPregunta(e){
        let idPreg = document.getElementById("pregunta").value;
        console.log(idPreg)
        if(idPreg!==null && idPreg!==""){
            const resultado = this.state.arrayPreguntas.find( preg => preg.id_pregunta == idPreg );

            console.log(resultado); // { nombre: 'cerezas', cantidad: 5 }
            if(resultado!==undefined){
                this.setState({
                    action:'update',
                    nombre_pregunta:resultado.nombre_pregunta,
                    order_pregunta:resultado.order,
                    pregunta_activo:resultado.estado
                })
                this.setState({openPreg:true})
            }
        }
    }

    onClickNuevaRespuesta(e) {
        this.setState({
            action:'new',
            nombre_respuesta:'',
            order_respuesta:parseInt(this.state.arrayRespuestas.length)+1,
            respuesta_activo:true,
            tipo_respuesta:1
        })
        this.setState({ openResp: true })
    }

    onClickEditarRespuesta(e){
        let idResp = document.getElementById("respuesta").value;
        console.log(idResp)
        if(idResp!==null && idResp!==""){
            const resultado = this.state.arrayRespuestas.find( resp => resp.id_respuesta == idResp );

            console.log(resultado); // { nombre: 'cerezas', cantidad: 5 }
            if(resultado!==undefined){
                this.setState({
                    action:'update',
                    nombre_respuesta:resultado.nombre_respuesta,
                    order_respuesta:resultado.order,
                    respuesta_activo:resultado.estado,
                    tipo_respuesta:resultado.tipo_respuesta
                })
                this.setState({openResp:true})
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.nombre_encuesta === '') {
            this.ShowAlert('Nombre de encuesta')
        } else if (this.state.descripcion === '') {
            this.ShowAlert('Descripcion')
        }
        else {
            let obj = {
                nombre_encuesta: this.state.nombre_encuesta,
                descripcion: this.state.descripcion,
                fecha_encuesta: moment(new Date(this.state.fecha_encuesta)).format("YYYY-MM-DD HH:mm:ss")
            }
            if(this.state.action==='update'){
                console.log(this.state.idEncuesta)
                obj.id=this.state.idEncuesta
                this.updateEncuesta(this.state.idEncuesta,obj)
            }else{
                console.log(obj)
                this.save(obj)
            }
        }
    }

    handleSubmitCategoria(e) {
        e.preventDefault();
        if (this.state.idEncuesta !== '') {
            if (this.state.nombre === '') {
                this.ShowAlert('Nombre de categoria')
            } else if (this.state.order === '') {
                this.ShowAlert('Orden')
            }
            else {
                let obj = {
                    nombre: this.state.nombre,
                    order: this.state.order,
                    id_encuesta: this.state.idEncuesta,
                }
                if(this.state.action==='update'){
                    obj.id_categoria = this.state.idCategoria
                    this.saveCategoria(obj)
                }else{
                    this.saveCategoria(obj)
                }
            }
        } else {
            this.ShowAlert('Encuesta')
        }
    }

    handleSubmitPregunta(e) {
        e.preventDefault();
        if (this.state.idCategoria !== '') {
            if (this.state.nombre_pregunta === '') {
                this.ShowAlert('Nombre de pregunta')
            } else if (this.state.order_pregunta === '') {
                this.ShowAlert('Orden')
            }
            else {
                let obj = {
                    nombre_pregunta: this.state.nombre_pregunta,
                    order: this.state.order_pregunta,
                    id_categoria: { id_categoria: this.state.idCategoria },
                    estado:(this.state.pregunta_activo)?1:0
                }
                if(this.state.action==='update'){
                    obj.id_pregunta = this.state.idPregunta
                    this.savePregunta(obj)
                }else{
                    this.savePregunta(obj)
                }
            }
        } else {
            this.ShowAlert('Categoria')
        }
    }

    handleSubmitRespuesta(e) {
        e.preventDefault();
        if (this.state.idPregunta !== '') {
            if (this.state.nombre_respuesta === '') {
                this.ShowAlert('Nombre de Respuesta')
            } else if (this.state.order_respuesta === '') {
                this.ShowAlert('Orden de respuesta')
            }
            else {
                let obj = {
                    nombre_respuesta: this.state.nombre_respuesta,
                    order: this.state.order_respuesta,
                    id_pregunta: { id_pregunta: this.state.idPregunta },
                    tipo_respuesta:this.state.tipo_respuesta,
                    estado:(this.state.respuesta_activo)?1:0
                }
                if(this.state.action==='update'){
                    obj.id_respuesta = this.state.idRespuesta
                    this.saveRespuesta(obj)
                }else{
                    this.saveRespuesta(obj)
                }
            }
        } else {
            this.ShowAlert('Pregunta')
        }
    }

    saveRespuesta(data){
        let btnShow = document.getElementById("btn-show-alert");
        EncuestaService.saveRespuetas(data)
        .then(response=>{
            console.log(response.data)
            this.setState({
                openAlert: true,
                msj: "Guardado correctamente!",
                severity: 'success'
            })
            btnShow.click()
            this.loadRespuestasByIdPregunta(this.state.idPregunta)
            this.clearFieldsRespuestas()
        }).catch(err=> {
            console.error(Error)
        })
    }

    savePregunta(data){
        let btnShow = document.getElementById("btn-show-alert");
        EncuestaService.savePregunta(data)
        .then(response=>{
            console.log(response.data)
            this.setState({
                openAlert: true,
                msj: "Guardado correctamente!",
                severity: 'success'
            })
            btnShow.click()
            this.loadPreguntaByIdCategoria(this.state.idCategoria)
            this.clearFieldsPreguntas()
        }).catch(err=> {
            console.error(Error)
        })
    }

    saveCategoria(data){
        let btnShow = document.getElementById("btn-show-alert");
        EncuestaService.saveEncuesta(data)
        .then(response=>{
            console.log(response.data)
            this.setState({
                openAlert: true,
                msj: "Guardado correctamente!",
                severity: 'success'
            })
            btnShow.click()
            this.loadCategoriaByIdEncuesta(this.state.idEncuesta)
            this.clearFieldsEncuesta()
        }).catch(err=> {
            console.error(Error)
        })
    }

    save(data){
        let btnShow = document.getElementById("btn-show-alert");
        EncuestaService.save(data)
        .then(response=>{
            console.log(response.data)
            this.setState({
                openAlert: true,
                msj: "Guardado correctamente!",
                severity: 'success'
            })
            btnShow.click()
            this.loadAllEncuestas()
            this.clearFields()
        }).catch(err=> {
            console.error(Error)
        })
    }

    updateEncuesta(id,data){
        let btnShow = document.getElementById("btn-show-alert");
        EncuestaService.update(id,data)
        .then(response=>{
            console.log(response.data)
            this.setState({
                openAlert: true,
                msj: "Guardado correctamente!",
                severity: 'success'
            })
            btnShow.click()
            this.loadAllEncuestas()
            this.clearFields()
        }).catch(err=> {
            console.error(Error)
        })
    }

    clearFields(){
        this.setState({
            nombre_encuesta:'',
            descripcion:'',
            fecha_encuesta:new Date(),
            open:false
        })
    }

    clearFieldsEncuesta() {
        this.setState({
            nombre: '',
            order: '',
            openCat: false
        })
    }

    clearFieldsPreguntas() {
        this.setState({
            nombre_pregunta: '',
            order_pregunta: '',
            openPreg: false
        })
    }

    clearFieldsRespuestas() {
        this.setState({
            nombre_respuesta: '',
            order_respuesta: '',
            openResp: false
        })
    }

    handleDateChange(e){
        console.log(e)
        this.setState({fecha_encuesta:new Date(e)})
    }

    onChangeText(e){
        console.log(e.target)
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    render() {
        return (
            <Card>
                <CardHeader
                    subheader="Manejar Encuestas"
                    title="Encuesta"
                />
                <CardContent>
                    <Grid
                        container
                        spacing={6}
                        wrap="wrap"
                    >
                        <Grid
                            className={useStyles.item}
                            item
                            md={6}
                            sm={6}
                            xs={6}
                        >
                            <FormControl className={useStyles.formControl} style={{width:'100%'}}>
                                <InputLabel id="demo-controlled-open-select-label">Encuesta</InputLabel>
                                <Select
                                native
                                value={this.state.idEncuesta}
                                onChange={this.handleChange.bind(this)}
                                inputProps={{
                                    name: 'encuesta',
                                    id: 'encuesta',
                                }}
                                fullWidth
                                style={{width:'100%'}}
                                >
                                <option aria-label="None" value="" />
                                {this.renderOptsSelect()}
                                </Select>
                            </FormControl>

                        </Grid>
                        <Grid
                            className={useStyles.item}
                            item
                            md={6}
                            sm={6}
                            xs={6}
                        >
                            <IconButton variant="contained" color="secondary" style={{marginTop:10,marginLeft:10}}
                            onClick={this.onClickNueva.bind(this)}
                            ><AddCircleIcon/></IconButton>
                            <IconButton variant="contained" color="secondary" style={{marginTop:10,marginLeft:10}}
                            onClick={this.onClickEditar.bind(this)}><EditIcon/></IconButton>
                        </Grid>
                        <Grid
                            className={useStyles.item}
                            item
                            md={6}
                            sm={6}
                            xs={6}
                        >
                            <FormControl className={useStyles.formControl} style={{width:'100%'}}>
                                <InputLabel id="demo-controlled-open-select-label">Categoria de pregunta</InputLabel>
                                <Select
                                native
                                value={this.state.idCategoria}
                                onChange={this.handleChangeCategoria.bind(this)}
                                inputProps={{
                                    name: 'categoria',
                                    id: 'categoria',
                                }}
                                fullWidth
                                style={{width:'100%'}}
                                >
                                <option aria-label="None" value="" />
                                {this.renderOptsSelectCategoria()}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid
                            className={useStyles.item}
                            item
                            md={6}
                            sm={6}
                            xs={6}
                        >
                            <IconButton variant="contained" color="secondary" style={{marginTop:10,marginLeft:10}}
                            onClick={this.onClickNuevaCategoria.bind(this)}
                            ><AddCircleIcon/></IconButton>
                            <IconButton variant="contained" color="secondary" style={{marginTop:10,marginLeft:10}}
                            onClick={this.onClickEditarCategoria.bind(this)}><EditIcon/></IconButton>
                        </Grid>

                        <Grid
                            className={useStyles.item}
                            item
                            md={6}
                            sm={6}
                            xs={6}
                        >
                            <FormControl className={useStyles.formControl} style={{width:'100%'}}>
                                <InputLabel id="demo-controlled-open-select-label">Pregunta</InputLabel>
                                <Select
                                native
                                value={this.state.idPregunta}
                                onChange={this.handleChangePregunta.bind(this)}
                                inputProps={{
                                    name: 'pregunta',
                                    id: 'pregunta',
                                }}
                                fullWidth
                                style={{width:'100%'}}
                                >
                                <option aria-label="None" value="" />
                                {this.renderOptsSelectPregunta()}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid
                            className={useStyles.item}
                            item
                            md={6}
                            sm={6}
                            xs={6}
                        >
                            <IconButton variant="contained" color="secondary" style={{marginTop:10,marginLeft:10}}
                            onClick={this.onClickNuevaPregunta.bind(this)}
                            ><AddCircleIcon/></IconButton>
                            <IconButton variant="contained" color="secondary" style={{marginTop:10,marginLeft:10}}
                            onClick={this.onClickEditarPregunta.bind(this)}><EditIcon/></IconButton>
                        </Grid>

                        <Grid
                            className={useStyles.item}
                            item
                            md={6}
                            sm={6}
                            xs={6}
                        >
                            <FormControl className={useStyles.formControl} style={{width:'100%'}}>
                                <InputLabel id="demo-controlled-open-select-label">Respuesta</InputLabel>
                                <Select
                                native
                                value={this.state.idRespuesta}
                                onChange={this.handleChangeRespuesta.bind(this)}
                                inputProps={{
                                    name: 'respuesta',
                                    id: 'respuesta',
                                }}
                                fullWidth
                                style={{width:'100%'}}
                                >
                                <option aria-label="None" value="" />
                                {this.renderOptsSelectRespuesta()}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid
                            className={useStyles.item}
                            item
                            md={6}
                            sm={6}
                            xs={6}
                        >
                            <IconButton variant="contained" color="secondary" style={{marginTop:10,marginLeft:10}}
                            onClick={this.onClickNuevaRespuesta.bind(this)}
                            ><AddCircleIcon/></IconButton>
                            <IconButton variant="contained" color="secondary" style={{marginTop:10,marginLeft:10}}
                            onClick={this.onClickEditarRespuesta.bind(this)}><EditIcon/></IconButton>
                        </Grid>

                    </Grid>

                    {/*Modal Nueva encuesta*/}
                    <Dialog open={this.state.open} onClose={this.handleClose.bind(this)} aria-labelledby="form-dialog-title">
                    <form onSubmit={this.handleSubmit.bind(this)} noValidate autoComplete="off">
                        <DialogTitle id="form-dialog-title">Encuesta</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            Crear nueva encuesta es un proceso Administrativo y crítico del sistema, es su responsabilidad la correcta
                            definición y configuración de las mismas.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="nombre_encuesta"
                            name="nombre_encuesta"
                            label="Nombre"
                            type="text"
                            value={this.state.nombre_encuesta}
                            onChange={this.onChangeText.bind(this)}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="descripcion"
                            name="descripcion"
                            label="Descripcion"
                            type="text"
                            value={this.state.descripcion}
                            fullWidth
                            onChange={this.onChangeText.bind(this)}
                        />
                            <MaterialUIPickers date={this.state.fecha_encuesta} handleDateChange={this.handleDateChange} />       
                        </DialogContent>
                        <DialogActions>
                        <Button variant="contained"  color="primary"  type="submit"
                        >
                            Guardar
                        </Button>
                        <Button onClick={this.handleClose.bind(this)} color="primary">
                            Cancelar
                        </Button>
                        </DialogActions>
                        </form>
                    </Dialog>

                    {/*Modal Categoria encuesta*/}
                    <Dialog open={this.state.openCat} onClose={this.handleClose.bind(this)} aria-labelledby="form-dialog-title">
                    <form onSubmit={this.handleSubmitCategoria.bind(this)} noValidate autoComplete="off">
                        <DialogTitle id="form-dialog-title">Categoria de Encuestas</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            Administración de categorias de preguntas.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="nombre"
                            name="nombre"
                            label="Nombre"
                            type="text"
                            value={this.state.nombre}
                            onChange={this.onChangeText.bind(this)}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="order"
                            name="order"
                            label="Orden"
                            type="number"
                            value={this.state.order}
                            onChange={this.onChangeText.bind(this)}
                            fullWidth
                        />
                        </DialogContent>
                        <DialogActions>
                        <Button variant="contained"  color="primary"
                        type="submit"
                        >
                            Guardar
                        </Button>
                        <Button onClick={this.handleClose.bind(this)} color="primary">
                            Cancelar
                        </Button>
                        </DialogActions>
                        </form>
                    </Dialog>

                    {/*Modal Preguntas*/}
                    <Dialog open={this.state.openPreg} onClose={this.handleClose.bind(this)} aria-labelledby="form-dialog-title">
                    <form onSubmit={this.handleSubmitPregunta.bind(this)} noValidate autoComplete="off">
                        <DialogTitle id="form-dialog-title">Pregunta</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            Administración de Preguntas.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="nombre_pregunta"
                            name="nombre_pregunta"
                            label="Pregunta"
                            type="text"
                            value={this.state.nombre_pregunta}
                            onChange={this.onChangeText.bind(this)}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="order_pregunta"
                            name="order_pregunta"
                            label="Orden"
                            type="number"
                            value={this.state.order_pregunta}
                            onChange={this.onChangeText.bind(this)}
                            fullWidth
                        />
                        <FormControlLabel
                        value= {this.state.pregunta_activo}
                        control={<Checkbox id="pregunta_activo" color="primary"  />}
                        label="Activo"
                        onChange={(e)=>{
                            this.setState({pregunta_activo:!(this.state.pregunta_activo)})}}
                        labelPlacement="end"
                        checked={this.state.pregunta_activo}
                        />
                        </DialogContent>
                        <DialogActions>
                        <Button variant="contained"  color="primary"
                        type="submit"
                        >
                            Guardar
                        </Button>
                        <Button onClick={this.handleClose.bind(this)} color="primary">
                            Cancelar
                        </Button>
                        </DialogActions>
                        </form>
                    </Dialog>

                    {/*Modal Respuestas*/}
                    <Dialog open={this.state.openResp} onClose={this.handleClose.bind(this)} aria-labelledby="form-dialog-title">
                    <form onSubmit={this.handleSubmitRespuesta.bind(this)} noValidate autoComplete="off">
                        <DialogTitle id="form-dialog-title">Respuesta</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            Administración de Respuestas.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="nombre_respuesta"
                            name="nombre_respuesta"
                            label="Respuesta"
                            type="text"
                            value={this.state.nombre_respuesta}
                            onChange={this.onChangeText.bind(this)}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="order_respuesta"
                            name="order_respuesta"
                            label="Orden"
                            type="number"
                            value={this.state.order_respuesta}
                            onChange={this.onChangeText.bind(this)}
                            fullWidth
                        />
                                <FormControl className={useStyles.formControl} style={{ width: '100%',marginTop:10 }} error={(this.state.action==='update')}>
                                    <InputLabel id="demo-controlled-open-select-label">Tipo de respuesta</InputLabel>
                                    <Select
                                        native
                                        value={this.state.tipo_respuesta}
                                        onChange={this.onChangeText.bind(this)}
                                        inputProps={{
                                            name: 'tipo_respuesta',
                                            id: 'tipo_respuesta',
                                        }}
                                        fullWidth
                                        style={{ width: '100%' }}
                                        disabled={(this.state.action==='update')}
                                    >
                                        <option aria-label="Checkbox" value={1} label="Tipo Seleccion (Radio button)" />
                                        <option aria-label="Texto libre" value={2} label="Texto libre" />
                                    </Select>
                                    <FormHelperText>El tipo de respuesta no se puede modificar por seguridad e integridad de datos del sistema</FormHelperText>
                                </FormControl>
                                <FormControlLabel
                                value= {this.state.respuesta_activo}
                                control={<Checkbox id="respuesta_activo" color="primary"  />}
                                label="Activo"
                                onChange={(e)=>{
                                    this.setState({respuesta_activo:!(this.state.respuesta_activo)})}}
                                labelPlacement="end"
                                checked={this.state.respuesta_activo}
                                style={{marginTop:10}}
                                />
                        </DialogContent>
                        <DialogActions>
                        <Button variant="contained"  color="primary"
                        type="submit"
                        >
                            Guardar
                        </Button>
                        <Button onClick={this.handleClose.bind(this)} color="primary">
                            Cancelar
                        </Button>
                        </DialogActions>
                        </form>
                    </Dialog>
                </CardContent>
                <CustomizedSnackbars setOpen={this.state.openAlert} severity={this.state.severity} msj={this.state.msj} />
            </Card>
        )
    }
}