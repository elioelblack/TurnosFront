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
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, customers, encuestas, ...rest }) => {
  const classes = useStyles();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  //console.log(encuestas)

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = encuestas.map((customer) => customer.id);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    alert(newPage)
    setPage(newPage);
  };

  const columns = [
    { field: 'id', headerName: 'No. Ficha', width: 100,flex: 1 },
    { field: 'nombre_usuario', headerName: 'Nombre encuestado', width: 200 },
    { field: 'nombre_puesto', headerName: 'Puesto', width: 200 },
    { field: 'direccion_puesto', headerName: 'Direccion', width: 200 },
    { field: 'fecha_pedido', headerName: 'Fecha encuesta', description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 200,
      type: 'dateTime'
    },
    { field: 'button', headerName: 'Accion', width: 200,disableClickEventBubbling: true,flex: 1,
    renderCell: (params) => {
      const onClick = () => {
        console.log(params.value)
        window.location = "encuesta?action=update&id="+params.value
      };

      return <IconButton aria-label="Ver" onClick={onClick}>
                <VisibilityIcon />
              </IconButton>
    }
    }
  ];
  
  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: "35",fullName:"khk"},
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];
  

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={encuestas} columns={columns} pageSize={5} checkboxSelection 
      filterModel={{
        items: [
          { columnField: 'nombre_usuario', operatorValue: 'contains', value: '' },
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
