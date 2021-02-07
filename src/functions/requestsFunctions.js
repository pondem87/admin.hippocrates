import axios from './axios';
import { URL } from '../variables';

export const getUserRequests = (token, filters, page, limit) => {
    return new Promise((resolve, reject) => {

        const config = {
            headers: {
                'authorization': 'bearer ' + token
            }
        }

        //process filters
        let query_ext = ''
        if (filters.new) query_ext += '&processed=0';
        if (filters.pending) query_ext += '&fullfilled=0&reject=0';
        if (filters.paid) query_ext += '&paid=1'

        axios.get(`${URL}/admin/getuserrequests?page=${page}&limit=${limit}${query_ext}`, config)
            .then(res => {
                if (res.data.requests) {
                    resolve(res.data.requests)
                } else {
                    reject(res.data.error ? res.data.error.message : "Unknown error")
                }
            })
            .catch(error => {
                reject("Network error")
            })
    })  
}

export const assignRequestToProvider = (token, data) => {
    return new Promise((resolve, reject) => {

        const config = {
            headers: {
                'authorization': 'bearer ' + token
            }
        }

        axios.post(`${URL}/admin/assignprovider`, data, config)
            .then(res => {
                if (res.data.success) {
                    resolve(res.data.success.message)
                } else {
                    reject(res.data.error ? res.data.error.message : "Unknown error")
                }
            })
            .catch(error => {
                reject("Network error")
            })
    })  
}

export const declineARequest = (token, data) => {
    return new Promise((resolve, reject) => {

        const config = {
            headers: {
                'authorization': 'bearer ' + token
            }
        }

        axios.post(`${URL}/admin/declinerequest`, data, config)
            .then(res => {
                if (res.data.success) {
                    resolve(res.data.success.message)
                } else {
                    reject(res.data.error ? res.data.error.message : "Unknown error")
                }
            })
            .catch(error => {
                reject("Network error")
            })
    })  
}

export const getRequestAssignments = (token, idservice_requests) => {
    return new Promise((resolve, reject) => {

        const config = {
            headers: {
                'authorization': 'bearer ' + token
            }
        }

        axios.get(`${URL}/admin/getrequestassignments/${idservice_requests}`, config)
            .then(res => {
                if (res.data.assignments) {
                    resolve(res.data.assignments)
                } else {
                    reject(res.data.error ? res.data.error.message : "Unknown error")
                }
            })
            .catch(error => {
                reject("Network error")
            })
    })  
}

export const setRequestCompleted = (token, idservice_requests) => {
    return new Promise((resolve, reject) => {

        const config = {
            headers: {
                'authorization': 'bearer ' + token
            }
        }

        axios.post(`${URL}/admin/completerequest`, {idservice_requests}, config)
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

