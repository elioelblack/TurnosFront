import React from 'react';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    root: {
        backgroundColor: 'red',
        color: props => props.color,
    },
    formControl: {
        display: 'block',
        width: '100 %',
        padding: '.375rem .75rem',
        fontSize: '1rem',
        lineHeight: '1.5',
        color: '#495057',
        backgrounColor: '#fff',
        backgroundClip: 'padding - box',
        border: '1px solid #ced4da',
        borderRadius: '.25rem',
        transition: 'border - color .15s ease -in -out, box - shadow .15s ease -in -out'
    }
});

export default function InputGeneric(props) {
    const classes = useStyles(props);
    console.log(props)
    return <input type="text" className={classes.formControl} name={props.name} style={{ width:'50%'}}
    id={props.id} onChange={(e) => props.onChanteText(e)} value={props.value}/>;
}