import AuthenticationService from '../../../service/AuthenticationService';
import axios from 'axios'
const API_URL = AuthenticationService.getApiUrl();


class stationService {

    findAll() {
        return axios.get(`${API_URL}/admin/service/`);
    }

    findById(id) {
        return axios.get(`${API_URL}/admin/service/${id}`);
    }

    save(data){
        return axios.post(`${API_URL}/admin/service/`,data);
    }

    update(id, data){
        return axios.put(`${API_URL}/detalle/${id}`, data);
    }

    updateusuario(id, data){
        return axios.put(`${API_URL}/admin/service/${id}`, data);
    }

    whoami(){
        return axios.get(`${API_URL}/admin/service/whoami`);
    }

    findAllCateg() {
        return axios.get(`${API_URL}/admin/categ/`);
    }
}

export const findByDui = async (dui) => {
    try {
        const data = await axios.get(`${API_URL}/admin/service/dui/${dui}`);
        return data;
    } catch (error) {
        return error;
    }
};

export default new stationService();