import React, { useEffect, useState } from 'react';
import { getServiceProviders } from '../../functions/servicesFunctions';
import Loader from '../shared/loader';

const ServiceProviderList = ({admin, getProvider}) => {
    const [loading, setLoading] = useState(true)
    const [providers, setProviders] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        prev: false,
        next: false
    })
    const [serviceType, setServiceType] = useState("housecall")

    useEffect(() => {
        getProviders(0)
    }, [])

    useEffect(() => {
        reload();
    }, [serviceType])

    const select = (user_iduser) => {
        getProvider(user_iduser);
    }

    const getProviders = async (pageMove) => {
        try {
            setLoading(true);
            let provs = await getServiceProviders(admin.token, serviceType, pagination.page + pageMove, pagination.pageSize);
            //set pagination variables
            setPagination(prev => ({
                page: prev.page + pageMove,
                pageSize: prev.pageSize,
                prev: (prev.page + pageMove) > 1,
                next: provs.length >= prev.pageSize
            }))
            setProviders(provs);
        } catch (error) {
            alert("Failed to load providers: " + error)
        } finally {
            setLoading(false);
        }
    }

    const reload = () => {
        setPagination(prev => ({
            ...prev,
            page: 1
        }))

        getProviders(0);
    }

    const nextPage = () => {
        getProviders(1);
    }

    const prevPage = () => {
        getProviders(-1);
    }

    return (
        <div className="my-2">
            <div className="d-flex flex-row justify-content-between">
                <h4>Currently showing service: {serviceType}</h4>
                <div>
                    <label htmlFor="service_type">Choose a service:</label>
                    <select className="mx-3" id="service_type" onChange={(e) => setServiceType(e.target.value)} value={serviceType} >
                        <option value="housecall">Housecall</option>
                        <option value="telemedicine">Telemedicine</option>
                        <option value="locum">Locum</option>
                    </select>
                </div>
                <button onClick={reload} className="btn btn-sm btn-primary mb-2 mx-2">Reload</button>
            </div>
            {
                loading ? <Loader /> :
                    <table className="table table-striped my-3">
                        <thead>
                            <tr>
                                {
                                    (providers.length > 0) && Object.keys(providers[0]).map((key, i) => {
                                        return (
                                            <th key={i} scope="col">{key}</th>
                                        )
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                providers.map((provider) => {
                                    return (
                                        <tr key={provider.user_iduser} onClick={() => select(provider.user_iduser)}>
                                            {
                                                Object.keys(provider).map((key, i) => {
                                                    return <td key={i}>{provider[key]}</td>
                                                })
                                            }
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
            }
            {
                loading ? <span></span> :
                    <div className="text-center">
                        <button onClick={prevPage} className="btn btn-info" disabled={!pagination.prev}>prev</button>
                        <span className="font-weight-bold mx-3">Page {pagination.page}</span>
                        <button onClick={nextPage} className="btn btn-info" disabled={!pagination.next}>next</button>
                    </div>
            }
        </div>
    )
}

export default ServiceProviderList