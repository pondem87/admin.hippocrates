import React from 'react'
import { Redirect } from 'react-router-dom'
import { UserContext } from '../../context/userContext';

class ProtectedRoute extends React.Component {
    static contextType = UserContext;
    render() {
        const { component, computedMatch, location, path } = this.props;
        const Component = component;
        const isAuthenticated = this.context.signedIn;

        let passedOnProps = {
            match: computedMatch,
            location,
            path
        }
       
        return isAuthenticated ? <Component { ...passedOnProps } /> : <Redirect to='/signin' />;
    }
}

export default ProtectedRoute;