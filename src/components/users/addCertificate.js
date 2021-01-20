import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../../variables';

const AddCertificate = ({setModalOpen, token, getCertificates, user}) => {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
            certification: '',
            certifying_body: '',
            certificate_num: '',
            issue_date: '',
            iduploads: ''
        });

    const [uploads, setUploads] = useState([]);
    
    const axiosConfig = {
        headers: {
            'authorization': 'bearer ' + token
        }
    }

    useEffect(() => {
        getUploads();
    }, [])

    const getUploads = () => {
        axios.get(`${URL}/admin/getuploads?iduser=${user.iduser}`, axiosConfig)
            .then((res) => {
                if (res.data.uploads) {
                    setUploads(res.data.uploads);
                    //select first upload as default on select box
                    if (res.data.uploads.length > 1) setForm(prev => ({ ...prev, iduploads: res.data.uploads[0].iduploads }));
                } else if (res.data.error) {
                    alert('Failed to get uploads: ' + res.data.error.message);
                }
            })
            .catch(error => {
                alert('Failed to get uploads: Network Error');
            })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (form.iduploads === '') {
            alert("Please select a supporting document");
            return;
        }

        setSubmitting(true);

        axios.post(`${URL}/admin/addcertification`, { iduser: user.iduser, ...form }, axiosConfig)
            .then((res) => {
                if (res.data.success) {
                    getCertificates();
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
                            <label htmlFor="certifying_body">Certifying Body</label>
                            <input className="form-control" type="text" id='certifying_body' onChange={handleChange} value={form.certifying_body} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="certificate_num">Certificate Number</label>
                            <input className="form-control" type="text" id='certificate_num' onChange={handleChange} value={form.certificate_num} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="issue_date">Date Of Issue</label>
                            <input className="form-control" type="date" id='issue_date' onChange={handleChange} value={form.issue_date} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="iduploads">Supporting Document</label>
                            <select className="form-control" id="iduploads" onChange={handleChange} value={form.iduploads}>
                                {
                                    uploads && uploads.map((item) => {
                                        return (
                                            <option key={item.iduploads} value={item.iduploads}>{item.originalname}</option>
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