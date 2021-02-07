import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/userContext';
import ServiceProviderList from './serviceProviderList';

const Services = () => {
    const admin = useContext(UserContext);
    const [provider, setProvider] = useState(null);

    const getProvider = (id) => {
        
    }

    return (
        <div>
            <div className="row">
                <div className="col-12 py-3 my-1 text-center text-muted">
                    <h2>Registered Service Providers</h2>
                </div>
            </div>
            <div className="row py-2 mt-4">
                <div className="col-12">
                    <ServiceProviderList admin={admin} getProvider={getProvider} />
                </div>
            </div>
        </div>
    )
}

export default Services;