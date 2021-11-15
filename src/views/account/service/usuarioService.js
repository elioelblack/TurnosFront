import AuthenticationService from '../../../service/AuthenticationService';
import axios from 'axios'
const API_URL = AuthenticationService.getApiUrl();


class UsuarioService {

    findAll() {
        return axios.get(`${API_URL}/admin/user/`);
    }

    findById(id) {
        return axios.get(`${API_URL}/admin/user/${id}`);
    }

    save(data){
        return axios.post(`${API_URL}/admin/user/`,data);
    }

    update(id, data){
        return axios.put(`${API_URL}/detalle/${id}`, data);
    }

    updateusuario(id, data){
        return axios.put(`${API_URL}/admin/user/${id}`, data);
    }

    whoami(){
        return axios.get(`${API_URL}/admin/user/whoami`);
    }
}

export const findByDui = async (dui) => {
    try {
        const data = await axios.get(`${API_URL}/admin/user/dui/${dui}`);
        return data;
    } catch (error) {
        return error;
    }
};

export const findByNit = async (nit) => {
    try {
        const data = await axios.get(`${API_URL}/admin/user/nit/${nit}`);
        return data;
    } catch (error) {
        return error;
    }
};

export default new UsuarioService();