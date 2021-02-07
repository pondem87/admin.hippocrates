import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const MainNav = ({logout}) => {


        return (
            <nav className="navbar navbar-expand-lg navbar-dark header">
                <Link className="navbar-brand" to="/">Hippocrates Health Alliance Admin Panel</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="fas fa-bars"></span>
                </button>

                <div className="collapse navbar-collapse" id="ftco-nav">
                    <ul className="navbar-nav">
                        <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
                        <li className="nav-item"><Link to="/users" className="nav-link">Users</Link></li>
                        <li className="nav-item"><Link to="/requests" className="nav-link">Requests</Link></li>
                        <li className="nav-item"><Link to="/services" className="nav-link">Services</Link></li>
                    </ul>
                </div>

                <form className="form-inline">
                    <button onClick={() => logout()} className="btn btn-sm btn-outline-light" type="button">Logout</button>
                </form>
            </nav>
        )
}

export default MainNav;