import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { loginFunc } from '../../functions/auth';
import Loader from '../shared/loader'

const SignIn = () => {
    const { login } = useContext(UserContext);
    const [state, setState] = useState({
        username: '',
        password: '',
        error: ''
    })
    const [isLoading, setLoader] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (state.error !== '')setLoader(false)
    }, [state.error])

    const handleChange = (e) => {
        let id = e.target.id;
        let value = e.target.value;
        setState((prevState) => ({
            ...prevState,
            [id]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        loginFunc(login, setState, done, {username: state.username, password: state.password});
        setState({
            username: '',
            password: '',
            error: ''
        })
        setLoader(true);
    }

    const done = () => {
        history.push('/');
    }

        return (
            isLoading ? <Loader /> :
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8 col-sm-10">
                    <div className="py-3 text-center text-muted">
                        <h4>Welcome to the Admin Panel</h4>
                    </div>
                    <form onSubmit={handleSubmit} className="border border-info rounded py-2 px-5">
                        <p className="error-message">{state.error}</p>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input className="form-control" type='text' id='username' onChange={handleChange} value={state.email} required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <label htmlFor="password"></label>
                            <input className="form-control" type='password' id='password' onChange={handleChange} value={state.password} required />
                        </div>
                        <div className="text-center">
                            <input type='submit' className="btn btn-primary" value="Login" />
                        </div>
                    </form>
                    <div className="my-2 text-center">
                        <p>Contact system admin for login credentials</p>
                    </div>
                </div>
            </div>
        )
}

export default SignIn;