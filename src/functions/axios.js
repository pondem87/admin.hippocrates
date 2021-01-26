import axios from 'axios';

axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    console.log("error:::", error.response.status);
    if (error.response.status === 403) {
        localStorage.removeItem('jwt');
        window.location.reload()
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

export default axios;