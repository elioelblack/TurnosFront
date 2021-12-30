import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Card,
  makeStyles,
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, data, ...rest }) => {
  const classes = useStyles();
  const columns = [
    { field: 'id', headerName: 'Id', minWidth: 100},
    { field: 'nombre', headerName: 'Nombre de categoría', minWidth: 300,flex: 1 },
    { field: 'activo', headerName: 'Estado', minWidth: 200,disableClickEventBubbling: true,
      renderCell:(params)=>(
        params.value?<span style={{color:'blue'}}>Activo</span>:<span style={{color:'red'}}>Inactivo</span>
      ) },
    { field: 'fechaCreacion', headerName: 'Fecha creación', description: 'Fecha de creación',
      sortable: false,
      minWidth: 400,flex:0.5,
      type: 'dateTime'
    },
    { field: 'button', headerName: 'Accion', minWidth: 200,disableClickEventBubbling: true,flex: 0.5,
    renderCell: (params) => {
      const onClick = () => {
        window.location = "servive?action=view&id="+params.value
      };
      const onEdit = () => {
        window.location = "service?action=update&id="+params.value
      };
      return <>
        <IconButton aria-label="Ver" onClick={onClick}>
          <VisibilityIcon />
        </IconButton>
        <>
          <IconButton aria-label="Ver" onClick={onEdit}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="Ver" onClick={onEdit}>
            <InfoIcon />
          </IconButton>
          </>
      </>
    }
    }
  ];

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={data} columns={columns} pageSize={5}
      filterModel={{
        items: [
          { columnField: 'nombre', operatorValue: 'contains', value: '' },
        ],
      }}/>
    </div>
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired
};

export default Results;
