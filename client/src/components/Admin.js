import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css'; 

const AdminPanel = () => {
    const [userList, setUserList] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const retrieveUsers = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/users');
                if (!res.ok) {
                    throw new Error('Error retrieving users');
                }
                const data = await res.json();
                setUserList(data);
            } catch (err) {
                setErrorMessage(err.message);
            }
        };

        retrieveUsers();
    }, []);

    const visibleUsers = query
        ? userList.filter((user) =>
              user.username.toLowerCase().includes(query.toLowerCase()) ||
              user.email.toLowerCase().includes(query.toLowerCase())
          )
        : userList;

    const removeUser = async (userId) => {
        const confirmAction = window.confirm('Confirm user removal?');
        if (confirmAction) {
            try {
                const res = await fetch(`http://localhost:3001/api/users/${userId}`, { method: 'DELETE' });
                if (!res.ok) {
                    throw new Error('User removal failed');
                }
                setUserList(userList.filter((user) => user.user_id !== userId));
            } catch (err) {
                setErrorMessage(err.message);
            }
        }
    };

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="admin-container">
            <h1 className="admin-header">Administrator Dashboard</h1>
            <div className="user-search-area">
                <input
                    type="text"
                    placeholder="Find users..."
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            <div className="user-count">
                <span>User Total: {visibleUsers.length}</span>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {visibleUsers.map((user) => (
                        <tr key={user.user_id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <button
                                    onClick={() => removeUser(user.user_id)}
                                    className="btn-remove"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                onClick={goBack}
                className="btn-close"
            >
                Back
            </button>
        </div>
    );
};

export default AdminPanel;
