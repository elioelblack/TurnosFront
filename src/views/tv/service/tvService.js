import AuthenticationService from '../../../service/AuthenticationService';
import axios from 'axios'
const API_URL = AuthenticationService.getApiUrl();


class TvService {

    findTurnToShow() {
        return axios.get(`${API_URL}/turno/show`);
    }
}

export default new TvService();