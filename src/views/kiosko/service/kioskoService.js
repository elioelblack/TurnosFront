import AuthenticationService from '../../../service/AuthenticationService';
import axios from 'axios'
const API_URL = AuthenticationService.getApiUrl();


class KioskoService {

    findAllCategories() {
        return axios.get(`${API_URL}/kiosko/categories`);
    }

    findByIdCategories(id) {
        return axios.get(`${API_URL}/kiosko/servicioscateg?id=${id}`);
    }

    save(data) {
        return axios.post(`${API_URL}/kiosko/turno`,data);
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

export default new KioskoService();