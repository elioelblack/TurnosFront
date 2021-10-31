import AuthenticationService from '../../../service/AuthenticationService';
import axios from 'axios'
const API_URL = AuthenticationService.getApiUrl();

var configExport = {
    responseType: 'blob'
}
class EncuestaService {

    findAll() {
        return axios.get(`${API_URL}/encuesta/`);
    }

    findById(id) {
        return axios.get(`${API_URL}/encuesta/${id}`);
    }    
    
    loadReport(reportName,data){
        return axios.post(`${API_URL}/reportes/${reportName}`,data, configExport);
    }

    loadReportExcel(reportName,data){
        return axios.post(`${API_URL}/reportes/${reportName}/xlsx/`,data, configExport);
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