import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Card,
  makeStyles,
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, data, ...rest }) => {
  const classes = useStyles();
  const columns = [
    
    { field: 'consecutivo', headerName: 'Turno', minWidth: 300,flex: 3 },
    { field: 'estacion', headerName: 'Ventanilla', minWidth: 300,flex: 3 },
    ];

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <div style={{ minHeight: 500, height:500,  width: '100%' }}>
        <DataGrid rows={data} columns={columns} pagination={false} hideFooterPagination />
      </div>
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired
};

export default Results;
