import axios from './axios';
import { URL } from '../variables'

export const getUserById = (token, iduser) => {
    return new Promise((resolve, reject) => {
        let queryString = '?iduser=' + iduser;

        const config = {
            headers: {
                'authorization': 'bearer ' + token
            }
        }

        axios.get(`${URL}/admin/fetchuser${queryString}`, config)
            .then(res => {
                if (res.data.user) {
                    resolve(res.data.user)
                } else {
                    reject(res.data.error ? res.data.error.message : "Unknown error")
                }
            })
            .catch(error => {
                reject("Network error")
            })
    })  
}

export const getUserTasks = (token, iduser) => {
    return new Promise((resolve, reject) => {

        const config = {
            headers: {
                'authorization': 'bearer ' + token
            }
        }

        axios.get(`${URL}/admin/getusertasks?iduser=${iduser}`, config)
            .then(res => {
                if (res.data.tasks) {
                    resolve(res.data.tasks)
                } else {
                    reject(res.data.error ? res.data.error.message : "Unknown error")
                }
            })
            .catch(error => {
                reject("Network error")
            })
    })  
}

export const setNewAdminTask = (token, iduser, task) => {
    return new Promise((resolve, reject) => {

        const config = {
            headers: {
                'authorization': 'bearer ' + token
            }
        }

        axios.post(`${URL}/admin/setnewtask`, {iduser, task}, config)
            .then(res => {
                if (res.data.success) {
                    resolve(res.data.success)
                } else {
                    reject(res.data.error ? res.data.error.message : "Unknown error")
                }
            })
            .catch(error => {
                reject("Network error")
            })
    })  
}