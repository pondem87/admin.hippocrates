import axios from 'axios';
import { URL } from '../variables'

//login function
export const loginFunc = (login, setErrorState, done, values) => {
    axios.post(`${URL}/admin/signin`, values)
        .then((res) => {
            if (res.data.token) {
                //login successful
                localStorage.setItem('jwt', res.data.token);
                login(res.data);
                done();
            } else if (res.data.error) {
                //failed to login
                setErrorState((prevState) => ({
                    ...prevState,
                    error: res.data.error.message
                }))
            } else {
                setErrorState((prevState) => ({
                    ...prevState,
                    error: 'Unknown Error'
                }))
            }
        })
        .catch((error) => {
            setErrorState((prevState) => ({
                ...prevState,
                error: 'Network Error'
            }))
        });
}