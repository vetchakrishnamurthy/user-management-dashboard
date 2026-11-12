
import { useState, useEffect } from 'react';
import { validateForm } from '../utils/validation';

export default function UserForm({
    selectedUser,
    onSave,
    onCancel
}) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        department: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (selectedUser) {
            setFormData({
                firstName: selectedUser.firstName,
                lastName: selectedUser.lastName,
                email: selectedUser.email,
                department: selectedUser.department
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                department: ''
            });
        }

        setErrors({});
    }, [selectedUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validateForm(formData);

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        onSave(formData);
    };

    return (
        <div className="modal">
            <form onSubmit={handleSubmit} className="user-form">

                <h2>
                    {selectedUser ? 'Edit User' : 'Add User'}
                </h2>

                <label>First Name</label>
                <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                />
                {errors.firstName && <p className="error">
                    {errors.firstName}
                </p>}

                <label>Last Name</label>
                <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                />
                {errors.lastName && <p className="error">
                    {errors.lastName}
                </p>}

                <label>Email</label>
                <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && <p className="error">
                    {errors.email}
                </p>}

                <label>Department</label>
                <input
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                />
                {errors.department && <p className="error">
                    {errors.department}
                </p>}

                <div className="form-buttons">
                    <button type="submit">
                        Save
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>

            </form>
        </div>
    );
}
