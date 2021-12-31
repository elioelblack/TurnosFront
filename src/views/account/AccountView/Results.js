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
import Constante from 'src/js/Constante';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, customers, encuestas,user, ...rest }) => {
  const classes = useStyles();

  const columns = [
    { field: 'id', headerName: 'No. Usuario', minWidth: 100},
    { field: 'nombre', headerName: 'Nombre Usuario', minWidth: 300,flex: 1 },
    { field: 'username', headerName: 'Username', minWidth: 200 },
    { field: 'rol', headerName: 'Rol', minWidth: 200 },
    { field: 'fechaNacimiento', headerName: 'Fecha Nacimiento', description: 'Fecha de nacimiento del usuario',
      sortable: false,
      minWidth: 400,flex:0.5,
      type: 'dateTime'
    },
    { field: 'button', headerName: 'Accion', minWidth: 200,disableClickEventBubbling: true,flex: 0.5,
    renderCell: (params) => {
      const onClick = () => {
        console.log(params.value)
        window.location = "usuario?action=view&id="+params.value
      };
      const onEdit = () => {
        console.log(params.value)
        window.location = "usuario?action=update&id="+params.value
      };
      return <>
        <IconButton aria-label="Ver" onClick={onClick}>
          <VisibilityIcon />
        </IconButton>
        {(user != null && user.idRol.idRol === Constante.ID_ROL_ADMIN) &&
        <>
          <IconButton aria-label="Ver" onClick={onEdit}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="Ver" onClick={onEdit}>
            <InfoIcon />
          </IconButton>
          </>
          }
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
      <DataGrid rows={encuestas} columns={columns} pageSize={5}
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
  encuestas: PropTypes.array.isRequired
};

export default Results;
