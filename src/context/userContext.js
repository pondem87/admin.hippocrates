import React, { createContext, useState } from 'react';

export const UserContext = createContext();

const UserContextProvider = (props) => {
    const [state, setState] = useState({
        token: null,
        signedIn: false,
    });

    const login = (data) => {
        localStorage.setItem('jwt', data.token);
        setState({
            ...data,
            signedIn: true
        })
    }

    const logout = () => {
        localStorage.removeItem('jwt');
        setState({
            token: null,
            signedIn: false,
        })
    }

    return (
        <UserContext.Provider value={{...state, login, logout}}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;