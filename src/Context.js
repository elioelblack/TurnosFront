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

let Context = createContext()
Context.displayName = 'ContextAuth';

const Provider = ({children})=>{
    const [isAuth,setIsAuth] = useState(isUserLogin)
    console.log('From Context:'+String(children))
    const value ={
        isAuth,
        activateAuth:response=>{
            setIsAuth(true)
            let test = solReact.parseJwt(response.data.token);
            let USER = test.sub;
            AuthenticationService.registerSuccessfulLoginForJwt(USER, response.data.token)
            AuthenticationService.setupAxiosInterceptors(AuthenticationService.createJWTToken(response.data.token));
        }
    }
    console.log(value)
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