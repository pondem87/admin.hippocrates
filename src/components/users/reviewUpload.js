import React, { useState } from 'react';
import axios from 'axios';
import { URL } from '../../variables';

const ReviewUpload = ({setModalOpen, token, userId, upload, selectUser}) => {
    const [enableDownload, setEnableDownload] = useState(true);
    const [form, setForm] = useState({
            comments: '',
            acceptable: 'ACCEPTED'
        });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('SUBMIT: ', form);
        setSubmitting(true);

        const config = {
            headers: {
                'authorization': 'bearer ' + token
            }
        }

        axios.post(`${URL}/admin/updateupload`, { userId, uploadId: upload._id, ...form }, config)
            .then((res) => {
                if (res.status === 200) {
                    selectUser(userId);
                    setModalOpen(false);
                } else {
                    setError('Failed to upadate upload: status ', res.status);
                    setSubmitting(false);
                }
            })
            .catch((error) => {
                setError(error.message);
                setSubmitting(false);
            });
        
    }

    const download = () => {
        setEnableDownload(false);
        const config = {
            headers: {
                'authorization': 'bearer ' + token
            },
            responseType: 'blob'
        }

        let _fix = upload.s3key.split('/');

        axios.get(`${URL}/admin/download/${upload.originalName}?prefix=${_fix[0]}&suffix=${_fix[1]}`, config)
            .then((res) => {
                console.log(res);
                let url = window.URL.createObjectURL(new Blob([res.data], { type: upload.mimeType }));
                let link = document.createElement('a');
                link.href = url;
                link.download = upload.originalName;
                link.click();
                setEnableDownload(true);
            })
            .catch((error) => {
                console.log(error)
                setEnableDownload(true);
            });
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
                    <h3 className="text-center py-3 my-3">Review Upload</h3>
                    <div className="text-center">
                        {
                            enableDownload ?
                                <button onClick={download} className="btn btn-info">Download File</button> :
                                <span className="fas fa-spinner fa-pulse fa-3x text-info"></span>
                        }
                        <p className="font-weight-bold">{upload.originalName}</p>
                    </div>
                </div>
                <div className="col-lg-8 col-md-10 col-sm-12 mt-4 px-5 py-5 border border-info rounded">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="comments">Comments about document</label>
                            <textarea className="form-control" id='comments' onChange={handleChange} value={form.comments} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="acceptable">Do you accept document?</label>
                            <select className="form-control" id="acceptable" onChange={handleChange} value={form.acceptable}>
                                <option value="ACCEPTED">Accept</option>
                                <option value="REJECTED">Reject</option>
                            </select>
                        </div>
                        <div className="text-center">
                            <p className="error-message">{ (error !== '') && error}</p>
                            {
                                submitting ?
                                    <span className="fas fa-spinner fa-pulse fa-3x text-info"></span> :
                                    <input type='submit' className="btn btn-primary" value="submit review" />
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ReviewUpload;