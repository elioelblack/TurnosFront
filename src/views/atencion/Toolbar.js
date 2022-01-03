import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  makeStyles,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  title: {
    flexGrow: 1,
  },
}));

const Toolbar = ({ className,title ,vacateStation,...rest }) => {
  const classes = useStyles();

  const onNewEncuesta = ()=>{
    vacateStation()
  }

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
        justifyContent="flex-left"
      >
        <Typography className={classes.title} pt={10} variant="h1" gutterBottom component="div">
            {title}
        </Typography>
        <Button
          color="primary"
          variant="contained"
          onClick={onNewEncuesta}
          style={{marginTop:10}}
        >
          Dejar de atender Estación
        </Button>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
