import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/userContext';
import { assignRequestToProvider, declineARequest, getRequestAssignments, setRequestCompleted } from '../../functions/requestsFunctions';
import RequestList from './requestList';

const Requests = () => {
    const admin = useContext(UserContext);
    const [request, setRequest] = useState(null);
    const [providerUserId, setProviderUserId] = useState('');
    const [declineComment, setDeclineComment] = useState('');
    const [disable, setDisable] = useState(false);
    const [refresh, setRefresh] = useState(true);
    const [assignments, setAssignments] = useState(null);

    const getRequest = (request) => {
        setRequest(request);
    }

    //trigger clearing of request throught changing refresh value
    useEffect(() => {
        setRequest(null);
    }, [refresh])

    //when selected request changes also clear assignments list
    useEffect(() => {
        setAssignments(null)
    }, [request])

    const assignProvider = async (e) => {
        e.preventDefault()

        if (providerUserId.length === 0) {
            alert("Enter Health Professional ID")
            return
        }

        let provider_iduser = parseInt(providerUserId, 10);

        if (!Number.isInteger(provider_iduser)) {
            alert("Health Professional ID must be a number (integer)")
            return
        }

        try {
            setDisable(true)
            let msg = await assignRequestToProvider(admin.token, {provider_iduser, idservice_requests: request.idservice_requests})
            alert("Success: " + msg);
            //trigger useEffect by changing refresh
            setRefresh(!refresh);
        } catch (error) {
            alert("Failed to assign: " + error)
        } finally {
            setProviderUserId('')
            setDisable(false)
        }
    }

    const declineRequest = async (e) => {
        e.preventDefault()

        try {
            setDisable(true)
            let msg = await declineARequest(admin.token, {comment: declineComment, idservice_requests: request.idservice_requests})
            alert("Success: " + msg);
            //trigger useEffect by changing refresh
            setRefresh(!refresh);
        } catch (error) {
            alert("Failed to decline: " + error)
        } finally {
            setDeclineComment('')
            setDisable(false)
        }
    }

    const requestComplete = async () => {
        try {
            setDisable(true)
            await setRequestCompleted(admin.token, request.idservice_requests);
            alert("Successful update")
            //trigger useEffect by changing refresh
            setRefresh(!refresh);
        } catch (error) {
            alert("Cannot complete action: " + error)
        } finally {
            setDisable(false);
        }
    }

    const checkAssignments = async () => {
        try {
            setDisable(true)
            let as = await getRequestAssignments(admin.token, request.idservice_requests);
            setAssignments(as);
        } catch (error) {
            alert("Cannot get assignments: " + error)
        } finally {
            setDisable(false);
        }
    }

    return (
        <div>
            <div className="row">
                <div className="col-12 py-3 my-1 text-center text-muted">
                    <h2>Manage client service requests.</h2>
                </div>
            </div>
            <div className="row py-2 mt-4">
                <div className="col-md-6 col-sm-12">
                    <h3>Selected Request</h3>
                    {
                        request ?
                            <div>
                                <ul className="">
                                    {
                                        Object.keys(request).map((key, i) => {
                                            return (
                                                <li key={i} className="">{key}: {request[key]}</li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                            : <p>No request selected. Please click on one request from the list below to work on a request</p>
                    }
                </div>
                <div className="col-md-6 col-sm-12">
                    <h3>Actions</h3>
                    {
                        request ?
                            <div>
                                <div>
                                    {
                                        request.fullfilled ? <p>Request has been attended to.</p> :
                                            <div>                                                
                                                <form onSubmit={assignProvider}>
                                                    <div className="d-flex flex-row justify-content-between border border-primary rounded p-2">
                                                        <label htmlFor="provider_user_id">Health Professional's user_id:</label>
                                                        <input type="text" id="provider_user_id" value={providerUserId} onChange={(e) => setProviderUserId(e.target.value)} />
                                                        <button disabled={disable} className="btn btn-primary">Assign</button>
                                                    </div>
                                                </form>
                                                <div className="border border-primary rounded p-2 mt-1">
                                                    <form onSubmit={declineRequest}>
                                                        <div className="form-group">
                                                            <label htmlFor="comments">Comments:</label>
                                                            <textarea className="form-control" id='comments' onChange={(e) => setDeclineComment(e.target.value)} value={declineComment} required />
                                                        </div>
                                                        <button disabled={disable} className="btn btn-danger float-right">Decline</button>
                                                        <p>If request cannot be fullfilled.</p>
                                                    </form>
                                                </div>
                                                <div className="border border-primary rounded p-2 mt-1">
                                                    <button disabled={disable} className="btn btn-primary float-right" onClick={requestComplete}>Completed</button>
                                                    <p>If client's request has been fulfilled.</p>
                                                </div>
                                            </div>
                                    }
                                    
                                    <div className="border border-primary rounded p-2 mt-1">
                                        <button onClick={checkAssignments} disabled={disable} className="btn btn-primary float-right">Check</button>
                                        <p>Check previous assignments</p>
                                        <div className="list-group">
                                            {
                                                assignments && assignments.map((assign) => 
                                                    <div key={assign.idassignment} className="list-group-item list-group-item-action">
                                                        <div className="d-flex w-100 justify-content-between">
                                                            <h5 className="mb-1 text-capitalize">{assign.name}</h5>
                                                            <small className="text-muted">
                                                                {
                                                                    assign.reassigned ? "Reassigned" : "Current"
                                                                }
                                                            </small>
                                                        </div>
                                                        <p className="mb-1">{assign.profession} : {assign.phone}</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : <p>No request selected. Please click on one request from the list below to work on a request</p>
                    }
                </div>
            </div>
            <div className="row py-2 mt-4">
                <div className="col-12">
                    <RequestList admin={admin} getRequest={getRequest} refresh={refresh} />
                </div>
            </div>
        </div>
    )
}

export default Requests;