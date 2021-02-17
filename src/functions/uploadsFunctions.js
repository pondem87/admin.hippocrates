import axios from './axios';
import { URL } from '../variables';

export const fetchAllUploads = (token, filters, page, limit) => {
    return new Promise((resolve, reject) => {

        const config = {
            headers: {
                'authorization': 'bearer ' + token
            }
        }

        //process filters
        let query_ext = `&unreviewed=${filters.unreviewed}`

        axios.get(`${URL}/admin/getalluploads?page=${page}&limit=${limit}${query_ext}`, config)
            .then(res => {
                if (res.data.uploads) {
                    resolve(res.data.uploads)
                } else {
                    reject(res.data.error ? res.data.error.message : "Unknown error")
                }
            })
            .catch(error => {
                reject("Network error")
            })
    })  
}