import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import RegisterView from 'src/views/auth/RegisterView';
import LogoutComponent from './views/auth/LogoutComponent';
import AuthenticationService from './service/AuthenticationService';
import Usuario2 from 'src/views/account/AccountView/indexUsuario';
import Stations from './views/station';
import StationView from './views/station/stationView';
import Categories from './views/categoryService';
import Category from './views/categoryService/category';
import Services from './views/services';
import ServiceView from './views/services/serviceView';
import KioskoView from './views/kiosko/kioskoView';
import AtencionView from './views/atencion';
import TvView from './views/tv';

AuthenticationService.setupAxiosInterceptors(
  AuthenticationService.createJWTToken(
      AuthenticationService.getTokenUser())
)

const isUserLogin = () => {
  //console.log({path, element})
  if (AuthenticationService.isUserLoggedIn()) {
    //console.log("1")
    return true
  } else {
    //console.log("2")
    return false
  }
}

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'users', element: isUserLogin()?<AccountView />:<Navigate to="/login" /> },
      { path: 'dashboard', element: isUserLogin()?<DashboardView />:<Navigate to="/login" /> },
      { path: 'usuario', element: isUserLogin()?<Usuario2 />:<Navigate to="/login" /> },
      { path: 'stations', element: isUserLogin()?<Stations />:<Navigate to="/login" /> },
      { path: 'station', element: isUserLogin()?<StationView/>:<Navigate to="/login" /> },
      { path: 'categories', element: isUserLogin()?<Categories/>:<Navigate to="/login" /> },
      { path: 'category', element: isUserLogin()?<Category/>:<Navigate to="/login" /> },
      { path: 'services', element: isUserLogin()?<Services/>:<Navigate to="/login" /> },
      { path: 'service', element: isUserLogin()?<ServiceView/>:<Navigate to="/login" /> },
      { path: 'atencion', element: isUserLogin()?<AtencionView/>:<Navigate to="/login" /> },
      { path: '/logout', element: <LogoutComponent /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <LoginView /> },
      { path: '*', element: <Navigate to="/404" /> },
      {path: '/kiosko', element: <KioskoView />},
      { path: '/tv', element: <TvView/> },
    ]
  }
];


export default routes