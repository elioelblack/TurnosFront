import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import categoryService from './service/categoryService';
import { toast } from 'react-toastify';
import { FormControl, FormHelperText, IconButton, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import solReact from 'src/js/solReact';

const id = solReact.getQueryVariable("id");

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    iconButton: {
        marginTop: theme.spacing(1)
    }
}));
const CategoryStation = ({ data }) => {
    const [rows, setRows] = React.useState([]);
    const [sucursales, setSucursales] = React.useState([]);
    const [idSucursal, setIdSucursal] = React.useState('');
    const [catStation, setCatStation] = React.useState([]);
    const [idStation, setIdStation] = React.useState('');
    const classes = useStyles();

    React.useEffect(() => {
        loadAllSites()
        if (id !== null) {
            loadStationsbyCategory(id)
        }
    }, [])

    function loadStationsbyCategory(id) {
        categoryService.findcategoriasPorEstacionesByIdCategoria(id)
            .then(response => {
                setCatStation(response.data)
            })
    }

    function loadAllStationsBySite(idSite) {
        categoryService.findStationBySite(idSite)
            .then(response => {
                setRows(response.data)

            }).catch(err => {
                toast.error('Error al cargar estaciones')
            })
    }

    function loadAllSites() {
        categoryService.findAllSites()
            .then(response => {
                setSucursales(response.data)
                setIdSucursal(1)
                loadAllStationsBySite(1)
            }).catch(err => {
                toast.error('Error al cargar sucursales')
            })
    }

    function handleChange(e) {
        //alert(e.target.value)
        setIdStation(e.target.value)
    }

    function handleChangeSucursal(e, id) {
        let idPk = e.target.value
        setIdSucursal(idPk)
        if(idPk!==''){
            loadAllStationsBySite(idPk)
        }else{
            setRows([])
        }
    }

    function handdleAdd() {
        let idEstacionPk = rows.find(e => e.idEstacion === idStation)
        if (idEstacionPk !== null && idEstacionPk !== undefined) {
            let idCategoria = data

            let objData = {
                idEstacion: idEstacionPk,
                idCategoria: idCategoria
            }
            save(objData)
        } else {
            toast.warning('Seleccione una estación')
        }
    }

    const save = (data) => {
        categoryService.saveCategoriaEstacion(data)
            .then(response => {
                toast.success('Guardado correctamente')
                delete rows[rows.findIndex(e => e.idEstacion === idStation)]
                setRows(rows)
                setIdStation('')
                loadStationsbyCategory(id)
            }).catch(err => {
                toast.error('Error al guardar')
            })
    }

    const deleteCateg = (idPk) => {
        categoryService.delete(idPk)
            .then(response => {
                toast.success('Eliminado con éxito')
                loadStationsbyCategory(id)
            }).catch(err => {
                toast.error('Error al eliminar')
            })
    }

    return (
        <TableContainer component={Paper}>
            <FormControl className={classes.formControl}>
                <InputLabel id="sucursal">Sucursal</InputLabel>
                <Select
                    labelId="sucursal"
                    id="select-sucursal"
                    value={idSucursal}
                    onChange={(e) => handleChangeSucursal(e, idSucursal)}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {sucursales.map(
                        s => {
                            return (
                                <MenuItem key={s.idSucursal} value={s.idSucursal}>{s.nombre}</MenuItem>
                            )
                        }
                    )}
                </Select>
                <FormHelperText>Seleccione la sucursal</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl}>
                <InputLabel id="estacion">Estación</InputLabel>
                <Select
                    labelId="estacion"
                    id="select-estacion"
                    value={idStation}
                    onChange={(e) => handleChange(e)}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {rows.map(
                        s => {
                            return (
                                <MenuItem key={s.idEstacion} value={s.idEstacion}>{s.nombre}</MenuItem>
                            )
                        }
                    )}
                </Select>
                <FormHelperText>Seleccione la estación</FormHelperText>
            </FormControl>
            <IconButton
                className={classes.iconButton}
                color="secondary" aria-label="delete"
                onClick={handdleAdd}
                disabled={rows.length == 0 || idStation == ''}>
                <AddIcon />
            </IconButton>
            <Table size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell width={'10%'}>ID</TableCell>
                        <TableCell >Estación</TableCell>
                        <TableCell >Sucursal</TableCell>
                        <TableCell>Acción</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {catStation.map((row) => (
                        <TableRow
                            key={row.idCategoriaEstacion}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell>{row.idCategoriaEstacion}</TableCell>
                            <TableCell component="th" scope="row">
                                {row.idEstacion.nombre}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {row.idEstacion.idSucursal.nombre}
                            </TableCell>
                            <TableCell>
                                <IconButton aria-label="delete"
                                    onClick={() => deleteCateg(row.idCategoriaEstacion)}>
                                    <DeleteIcon style={{ color: '#e74c3c' }} />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CategoryStation; 