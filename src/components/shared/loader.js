import React from 'react'

const Loader = () => {
    return(
        <div className="loader-container">
            <div className="loader text-info">
                <i className="fas fa-spinner fa-pulse fa-7x"></i>
                <p className="font-weight-bold text-center">Loading...</p>
            </div>
        </div>
    )
}

export default Loader;