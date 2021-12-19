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

  const stationSelected = ()=>{
    return sessionStorage.getItem('station');
  }

let Context = createContext()
Context.displayName = 'ContextAuth';

const Provider = ({children})=>{
    const [isAuth,setIsAuth] = useState(isUserLogin)
    const [stationAttended,setStationAttended] = useState(stationSelected)
    console.log('From Context:'+String(children))
    const value ={
        isAuth,
        activateAuth:response=>{
            setIsAuth(true)
            let test = solReact.parseJwt(response.data.token);
            let USER = test.sub;
            AuthenticationService.registerSuccessfulLoginForJwt(USER, response.data.token)
            AuthenticationService.setupAxiosInterceptors(AuthenticationService.createJWTToken(response.data.token));
        },
        stationAttended,
        selectStationToAttend:stationData=>{
          setStationAttended(stationData)
          sessionStorage.setItem('station',JSON.stringify(stationData))
        }
    }
    console.log(value.stationAttended)
    return(
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
}

export default {
    Provider,
    Consumer: Context.Consumer
}