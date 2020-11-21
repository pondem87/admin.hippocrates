import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import { URL } from '../../variables';
import UsersList from './usersList';
import UserDetails from './userDetails';

const Users = () => {
    const {user, token} = useContext(UserContext);
    const [usersList, setUsersList] = useState([]);
    const [pages, setPages] = useState({ init: false, page: 1, limit: 20, prev: false, next: false})
    const [selectedUser, setSelectedUser] = useState(null);
    const [search, setSearch] = useState('');
    const [checkbox, setCheckbox] = useState({ unverified: true, professional: false});
    const [submitValue, setSubmitValue] = useState('Show all');
    const [searching, setSearching] = useState(false);

    const handleChange = (e) => {
        let id = e.target.id;
        let checked = e.target.checked;
        setCheckbox((prevState) => ({
            ...prevState,
            [id]: checked
        }))
    }

    const handleSearchChange = (e) => {
        let value = e.target.value;
        setSearch(value);
        if (value !== '') setSubmitValue('Search');
        else setSubmitValue('Show All')
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchUsers(1, pages.limit, checkbox.professional, checkbox.unverified, search);
    }

    const fetchUsers = (page, limit, professional, unverified, search) => {
        setSearching(true);
        let queryString = '?' + 'page=' + page + '&limit=' + limit + '&professional=' + professional + '&unverified=' + unverified;
        if (search !== '') queryString += `&search=${search}`;

        console.log('Query String: ', queryString);

        const config = {
            headers: {
                'authorization': 'bearer ' + token
            }
        }

        axios.get(`${URL}/admin/fetchusers${queryString}`, config)
            .then(res => {
                setUsersList(res.data);
                setPages((prev) => ({
                    ...prev,
                    page,
                    next: !(res.data.length < limit),
                    prev: page > 1,
                    init: true
                }))
                setSearching(false);
            })
            .catch(error => {
                console.log(error);
                setSearching(false);
            })
    }

    const nextPage = () => {
        fetchUsers(pages.page + 1, pages.limit, checkbox.professional, checkbox.unverified, search);
    }

    const prevPage = () => {
        fetchUsers(pages.page - 1, pages.limit, checkbox.professional, checkbox.unverified, search);
    }

    const selectUser = (userId) => {
        console.log('selected user id: ', userId);

        let queryString = '?id=' + userId;

        const config = {
            headers: {
                'authorization': 'bearer ' + token
            }
        }

        axios.get(`${URL}/admin/fetchuser${queryString}`, config)
            .then(res => {
                if (!res.data.error) {
                    setSelectedUser({...res.data})
                } else {
                    console.log(res.data.error)
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    const deselectUser = () => {
        setSelectedUser(null);
    }

    return (
        selectedUser ? <UserDetails token={token} user={selectedUser} selectUser={selectUser} deselectUser={deselectUser} /> :
        <div>
            <div className="row">
                <div className="col-12 py-3 my-1 text-center text-muted">
                    <h2>Manage User Accounts</h2>
                    <h5>Current User: <span className="text-capitalize">{user.surname}, {user.forenames}</span></h5>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8 col-sm-10">
                    <h4>Choose which users to display</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="search">Search Phrase</label>
                            <input className="form-control" type='text' id='search' onChange={handleSearchChange} value={search} />
                        </div>
                        <div className="form-group form-check">
                            <input type="checkbox" className="form-check-input" id="unverified" onChange={handleChange} checked={checkbox.unverified} />
                            <label className="form-check-label" htmlFor="unverified">Show unverified only</label>
                        </div>
                        <div className="form-group form-check">
                            <input type="checkbox" className="form-check-input" id="professional" onChange={handleChange} checked={checkbox.professional} />
                            <label className="form-check-label" htmlFor="professional">Show professionals only</label>
                        </div>
                        <div className="text-center">
                            {
                                searching ?
                                <span className="fas fa-spinner fa-pulse fa-3x text-info"></span> :
                                <input type='submit' className="btn btn-primary" value={submitValue} />
                            }
                        </div>
                    </form>
                </div>
            </div>    
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-12 col-sm-12 my-3">
                    <UsersList rows={usersList} selectUser={selectUser} />
                    {
                        pages.init? 
                        <div className="text-center">
                            <button onClick={prevPage} className="btn btn-info" disabled={!pages.prev}>prev</button>
                            <span className="font-weight-bold mx-3">Page {pages.page}</span>
                            <button onClick={nextPage} className="btn btn-info" disabled={!pages.next}>next</button>
                        </div>
                        : <span></span>
                    }
                </div>
            </div>
        </div>
    )
}

export default Users;