import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import { URL } from '../../variables';

const Home = () => {
    const {user, token} = useContext(UserContext);
    const [admins, setAdmins] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        username: '',
        surname: '',
        forenames: '',
        password: ''
    });

    const axiosConfig = {
        headers: {
            'authorization': 'bearer ' + token
        }
    }
    
    const handleChange = (e) => {
        let id = e.target.id;
        let value = e.target.value;
        setForm((prevState) => ({
            ...prevState,
            [id]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${URL}/admin/create`, form, axiosConfig)
            .then((res) => {
                if (res.data.success) {
                    alert('New admin has been created');
                } else {
                    alert('Failed to create account: ', res.data.error.message);
                }
                setSubmitting(false);
            })
            .catch((error) => {
                alert('Failed to create user: ', error.message);
                setSubmitting(false);
            });
    }

    useEffect(() => {
        axios.get(`${URL}/admin/getadmins`, axiosConfig)
            .then((res) => {
                if (res.data.admins) {
                    setAdmins(res.data.admins);
                } else {
                    alert('Failed to get admins list', res.data.error.message);
                }
            })
            .catch((error) => {
                alert('Failed to get admins list', error.message);
            });
    }, [])

    return (
        <div>
            <div className="row">
                <div className="col-12 py-3 my-1 text-center text-muted">
                    <h2>Welcome To Administration Panel</h2>
                    <h5>Current User: <span className="text-capitalize">{user.surname}, {user.forenames}</span></h5>
                </div>
            </div> 
            <div className="row">
                <div className="col-md-6 col-sm-10">
                    <h4>Admins</h4>
                    <ul className="list-group list-group-flush">
                        {
                            admins && admins.map((admin) => {
                                return (
                                    <li className="list-group-item" key={admin._id}>
                                        <span className="text-capitalize float-right">{admin.surname}, {admin.forenames}</span>
                                        <span className="font-weight-bold">{admin.username}</span>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="col-md-6 col-sm-10">
                    <h4>Create Admin Account</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input className="form-control" type="text" id='username' minLength={8} onChange={handleChange} value={form.username} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="surname">Surname</label>
                            <input className="form-control" type="text" id='surname' onChange={handleChange} value={form.surname} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="forenames">Forenames</label>
                            <input className="form-control" type="text" id='forenames' onChange={handleChange} value={form.forenames} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input className="form-control" type="text" id='password' minLength={8} onChange={handleChange} value={form.password} required />
                        </div>
                        <div className="text-center">
                            {
                                submitting ?
                                    <span className="fas fa-spinner fa-pulse fa-3x text-info"></span> :
                                    <input type='submit' className="btn btn-primary" value="Create Account" />
                            }
                        </div>
                    </form>
                </div>
            </div>  
        </div>
    )
}

export default Home;