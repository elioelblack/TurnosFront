import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Icon, makeStyles } from '@material-ui/core';
import NavBar from './NavBar';
import TopBar from './TopBar';
import AuthenticationService from 'src/service/AuthenticationService';
import Constante from 'src/js/Constante';
import {
  BarChart as BarChartIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  LogOut as LogOutIcon
} from 'react-feather';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}));

const DashboardLayout = () => {
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [items, setItems] = useState([]);
  const [itemsMenu, setItemsMenu] = useState([])

  useEffect(() => {
    function loadUserDetails() {
      AuthenticationService.whoami()
        .then(response => {
          //console.log(response.data)
          setUserDetail(response.data)
        }).catch(err => {
          console.error(err)
        })
    }

    const loadMenuListByRol = () => {
      AuthenticationService.loadMenuListByRol()
        .then(response => {
          console.log(response.data)
          setItems(makeMenus(response.data))
        }).catch(err => {
          toast.error('Error al cargar menus de usuario')
        })
    }
    loadUserDetails();
    loadMenuListByRol();
  }, []);

  const makeMenus = (data) => {
    let listaMenus = []
    data.map(
      m => {
        return (
          listaMenus.push(
            {
              href: m.idMenu.url,
              icon: (m.idMenu.iconoMenu !== null && m.idMenu.iconoMenu !== '') && <Icon >{m.idMenu.iconoCategoria}</Icon>,
              title: m.idMenu.nombre
            }
          )
        )
      }
    )
    //Agrega de ultimo el menu de Salir
    listaMenus.push(
      {
        href: '/app/logout',
        icon: LogOutIcon,
        title: 'Salir'
      },
    )
    return listaMenus;
  }

  if ((userDetail != null && userDetail.idRol.idRol === Constante.ID_ROL_ADMIN)) {
    items.push(
      {
        href: '/app/users',
        icon: UserIcon,
        title: 'Usuarios'
      },
      {
        href: '/app/stations',
        icon: UserIcon,
        title: 'Estaciones'
      },
      {
        href: '/app/categories',
        icon: UserIcon,
        title: 'Categorías de servicios'
      },
      {
        href: '/app/services',
        icon: UserIcon,
        title: 'Servicios'
      })
  }



  //Variable de info del usuario
  const user = {
    avatar: '/static/images/avatars/default-avatar.png',
    jobTitle: (userDetail != null) ? userDetail.username + ' (' + userDetail.idRol.nombre + ') ' : 'loading',
    name: (userDetail != null) ? userDetail.primerNombre + " " + userDetail.primerApellido : 'loading',
    id_user: (userDetail != null) ? userDetail.idUsuario : 0
  };


  return (
    <div className={classes.root}>
      <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
        items={items}
        user={user}
      />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
