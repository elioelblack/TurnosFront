import React, { Component } from 'react'
import { Route, Navigate } from 'react-router-dom'
import AuthenticationService from '../../service/AuthenticationService';

class AuthenticatedRoute extends Component {
    constructor(props){
        super(props)
        this.state={

        }
    }
    componentDidMount(){
        console.log(...this.props)
    }
    render() {
        if (AuthenticationService.isUserLoggedIn()) {
            return  {...this.props} 
        } else {
            return <Navigate to="/login" />
        }

    }
}

export default AuthenticatedRoute