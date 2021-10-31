import AuthenticationService from '../../../service/AuthenticationService';
import axios from 'axios'
const API_URL = AuthenticationService.getApiUrl();


class EncuestaService {

    findAll() {
        return axios.get(`${API_URL}/encuesta/`);
    }

    findById(id) {
        return axios.get(`${API_URL}/encuesta/${id}`);
    }    
    
    save(data){
        return axios.post(`${API_URL}/encuesta/`,data);
    }

    update(id, data){
        return axios.put(`${API_URL}/encuesta/${id}`, data);
    }

    //Controler de Categoria preguntas
    findByIdEncuesta(id) {
        return axios.get(`${API_URL}/categoria-pregunta/encuesta/${id}`);
    }
    
    saveEncuesta(data){
        return axios.post(`${API_URL}/categoria-pregunta/`,data);
    }

    //Controler de preguntas
    findByIdCategoria(id) {
        return axios.get(`${API_URL}/pregunta/categoria/${id}`);
    }
    
    savePregunta(data){
        return axios.post(`${API_URL}/pregunta/`,data);
    }

    //Controler de Respuestas
    findByIdPregunta(id) {
        return axios.get(`${API_URL}/respuesta/pregunta/${id}`);
    }
    
    saveRespuetas(data){
        return axios.post(`${API_URL}/respuesta/`,data);
    }
}

export const findAllAsync = async () => {
    try {
        const data = await axios.get(`${API_URL}/encuesta/`);
        return data.data;
        //return data.map(({ confirmed, deaths, reportDate: date }) => ({ confirmed: confirmed.total, deaths: deaths.total, date }));
    } catch (error) {
        return error;
    }
};

export default new EncuestaService();