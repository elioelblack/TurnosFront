import AuthenticationService from '../../../service/AuthenticationService';
import axios from 'axios'
const API_URL = AuthenticationService.getApiUrl();


class AtencionService {

    findAllEstacionesDisponibles() {
        return axios.get(`${API_URL}/atencion/estacion`);
    }

    findByIdCategories(id) {
        return axios.get(`${API_URL}/atencion/servicioscateg?id=${id}`);
    }

    findNextTurn() {
        return axios.get(`${API_URL}/atencion/next`);
    }

    findAllActiveStates(){
        return axios.get(`${API_URL}/atencion/states`);
    }

    updateTurn(id,data){
        return axios.put(`${API_URL}/turno/${id}`,data);
    }

    completeTurn(id){
        return axios.post(`${API_URL}/turno/complete/${id}`);
    }

    increaseCalled(id){
        return axios.post(`${API_URL}/turno/called/${id}`);
    }

    findTurnInProgress(){
        return axios.get(`${API_URL}/turno/inprogress`);
    }

    save(data) {
        return axios.post(`${API_URL}/atencion/estacion/usuario`,data);
    }

    vacateStation(){
        return axios.post(`${API_URL}/atencion/station/vacate`);
    }

    findOccupiedStation(){
        return axios.get(`${API_URL}/atencion/station/occupied`);
    }
}

export const findAllr = async () => {
    try {
        const data = await axios.get(`${API_URL}/kisko/`);
        return data.data;
        //return data.map(({ confirmed, deaths, reportDate: date }) => ({ confirmed: confirmed.total, deaths: deaths.total, date }));
    } catch (error) {
        return error;
    }
};

export default new AtencionService();