import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Card,
  makeStyles,
  Button,
} from '@material-ui/core';
import KeyboardVoiceIcon from '@material-ui/icons/Save';
import { DataGrid,CellParams,GridApi } from '@material-ui/data-grid';
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
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  console.log(JSON.stringify(user))

  

  const columns = [
    { field: 'id', headerName: 'No. Usuario', width: 100,flex: 1 },
    { field: 'nombre', headerName: 'Nombre Usuario', width: 200 },
    { field: 'username', headerName: 'Username', width: 200 },
    { field: 'rol', headerName: 'Rol', width: 200 },
    { field: 'fecha_registro', headerName: 'Fecha Creación', description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 200,
      type: 'dateTime'
    },
    { field: 'button', headerName: 'Accion', width: 400,disableClickEventBubbling: true,flex: 1,
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
        {(user != null && user.id_rol.id_rol === Constante.ID_ROL_ADMIN) &&
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
  customers: PropTypes.array.isRequired
};

export default Results;
