import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import ReviewUpload from './reviewUpload';
import AddCertificate from './addCertificate';
import axios from '../../functions/axios';
import { URL } from '../../variables';
import moment from 'moment';
import { getUserById } from '../../functions/usersFunctions';
import { UserContext } from '../../context/userContext';
import Loader from '../../components/shared/loader';
import AdminTasks from './adminTasks';

const UserDetails = (props) => {
    const admin = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalPurpose, setModalPurpose] = useState('');
    const [upload, setUpload] = useState(null);
    const [verifyingIdentity, setVerifyingIdentity] = useState(false);
    const [verifyingProfession, setVerifyingProfession] = useState(false);
    const [uploads, setUploads] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    const axiosConfig = {
        headers: {
            'authorization': 'bearer ' + admin.token
        }
    }

    useEffect(() => {
        getUser();
    }, [])

    useEffect(() => {
        if (user) {
            getUploads();
            getCertificates();
        }
    }, [user])

    const getUser = async () => {
        try {
            let user = await getUserById(admin.token, props.match.params.iduser);
            setUser(user);
        } catch (error) {
            alert("Cannot get user information: " + error)
        } finally {
            setLoading(false)
        }
    }
 
    const getUploads = () => {
        axios.get(`${URL}/admin/getuploads?iduser=${user.iduser}`, axiosConfig)
            .then((res) => {
                if (res.data.uploads) {
                    setUploads(res.data.uploads);
                } else if (res.data.error) {
                    alert('Failed to get uploads: ' + res.data.error.message);
                }
            })
            .catch(error => {
                alert('Failed to get uploads: Network Error');
            })
    }

    const getCertificates = () => {
        axios.get(`${URL}/admin/getcertificates?iduser=${user.iduser}`, axiosConfig)
            .then((res) => {
                if (res.data.certificates) {
                    setCertificates(res.data.certificates);
                } else if (res.data.error) {
                    alert('Failed to get certificates: ' + res.data.error.message);
                }
            })
            .catch(error => {
                alert('Failed to get certofocates: Network Error');
            })
    }
    
    const deleteCertificate = (idcertificates) => {
        axios.post(`${URL}/admin/deletecertification`, { iduser: user.iduser, idcertificates }, axiosConfig)
            .then((res) => {
                if (res.data.success) {
                    alert('Deletion was sucessful!');
                    getCertificates();
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
        axios.post(`${URL}/admin/verifyidentity`, { idverification: user.idverification, state: user.identity_verified }, axiosConfig)
            .then((res) => {
                if (res.data.success) {
                    alert(res.data.success.message);
                    setVerifyingIdentity(false);
                    getUser();
                } else if (res.data.error) {
                    alert('Update verification failed: ' + res.data.error.message);
                    setVerifyingIdentity(false);
                }
            })
            .catch(error => {
                alert('Update verification failed: Network Error');
                setVerifyingIdentity(false);
            })
    }

    const verifyProfession = () => {
        if (!user.identity_verified) {
            alert("Identity should be verified first")
            return
        }

        setVerifyingProfession(true);
        axios.post(`${URL}/admin/verifyprofession`, { idverification: user.idverification, state: user.profession_verified }, axiosConfig)
            .then((res) => {
                if (res.data.success) {
                    alert(res.data.success.message);
                    getUser();
                } else if (res.data.error) {
                    alert('Updating profession verification failed: ' + res.data.error.message);
                }
            })
            .catch(error => {
                alert('Updating profession verification failed: Network Error');
            })
            .then(() => {
                setVerifyingProfession(false);
            })
    }

    if (loading) {
        return (
            <Loader />
        )
    }

    if (!user) {
        return (
            <div className="text-center my-4 py-4">
                <h3>Oops... Something went wrong!</h3>
            </div>
        )
    }

    return (
        <div>
            <Modal appElement={document.getElementById('modal')} isOpen={modalOpen}>
                {
                    modalPurpose === 'REVIEW_UPLOAD' ?
                        <ReviewUpload setModalOpen={setModalOpen} token={admin.token} upload={upload} getUploads={getUploads} /> :
                        modalPurpose === 'ADD_CERT' ?
                            <AddCertificate setModalOpen={setModalOpen} token={admin.token} getCertificates={getCertificates} user={user} /> :
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
                </div>
            </div>
            <div className="row py-2 mt-4">
                <div className="col-md-6 col-sm-12">
                    <h4>Basic Information</h4>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item text-capitalize">Surname: {user.surname}</li>
                        <li className="list-group-item text-capitalize">Forenames: {user.forenames}</li>
                        <li className="list-group-item">Account Type: {user.account_type}</li>
                        <li className="list-group-item text-capitalize">Profession: { user.profession ? user.profession : 'Not Available'}</li>
                        <li className="list-group-item text-capitalize">Gender: {user.gender}</li>
                        <li className="list-group-item text-capitalize">Age: {user.birthday && new Date(user.birthday).toDateString()}</li>
                        <li className="list-group-item">Email: {user.email}</li>
                        <li className="list-group-item">Phone: {user.phone}</li>
                        <li className="list-group-item">Address: {user.address}</li>
                    </ul>
                </div>
                <div className="col-md-6 col-sm-12">
                    <h4>Uploads</h4>
                    <ul className="list-group list-group-flush">
                        {
                            uploads && uploads.map((item, index) => {
                                return (
                                    <li key={item.iduploads} className="list-group-item">
                                        <button
                                            onClick={() => {
                                                setUpload(item);
                                                setModalPurpose('REVIEW_UPLOAD');
                                                setModalOpen(true);
                                            }}
                                            className="btn btn-info float-right">Review Now</button>
                                        <span className="font-weight-bold">{index + 1} </span>
                                        {item.originalname}<br />
                                        Reviewed: { item.reviewed ? <span className="text-success font-weight-bold">YES</span>: <span className="text-danger font-weight-bold">NO</span>}
                                        { item.reviewed ?
                                            <span>, Accepted: { item.readonly ? <span className="text-success font-weight-bold">YES</span> : <span className="text-danger font-weight-bold">NO</span>} </span> :
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
                            certificates && certificates.map((item) => {
                                return (
                                    <li key={item.idcertificates} className="list-group-item">
                                        <button
                                                onClick={() => deleteCertificate(item.idcertificates) }
                                                className="btn btn-danger float-right">Delete</button>
                                        {item.certification}<br />
                                        Issued by {item.certifying_body} on {moment(item.issue_date).format("Mo MMM YYYY")}<br />
                                        Document: {item.originalname}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>    
            <div className="row py-2 mt-4">
                <div className="col-md-6 col-sm-12">
                    <h4>Actions</h4>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            {
                                verifyingIdentity ?
                                <span className="fas fa-spinner fa-pulse fa-3x text-info float-right"></span>:
                                <span>
                                    {
                                        user.identity_verified ? 
                                            <button
                                                onClick={verifyIdentity}
                                                className="btn btn-danger float-right">Cancel verification</button>
                                            :
                                            <button
                                                onClick={verifyIdentity}
                                                className="btn btn-info float-right">Verify identity</button>
                                    }
                                </span>
                                
                            }
                            
                            { 
                                user.identity_verified ?
                                "If you want to revoke identity verification click this button" :
                                "If you have reviewed and accepted an identity document, click to verify user's identity"
                            }
                        </li>
                        <li className="list-group-item">
                            {
                                verifyingProfession ?
                                <span className="fas fa-spinner fa-pulse fa-3x text-info float-right"></span>:
                                <span>
                                    {
                                        user.profession_verified ?
                                            <button
                                                disabled={false}
                                                onClick={verifyProfession}
                                                className="btn btn-danger float-right">Cancel Profession Verification</button>
                                            :
                                            <button
                                                disabled={!certificates.length}
                                                onClick={verifyProfession}
                                                className="btn btn-info float-right">Verify Profession</button>
                                    }
                                </span>
                               
                            }
                            
                            { 
                                user.profession_verified ?
                                "If you want to revoke profession verification click this button" :
                                "If you have reviewed a Certificate/Licence and added one below then click to verify"
                            }
                        </li>
                        <li className="list-group-item">
                            <button
                                disabled={user.account_type === 'PROFESSIONAL' ? false : true}
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
                <div className="col-md-6 col-sm-12">
                    <h4>Adminstrative tasks</h4>
                    <AdminTasks token={admin.token} iduser={user.iduser} />
                </div>
            </div>
        </div>
    )
}

export default UserDetails;