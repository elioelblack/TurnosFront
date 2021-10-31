import AuthenticationService from '../../../service/AuthenticationService';
import axios from 'axios'
const API_URL = AuthenticationService.getApiUrl();


class UsuarioService {

    findAll() {
        return axios.get(`${API_URL}/usuario/`);
    }

    findById(id) {
        return axios.get(`${API_URL}/usuario/${id}`);
    }
    
    save(data){
        return axios.post(`${API_URL}/usuario/`,data);
    }

    update(id, data){
        return axios.put(`${API_URL}/detalle/${id}`, data);
    }

    updateusuario(id, data){
        return axios.put(`${API_URL}/usuario/${id}`, data);
    }

    whoami(){
        return axios.get(`${API_URL}/usuario/whoami`);
    }
}

export const findAllr = async () => {
    try {
        const data = await axios.get(`${API_URL}/usuario/`);
        return data.data;
        //return data.map(({ confirmed, deaths, reportDate: date }) => ({ confirmed: confirmed.total, deaths: deaths.total, date }));
    } catch (error) {
        return error;
    }
};

export default new UsuarioService();