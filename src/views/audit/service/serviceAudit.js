import AuthenticationService from '../../../service/AuthenticationService';
import axios from 'axios'
const API_URL = AuthenticationService.getApiUrl();


class AuditService {

    loadAuditByIdPedido(claveEndpoint) {
        return axios.get(`${API_URL}/auditoria/${claveEndpoint}`);
    }

    whoami(){
        return axios.get(`${API_URL}/usuario/whoami`);
    }
}

export default new AuditService();