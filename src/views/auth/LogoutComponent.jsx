import React, { Component } from 'react'
import AuthenticationService from '../../service/AuthenticationService';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
class LogoutComponent extends Component {
    componentDidMount(){
        AuthenticationService.logout()
        window.location = "/turnos/login"
    }
    render() {
        return (
            <>
                <div className="container" style={{textAlign:'center', marginTop:50}}>
                    <h1>Estas saliendo de la aplicacion de encuesta</h1>
                    <p>Gracias por usar nuestra aplicación. </p>
                    <ThumbUpIcon fontSize="large"/>
                </div>
            </>
        )
    }
}

export default LogoutComponent