import AuthenticationService from '../../../service/AuthenticationService';
import axios from 'axios'
const API_URL = AuthenticationService.getApiUrl();


class stationService {

    findAll() {
        return axios.get(`${API_URL}/admin/categ/`);
    }

    findById(id) {
        return axios.get(`${API_URL}/admin/categ/${id}`);
    }

    save(data){
        return axios.post(`${API_URL}/admin/categ/`,data);
    }

    update(id, data){
        return axios.put(`${API_URL}/detalle/${id}`, data);
    }

    updateusuario(id, data){
        return axios.put(`${API_URL}/admin/categ/${id}`, data);
    }

    whoami(){
        return axios.get(`${API_URL}/admin/categ/whoami`);
    }

    findAllStations() {
        return axios.get(`${API_URL}/admin/station/`);
    }

    findAllSites() {
        return axios.get(`${API_URL}/admin/sucursal/all`);
    }

    findStationBySite(id,idCateg){
        return axios.get(`${API_URL}/admin/station/site/${id}/${idCateg}`);
    }

    findcategoriasPorEstacionesByIdCategoria(idCategoria){
        return axios.get(`${API_URL}/admin/categ/categorias_estaciones/${idCategoria}`);
    }

    saveCategoriaEstacion(data){
        return axios.post(`${API_URL}/admin/catest`,data);
    }

    delete(id){
        return axios.delete(`${API_URL}/admin/catest/${id}`);
    }
}

export const findByDui = async (dui) => {
    try {
        const data = await axios.get(`${API_URL}/admin/categ/dui/${dui}`);
        return data;
    } catch (error) {
        return error;
    }
};

export default new stationService();