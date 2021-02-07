import axios from './axios';
import { URL } from '../variables';

export const getServiceProviders = (token, serviceType, page, limit) => {
    return new Promise((resolve, reject) => {

        const config = {
            headers: {
                'authorization': 'bearer ' + token
            }
        }

        axios.get(`${URL}/admin/getserviceproviders?service=${serviceType}&page=${page}&limit=${limit}`, config)
            .then(res => {
                if (res.data.providers) {
                    resolve(res.data.providers)
                } else {
                    reject(res.data.error ? res.data.error.message : "Unknown error")
                }
            })
            .catch(error => {
                reject("Network error")
            })
    })  
}