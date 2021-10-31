import AuthenticationService from '../../../service/AuthenticationService';
import axios from 'axios'
const API_URL = AuthenticationService.getApiUrl();


class EncuestaService {

    findAll() {
        return axios.get(`${API_URL}/pedido/`);
    }

    findById(id) {
        return axios.get(`${API_URL}/pedido/${id}`);
    }

    findPreguntasById(id) {
        return axios.get(`${API_URL}/pedido/preguntas/${id}`);
    }

    findRespuestasById(id) {
        return axios.get(`${API_URL}/pedido/respuestas/${id}`);
    }

    save(data){
        return axios.post(`${API_URL}/pedido/`,data);
    }

    update(id, data){
        return axios.put(`${API_URL}/detalle/${id}`, data);
    }

    updatePedido(id, data){
        return axios.put(`${API_URL}/pedido/${id}`, data);
    }

    whoami(){
        return AuthenticationService.whoami();
    }

    getAllEncuestas() {
        return axios.get(`${API_URL}/encuesta/`);
    }
}

export const findAllr = async () => {
    try {
        const data = await axios.get(`${API_URL}/pedido/`);
        return data.data;
        //return data.map(({ confirmed, deaths, reportDate: date }) => ({ confirmed: confirmed.total, deaths: deaths.total, date }));
    } catch (error) {
        return error;
    }
};

export default new EncuestaService();