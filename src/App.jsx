
import { useState, useEffect } from 'react';

import {
    getUsers,
    createUser,
    updateUser,
    deleteUser
} from './api/userService';

import UserForm from './components/userForm.jsx';
import UserTable from './components/userTable.jsx';

import './App.css';

export default function App() {

    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [searchText, setSearchText] = useState('');

    const [sortField, setSortField] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [showForm, setShowForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // STEP 1: GET USERS
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();

                const mappedUsers = response.data.map(user => {
                    const names = user.name.split(' ');

                    return {
                        id: user.id,
                        firstName: names[0] || '',
                        lastName: names.slice(1).join(' ') || '',
                        email: user.email,
                        department: 'IT'
                    };
                });

                setUsers(mappedUsers);

            } catch (err) {
                setError('Failed to load users. Please check your connection.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // STEP 2: SEARCH USERS
    const filteredUsers = users.filter(user => {
        const query = searchText.toLowerCase();

        return (
            user.firstName.toLowerCase().includes(query) ||
            user.lastName.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
    });

    // STEP 3: SORT USERS
    const sortedUsers = [...filteredUsers].sort((a, b) => {

        const valueA = String(a[sortField] ?? '').toLowerCase();
        const valueB = String(b[sortField] ?? '').toLowerCase();

        const comparison = valueA.localeCompare(valueB, undefined, {
            numeric: true
        });

        return sortOrder === 'asc'
            ? comparison
            : -comparison;
    });

    // STEP 4: PAGINATION
    const totalPages = Math.ceil(sortedUsers.length / pageSize);

    const startIndex = (currentPage - 1) * pageSize;

    const visibleUsers = sortedUsers.slice(
        startIndex,
        startIndex + pageSize
    );

    // STEP 5: HANDLE SORTING
    const handleSort = (field) => {

        if (sortField === field) {
            setSortOrder(prev =>
                prev === 'asc' ? 'desc' : 'asc'
            );
        } else {
            setSortField(field);
            setSortOrder('asc');
        }

        setCurrentPage(1);
    };

    // STEP 6: ADD USER
    const handleAddUser = async (newUser) => {

        try {
            const response = await createUser(newUser);

            const createdUser = {
                ...newUser,
                id: users.length+1
            };

            setUsers(prevUsers => [
                createdUser,
                ...prevUsers
            ]);

            setShowForm(false);
            setError(null);
            setCurrentPage(1);

        } catch (err) {
            setError('Unable to create user. Please try again.');
        }
    };

    // STEP 7: EDIT USER
    const handleEditUser = async (updatedUser) => {

        try {
            await updateUser(selectedUser.id, updatedUser);

            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === selectedUser.id
                        ? { ...user, ...updatedUser }
                        : user
                )
            );

            setShowForm(false);
            setSelectedUser(null);
            setError(null);

        } catch (err) {
            setError('Unable to update user. Please try again.');
        }
    };

    // STEP 8: OPEN EDIT FORM
    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowForm(true);
    };

    // STEP 9: DELETE USER
    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            'Are you sure you want to delete this user?'
        );

        if (!confirmed) return;

        try {
            await deleteUser(id);

            setUsers(prevUsers =>
                prevUsers.filter(user => user.id !== id)
            );

            setError(null);

        } catch (err) {
            setError('Could not complete delete operation.');
        }
    };

    // STEP 10: OPEN ADD FORM
    const handleAddClick = () => {
        setSelectedUser(null);
        setShowForm(true);
    };

    // STEP 11: SAVE FORM
    const handleSave = (formData) => {

        if (selectedUser) {
            handleEditUser(formData);
        } else {
            handleAddUser(formData);
        }
    };

    // STEP 12: HANDLE PAGE SIZE
    const handlePageSize = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    // STEP 13: RESET PAGE WHEN SEARCH CHANGES
    const handleSearch = (e) => {
        setSearchText(e.target.value);
        setCurrentPage(1);
    };

    // Keep current page valid after deletion or filtering.
    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    return (
        <div className="container">

            <h1>Employee Management System</h1>

            {error && (
                <div className="error-alert">
                    {error}
                    <button onClick={() => setError(null)}>
                        ×
                    </button>
                </div>
            )}

            <div className="toolbar">

                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchText}
                    onChange={handleSearch}
                />

                <button onClick={handleAddClick}>
                    + Add User
                </button>

            </div>

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <>
                    <UserTable
                        users={visibleUsers}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                    />

                    <div className="pagination">

                        <div>
                            <label>Records per page: </label>

                            <select
                                value={pageSize}
                                onChange={handlePageSize}
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>

                        <div className="page-buttons">

                            <button
                                disabled={currentPage <= 1}
                                onClick={() =>
                                    setCurrentPage(prev => prev - 1)
                                }
                            >
                                Previous
                            </button>

                            <span>
                                Page {totalPages === 0 ? 0 : currentPage}
                                {' '}of {totalPages}
                            </span>

                            <button
                                disabled={currentPage >= totalPages}
                                onClick={() =>
                                    setCurrentPage(prev => prev + 1)
                                }
                            >
                                Next
                            </button>

                        </div>

                    </div>
                </>
            )}

            {showForm && (
                <UserForm
                    selectedUser={selectedUser}
                    onSave={handleSave}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedUser(null);
                    }}
                />
            )}

        </div>
    );
}


