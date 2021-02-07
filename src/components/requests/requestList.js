import React, { useEffect, useState } from 'react';
import { getUserRequests } from '../../functions/requestsFunctions';
import Loader from '../shared/loader';
import moment from 'moment';

const RequestList = ({admin, getRequest, refresh}) => {
    const [loading, setLoading] = useState(true)
    const [requests, setRequests] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        prev: false,
        next: false
    })
    const [filters, setFilters] = useState({
        new: true,
        pending: true,
        paid: false
    })

    useEffect(() => {
        getRequests(0)
    }, [])

    useEffect(() => {
        getRequests(0)
    }, [refresh])

    const select = (idservice_requests) => {
        getRequest(requests.filter((request) => request.idservice_requests === idservice_requests)[0]);
    }

    const onCheckBoxChange = (e) => {
        let id = e.target.id;
        let value = e.target.checked;
        setFilters(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const getRequests = async (pageMove) => {
        try {
            setLoading(true);
            let rqs = await getUserRequests(admin.token, filters, pagination.page + pageMove, pagination.pageSize);
            //set pagination variables
            setPagination(prev => ({
                page: prev.page + pageMove,
                pageSize: prev.pageSize,
                prev: (prev.page + pageMove) > 1,
                next: rqs.length >= prev.pageSize
            }))
            setRequests(rqs);
        } catch (error) {
            alert("Failed to load requests: " + error)
        } finally {
            setLoading(false);
        }
    }

    const reload = () => {
        setPagination(prev => ({
            ...prev,
            page: 1
        }))

        getRequests(0);
    }

    const nextPage = () => {
        getRequests(1);
    }

    const prevPage = () => {
        getRequests(-1);
    }

    return (
        <div className="my-2">
            <div className="d-flex flex-row justify-content-end">
                <div className="mx-2">
                    <input type="checkbox" id="new" checked={filters.new} onChange={onCheckBoxChange} />
                    <label htmlFor="new">Show New</label>
                </div>
                <div className="mx-2">
                    <input type="checkbox" id="pending" checked={filters.pending} onChange={onCheckBoxChange} />
                    <label htmlFor="pending">Show Pending</label>
                </div>
                <div className="mx-2">
                    <input type="checkbox" id="paid" checked={filters.paid} onChange={onCheckBoxChange} />
                    <label htmlFor="paid">Show Paid</label>
                </div>
                <button onClick={reload} className="btn btn-sm btn-primary mb-2 mx-2">Reload</button>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Date/Time</th>
                        <th scope="col">User</th>
                        <th scope="col">Service</th>
                        <th scope="col">Content</th>
                        <th scope="col">Actioned</th>
                        <th scope="col">Complete</th>
                        <th scope="col">Paid</th>
                        <th scope="col">Declined</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        !loading && requests.map((request) => {
                                return (
                                    <tr key={request.idservice_requests} onClick={() => select(request.idservice_requests)}>
                                        <td>{moment(request.created_at).format("ddd D MMM, HH:mm")}</td>
                                        <td className="text-capitalize">{request.username}</td>
                                        <td>{request.service_type}</td>
                                        <td>{request.service_params}</td>
                                        <td>{request.processed ? "yes" : "no"}</td>
                                        <td>{request.fullfilled ? "yes" : "no"}</td>
                                        <td>{request.paid ? "yes" : "no"}</td>
                                        <td>{request.reject ? "yes" : "no"}</td>
                                    </tr>
                                )
                            })
                    }
                </tbody>
            </table>
            {
                loading ? <Loader /> :
                    <div className="text-center">
                        <button onClick={prevPage} className="btn btn-info" disabled={!pagination.prev}>prev</button>
                        <span className="font-weight-bold mx-3">Page {pagination.page}</span>
                        <button onClick={nextPage} className="btn btn-info" disabled={!pagination.next}>next</button>
                    </div>
            }
        </div>
    )
}

export default RequestList