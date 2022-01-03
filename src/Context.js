import React, { createContext, useState } from "react";
import AuthenticationService from './service/AuthenticationService';
import solReact from './js/solReact';

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

const stationSelected = () => {
  return sessionStorage.getItem('station');
}

let ContextReact = createContext()
ContextReact.displayName = 'ContextAuth';

const Provider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(isUserLogin)
  const [stationAttended, setStationAttended] = useState(stationSelected)
  //console.log('From Context:'+String(children))
  const value = {
    isAuth,
    activateAuth: response => {
      setIsAuth(true)
      let test = solReact.parseJwt(response.data.token);
      let USER = test.sub;
      AuthenticationService.registerSuccessfulLoginForJwt(USER, response.data.token)
      AuthenticationService.setupAxiosInterceptors(AuthenticationService.createJWTToken(response.data.token));
    },
    stationAttended,
    selectStationToAttend: stationData => {
      setStationAttended(JSON.stringify(stationData))
      sessionStorage.setItem('station', JSON.stringify(stationData))
    },
    destroyStationAttended:()=>{
      sessionStorage.removeItem('station');
      setStationAttended(null)
    }
  }
  //console.log(value.stationAttended)
  return (
    <ContextReact.Provider value={value}>
      {children}
    </ContextReact.Provider>
  )
}

const Context = {
  Provider,
  Consumer: ContextReact.Consumer
}
export default Context;

