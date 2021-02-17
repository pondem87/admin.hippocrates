import React, {useContext, useEffect, useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import {UserContext} from '../../context/userContext';
import { fetchAllUploads } from '../../functions/uploadsFunctions';
import Loader from '../shared/loader';
import moment from 'moment'

const Uploads = () => {
    const admin = useContext(UserContext);
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        prev: false,
        next: false
    })
    const [filters, setFilters] = useState({
        unreviewed: true
    })

    const history = useHistory();

    useEffect(() => {
        fetchUploads(0)
    },[])

    useEffect(() => {
        fetchUploads(0)
    }, [filters])

    const fetchUploads = async (pageMove) => {
        try {
            setLoading(true);
            let rqs = await fetchAllUploads(admin.token, filters, pagination.page + pageMove, pagination.pageSize);
            //set pagination variables
            setPagination(prev => ({
                page: prev.page + pageMove,
                pageSize: prev.pageSize,
                prev: (prev.page + pageMove) > 1,
                next: rqs.length >= prev.pageSize
            }))
            setUploads(rqs);
        } catch (error) {
            alert("Failed to load uploads: " + error)
        } finally {
            setLoading(false);
        }
    }

    const nextPage = () => {
        fetchUploads(1);
    }

    const prevPage = () => {
        fetchUploads(-1);
    }

    const handleChange = (e) => {
        let id = e.target.id;
        let val = e.target.checked;
        setFilters(prev => ({
            [id]: val
        }))
    }

    return (
        <div>
            <div className="row">
                <div className="col-12 py-3 my-1 text-center text-muted">
                    <h2>View uploaded files</h2>
                    <h5>Current User: <span className="text-capitalize">{admin.surname}, {admin.forenames}</span></h5>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-lg-10 col-md-12 col-sm-12">
                    {
                        loading ?
                            <Loader />
                            :
                            <div>
                                <div className="form-group form-check">
                                    <input type="checkbox" className="form-check-input" id="unreviewed" onChange={handleChange} checked={filters.unreviewed} />
                                    <label className="form-check-label" htmlFor="unreviewed">Show files not reviewed only</label>
                                </div>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Date</th>
                                            <th scope="col">Filename</th>
                                            <th scope="col">Reviewed</th>
                                            <th scope="col">Accepted</th>
                                            <th scope="col">Owner</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            uploads && uploads.map((upload) => {
                                                return (
                                                    <tr key={upload.idupload}>
                                                        <td>{moment(upload.upload_time).format("D MMM, HH:mm")}</td>
                                                        <td>{upload.originalname}</td>
                                                        <td>{upload.reviewed ? "yes" : "no"}</td>
                                                        <td>{upload.readonly ? "yes" : "no"}</td>
                                                        <td className="text-capitalize">{upload.owner}</td>
                                                        <td><Link to={`/userdetails/${upload.user_iduser}`} target={'_blank'}>Edit</Link></td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                <div className="text-center">
                                    <button onClick={prevPage} className="btn btn-info" disabled={!pagination.prev}>prev</button>
                                    <span className="font-weight-bold mx-3">Page {pagination.page}</span>
                                    <button onClick={nextPage} className="btn btn-info" disabled={!pagination.next}>next</button>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Uploads;
