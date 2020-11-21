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
                            <tr key={row._id}>
                                <th scope="row">{ index+1 }</th>
                                <td><span className="text-capitalize">{row.surname}, {row.forenames}</span></td>
                                <td>{row.accountType}</td>
                                <td>
                                    Identity: {row.verification.identityVerified ? <span className="text-success font-weight-bold">YES</span> : <span className="text-danger font-weight-bold">NO</span>}<br />
                                    Profession: {row.accountType === 'PROFESSIONAL' ? (row.verification.professionVerified? <span className="text-success font-weight-bold">YES</span> : <span className="text-danger font-weight-bold">NO</span>) : 'N/A'}
                                </td>
                                <td><button onClick={() => selectUser(row._id)} className="btn btn-info">View Details</button></td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

export default UsersList;