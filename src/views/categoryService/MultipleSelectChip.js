import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function MultipleSelectChip({data,handleChangeMulti,value}) {
    const theme = useTheme();
    const [personName, setPersonName] = React.useState(typeof value === 'string' ? value.split(',') : value);
    console.log(Array.from(value))
    const [dataEstaciones, setDataEstaciones] = React.useState(data);
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        console.log(value)
        setPersonName(
            // On autofill we get a the stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        //console.log(personName)
        //setValueToSave(personName)
        handleChangeMulti(value)
    };

    const setValueToSave=(data)=>{
        console.log("Guardando..."+data)
        
        data.map((e)=>{
            console.log("2..."+e.search(data))
            return e.search(data)
        })
    }

    React.useEffect(()=>{
        setDataEstaciones(data)
    })

    return (
            <FormControl sx={{ width: '100%' }} >
                <InputLabel id="estaciones">Estaciones</InputLabel>
                <Select
                    labelId="estaciones"
                    id="estaciones"
                    multiple
                    fullWidth
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Estaciones" />}
                    renderValue={(selected) => {
                        console.log('renderValue:'+selected)
                        return <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    }}
                    MenuProps={MenuProps}
                >
                    {data.map((a) => (
                        <MenuItem
                            key={a.idEstacion}
                            value={a.nombre}
                            style={getStyles(a.nombre, a.nombre, theme)}
                        >
                            {a.nombre}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
    );
}