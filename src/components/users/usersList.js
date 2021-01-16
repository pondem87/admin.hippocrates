import React from 'react';

const UsersList = ({rows, selectUser}) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Account Type</th>
                    <th scope="col">Verification</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    rows && rows.map((row, index) => {
                        return (
                            <tr key={row.iduser}>
                                <th scope="row">{ index+1 }</th>
                                <td><span className="text-capitalize">{row.surname}, {row.forenames}</span></td>
                                <td>{row.account_type}</td>
                                <td>
                                    Identity: {row.identity_verified ? <span className="text-success font-weight-bold">YES</span> : <span className="text-danger font-weight-bold">NO</span>}<br />
                                    Profession: {row.account_type === 'PROFESSIONAL' ? (row.profession_verified? <span className="text-success font-weight-bold">YES</span> : <span className="text-danger font-weight-bold">NO</span>) : 'N/A'}
                                </td>
                                <td><button onClick={() => selectUser(row.iduser)} className="btn btn-info">View Details</button></td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

export default UsersList;