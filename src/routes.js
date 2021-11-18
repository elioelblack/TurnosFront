import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import CustomerListView from 'src/views/customer/CustomerListView';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import ProductListView from 'src/views/product/ProductListView';
import RegisterView from 'src/views/auth/RegisterView';
import SettingsView from 'src/views/settings/SettingsView';
import LogoutComponent from './views/auth/LogoutComponent';
import NewEncuesta from 'src/views/customer/CustomerListView/NewEncuesta';
import AuthenticationService from './service/AuthenticationService';
import Usuario2 from 'src/views/account/AccountView/indexUsuario';
import Stations from './views/station';
import StationView from './views/station/stationView';

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
      { path: 'customers', element: isUserLogin()?<CustomerListView />:<Navigate to="/login" />},
      { path: 'dashboard', element: isUserLogin()?<DashboardView />:<Navigate to="/login" /> },
      { path: 'report', element: isUserLogin()?<ProductListView />:<Navigate to="/login" /> },
      { path: 'settings', element: isUserLogin()?<SettingsView />:<Navigate to="/login" /> },
      { path: 'encuesta', element: isUserLogin()?<NewEncuesta />:<Navigate to="/login" /> },
      { path: 'usuario', element: isUserLogin()?<Usuario2 />:<Navigate to="/login" /> },
      { path: 'stations', element: isUserLogin()?<Stations />:<Navigate to="/login" /> },
      { path: 'station', element: isUserLogin()?<StationView/>:<Navigate to="/login" /> },
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
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
