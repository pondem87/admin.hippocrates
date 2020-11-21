import React, { useState } from 'react';
import axios from 'axios';
import { URL } from '../../variables';

const AddCertificate = ({setModalOpen, token, selectUser, user}) => {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
            certification: '',
            certifyingBody: '',
            identifyingNumber: '',
            date: '',
            document: user.uploads[0].s3key || ''
        });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        console.log('SUBMIT: ', form);

        const axiosConfig = {
            headers: {
                'authorization': 'bearer ' + token
            }
        }

        axios.post(`${URL}/admin/addcertification`, { userId: user._id, ...form }, axiosConfig)
            .then((res) => {
                if (res.data.success) {
                    selectUser(user._id);
                    setModalOpen(false);
                } else if (res.data.error) {
                    setError(res.data.error.message);
                }
                setSubmitting(false)
            })
            .catch(error => {
                setError('Network Error');
                setSubmitting(false);
            })
    }

    const handleChange = (e) => {
        let id = e.target.id;
        let value = e.target.value;
        setForm((prevState) => ({
            ...prevState,
            [id]: value
        }))
    }

    return (
        <div>
            <div className="row justify-content-center">
                <div className="col-12">
                    <button onClick={() => setModalOpen(false)} className="btn btn-danger float-right">Close</button>
                </div>
                <div className="col-12">
                    <h3 className="text-center py-3 my-3">Add New Certificate</h3>
                </div>
                <div className="col-lg-6 col-md-8 col-sm-10">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="certification">Certification</label>
                            <input className="form-control" type="text" id='certification' onChange={handleChange} value={form.certification} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="certifyingBody">Certifying Body</label>
                            <input className="form-control" type="text" id='certifyingBody' onChange={handleChange} value={form.certifyingBody} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="identifyingNumber">Certificate Number</label>
                            <input className="form-control" type="text" id='identifyingNumber' onChange={handleChange} value={form.identifyingNumber} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="date">Date Of Issue</label>
                            <input className="form-control" type="date" id='date' onChange={handleChange} value={form.date} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="document">Supporting Document</label>
                            <select className="form-control" id="document" onChange={handleChange} value={form.document}>
                                {
                                    user.uploads && user.uploads.map((item) => {
                                        return (
                                            <option key={item._id} value={item.s3key}>{item.originalName}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="text-center">
                        <p className="error-message">{ (error !== '') && error}</p>
                            {
                                submitting ?
                                    <span className="fas fa-spinner fa-pulse fa-3x text-info"></span> :
                                    <input type='submit' className="btn btn-primary" value="Add Certificate" />
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddCertificate;