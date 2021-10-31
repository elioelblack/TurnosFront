import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => createStyles({
  '@global': {
    '*': {
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
    },
    html: {
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
      height: '100%',
      width: '100%'
    },
    body: {
      backgroundColor: '#f4f6f8',
      height: '100%',
      width: '100%'
    },
    a: {
      textDecoration: 'none'
    },
    '#root': {
      height: '100%',
      width: '100%'
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
    
    
    
  }
}));

const GlobalStyles = () => {
  useStyles();

  return null;
};

export default GlobalStyles;
