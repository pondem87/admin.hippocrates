import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Loader from '../shared/loader';
import { ResetPasswordFunc } from '../../functions/auth';

const Reset = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleSubmit = async (e) => {
        try {
            setLoading(true);
            await ResetPasswordFunc(email);
            alert("Password sent to email");
            history.push('/signin');
        } catch (error) {
            alert("Failed to reset: " + error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <Loader />
    }

    return (
        <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-sm-10">
                <div className="py-3 text-center text-muted">
                    <h4>Reset your password</h4>
                    <p>This action will generate a password and send to your email</p>
                </div>
                <form onSubmit={handleSubmit} className="border border-info rounded py-2 px-5">
                    <div className="form-group">
                        <label htmlFor="username">Email</label>
                        <input className="form-control" type='text' id='email' onChange={(e) => setEmail(e.target.value)} value={email} required />
                    </div>
                    <div className="text-center">
                        <input type='submit' className="btn btn-primary" value="Submit" />
                    </div>
                </form>
                <div className="my-2 text-center">
                    <p><Link to="/signin">Log In</Link></p>
                </div>
            </div>
        </div>
    )

}

export default Reset;