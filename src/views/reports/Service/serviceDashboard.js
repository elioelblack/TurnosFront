import AuthenticationService from '../../../service/AuthenticationService';
import axios from 'axios'
const API_URL = AuthenticationService.getApiUrl();


class DashboardService {

    loadDashboardInfo() {
        return axios.get(`${API_URL}/encuesta/dashboard`);
    }

    loadDashboardInfo2() {
        return axios.get(`${API_URL}/encuesta/dashboard2`);
    }

    whoami(){
        return axios.get(`${API_URL}/admin/user/whoami`);
    }
}

export default new DashboardService();