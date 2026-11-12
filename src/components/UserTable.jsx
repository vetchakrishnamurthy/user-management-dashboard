
export default function UserTable({
    users,
    onEdit,
    onDelete,
    sortField,
    sortOrder,
    onSort
}) {
    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th onClick={() => onSort('id')}>
                            ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>

                        <th onClick={() => onSort('firstName')}>
                            First Name {sortField === 'firstName' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>

                        <th onClick={() => onSort('lastName')}>
                            Last Name {sortField === 'lastName' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>

                        <th onClick={() => onSort('email')}>
                            Email {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>

                        <th onClick={() => onSort('department')}>
                            Department {sortField === 'department' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>

                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.length > 0 ? (
                        users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.department}</td>

                                <td>
                                    <button onClick={() => onEdit(user)}>
                                        Edit
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() => onDelete(user.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
