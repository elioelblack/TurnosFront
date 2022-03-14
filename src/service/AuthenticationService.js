import axios from 'axios';

//let API_URL = 'https://eliotest-heroku-spring.herokuapp.com';
//let API_URL = 'https://turnos-api.herokuapp.com';
//let API_URL = 'http://queueapp.tumundoenjava.com:8080/Turnos';
let API_URL = 'http://localhost:8080';

export let USER_NAME_SESSION_ATTRIBUTE_NAME = 'user'
export let TOKEN_USER = "token";

class AuthenticationService {

    executeJwtAuthenticationService(username, password) {
        return axios.post(`${API_URL}/authenticate`, {
            username,
            password
        })
    }

    registerSuccessfulLoginForJwt(username, token) {
        sessionStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username)
        sessionStorage.setItem(TOKEN_USER, token)
        this.setupAxiosInterceptors(this.createJWTToken(token))

    }

    createJWTToken(token) {
        return 'Bearer ' + token
    }

    getTokenUser() {
        let token = sessionStorage.getItem(TOKEN_USER)
        if (token === null) return ''
        return token
    }

    logout() {
        sessionStorage.removeItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
        localStorage.removeItem('originLoginExterno');
        sessionStorage.removeItem('id_unidad');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('ROLE');
        sessionStorage.removeItem('EXP_DATE');
        sessionStorage.removeItem('INST');
        sessionStorage.removeItem('idUnidadRecurso');
    }

    modifyUnidadRecurso(id, data) {
        return axios.put(`${API_URL}/unidad_recurso/${id}`, data,
            { headers: { 'Authorization': "Bearer " + sessionStorage.getItem("token") } })
    }

    isUserLoggedIn() {
        let user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        if (user === null) return false
        //console.log(user+".....")
        return true
    }

    getLoggedInUserName() {
        let user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        if (user === null) return ''
        return user
    }

    setupAxiosInterceptors(token) {
        axios.interceptors.request.use(
            (config) => {
                if (this.isUserLoggedIn()) {
                    config.headers.authorization = token
                }
                //console.log(config+" ***** ")
                return config
            }
        )
    }
    getApiUrl() {
        let apiUrl = API_URL;
        if (apiUrl === null) return ''
        return apiUrl
    }

    whoami(){
        return axios.get(`${API_URL}/admin/user/whoami`);
    }

    loadMenuListByRol(){
        return axios.get(`${API_URL}/admin/menurol/rol`);
    }
}
export default new AuthenticationService();
export const whoami = async () => {
    try {
        const { data } = await axios.get(`${API_URL}/admin/user/whoami`);
        return { data };
        //return data.map(({ confirmed, deaths, reportDate: date }) => ({ confirmed: confirmed.total, deaths: deaths.total, date }));
    } catch (error) {
        return error;
    }
};
export const fetchUserDetails = async (username) => {
    try {
        const { data } = await axios.get(`${API_URL}/admin/user/username/${username}`);
        return { data };
        //return data.map(({ confirmed, deaths, reportDate: date }) => ({ confirmed: confirmed.total, deaths: deaths.total, date }));
    } catch (error) {
        return error;
    }
};
