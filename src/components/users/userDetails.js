import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import ReviewUpload from './reviewUpload';
import AddCertificate from './addCertificate';
import axios from 'axios';
import { URL } from '../../variables';
import moment from 'moment';

const UserDetails = ({token, user, selectUser, deselectUser}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalPurpose, setModalPurpose] = useState('');
    const [upload, setUpload] = useState(null);
    const [verifyingIdentity, setVerifyingIdentity] = useState(false);
    const [verifyingProfession, setVerifyingProfession] = useState(false);

    const enableCerts = user.accountType === 'PROFESSIONAL' ? true : false;

    const axiosConfig = {
        headers: {
            'authorization': 'bearer ' + token
        }
    }
    
    const deleteCertificate = (certificationId) => {
        axios.post(`${URL}/admin/deletecertification`, { userId: user._id, certificationId }, axiosConfig)
            .then((res) => {
                if (res.data.success) {
                    alert('Deletion was sucessful!');
                    selectUser(user._id);
                } else if (res.data.error) {
                    alert('Deletion failed: ' + res.data.error.message);
                }
            })
            .catch(error => {
                alert('Deletion failed: Network Error');
            })
    }

    const verifyIdentity = () => {
        setVerifyingIdentity(true);
        axios.post(`${URL}/admin/verifyidentity`, { userId: user._id }, axiosConfig)
            .then((res) => {
                if (res.data.success) {
                    alert('Verification was sucessful!');
                    setVerifyingIdentity(false);
                } else if (res.data.error) {
                    alert('Verification failed: ' + res.data.error.message);
                    setVerifyingIdentity(false);
                }
            })
            .catch(error => {
                alert('Verification failed: Network Error');
                setVerifyingIdentity(false);
            })
    }

    const verifyProfession = () => {
        setVerifyingProfession(true);
        axios.post(`${URL}/admin/verifyprofession`, { userId: user._id }, axiosConfig)
            .then((res) => {
                if (res.data.success) {
                    alert('Verification was sucessful!');
                    setVerifyingProfession(false);
                } else if (res.data.error) {
                    alert('Verification failed: ' + res.data.error.message);
                    setVerifyingProfession(false);
                }
            })
            .catch(error => {
                alert('Verification failed: Network Error');
                setVerifyingProfession(false);
            })
    }

    return (
        <div>
            <Modal appElement={document.getElementById('modal')} isOpen={modalOpen}>
                {
                    modalPurpose === 'REVIEW_UPLOAD' ?
                        <ReviewUpload setModalOpen={setModalOpen} token={token} userId={user._id} upload={upload} selectUser={selectUser} /> :
                        modalPurpose === 'ADD_CERT' ?
                            <AddCertificate setModalOpen={setModalOpen} token={token} selectUser={selectUser} user={user} /> :
                            <div className="row justify-content-center text-center py-4 px-4 mt-5">
                                <div className="col-10">
                                    <h5>No content to show</h5>
                                    <div>
                                        <button className="btn btn-danger" onClick={() => setModalOpen(false)}></button>
                                    </div>
                                </div>
                            </div>
                }
            </Modal>
            <div className="row">
                <div className="col-12 py-3 my-1 text-center text-muted">
                    <h2>Account Details For: <span className="text-capitalize">{user.surname}, {user.forenames}</span></h2>
                    <button onClick={deselectUser} className="btn btn-danger">Close File</button>
                </div>
            </div>
            <div className="row py-2 mt-4">
                <div className="col-md-6 col-sm-12">
                    <h4>Basic Information</h4>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item text-capitalize">Surname: {user.surname}</li>
                        <li className="list-group-item text-capitalize">Forenames: {user.forenames}</li>
                        <li className="list-group-item">Account Type: {user.accountType}</li>
                        <li className="list-group-item text-capitalize">Gender: {user.age}</li>
                        <li className="list-group-item text-capitalize">Age: {user.birthday && user.birthday.toString()}</li>
                        <li className="list-group-item">Email: {user.email}</li>
                        <li className="list-group-item">Phone: {user.phone}</li>
                        <li className="list-group-item">Address: {user.address}</li>
                    </ul>
                </div>
                <div className="col-md-6 col-sm-12">
                    <h4>Uploads</h4>
                    <ul className="list-group list-group-flush">
                        {
                            user.uploads.map((item, index) => {
                                return (
                                    <li key={item._id} className="list-group-item">
                                        <button
                                            onClick={() => {
                                                setUpload(item);
                                                setModalPurpose('REVIEW_UPLOAD');
                                                setModalOpen(true);
                                            }}
                                            className="btn btn-info float-right">Review Now</button>
                                        <span className="font-weight-bold">{index + 1} </span>
                                        {item.originalName}<br />
                                        Reviewed: { item.reviewed ? <span className="text-success font-weight-bold">YES</span>: <span className="text-danger font-weight-bold">NO</span>}
                                        { item.reviewed ?
                                            <span>, Accepted: { item.readOnly ? <span className="text-success font-weight-bold">YES</span> : <span className="text-danger font-weight-bold">NO</span>} </span> :
                                            <span />
                                        }
                                    </li>
                                );
                            })
                        }
                    </ul>
                    <h4 className="mt-4">Certificates</h4>
                    <ul className="list-group list-group-flush">
                        {
                            user.certification && user.certification.map((item) => {
                                return (
                                    <li key={item._id} className="list-group-item">
                                        <button
                                                onClick={() => deleteCertificate(item._id) }
                                                className="btn btn-danger float-right">Delete</button>
                                        {item.certification}<br />
                                        Issued by {item.certifyingBody} on {moment(item.date).format("Mo MMM YYYY")}<br />
                                        Document: {
                                            user.uploads.filter((item1) => {
                                                return (item1.s3key === item.document)
                                            }).map((item2) => {
                                                return (
                                                    <span key={item2._id}>{item2.originalName}</span>
                                                )
                                            })
                                        }
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>    
            <div className="row py-2 mt-4 justify-content-center">
                <div className="col-lg-6 col-md-8 col-sm-10">
                    <h4>Actions</h4>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            {
                                verifyingIdentity ?
                                <span className="fas fa-spinner fa-pulse fa-3x text-info float-right"></span>:
                                <button
                                    onClick={verifyIdentity}
                                    className="btn btn-info float-right">Verify Identity</button>

                            }
                            
                            If you have reviewed and accepted an identity document
                        </li>
                        <li className="list-group-item">
                            {
                                verifyingProfession ?
                                <span className="fas fa-spinner fa-pulse fa-3x text-info float-right"></span>:
                                <button
                                    disabled={!(user.certification.length > 0)}
                                    onClick={verifyProfession}
                                    className="btn btn-info float-right">Verify Profession</button>
                            }
                            If you have reviewed a Certificate/Licence and added one below
                        </li>
                        <li className="list-group-item">
                            <button
                                disabled={!enableCerts}
                                onClick={
                                    () => {
                                        setModalPurpose('ADD_CERT');
                                        setModalOpen(true);
                                    }
                                }
                                className="btn btn-info float-right">Add Certificate/Licence</button>
                            Add after reviewing relevant uploads
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default UserDetails;