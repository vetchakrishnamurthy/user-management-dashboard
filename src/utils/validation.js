
export const validateForm = (formData) => {
    const errors = {};

    if (!formData.firstName.trim()) {
        errors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
        errors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
        errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Invalid email format";
    }

    if (!formData.department.trim()) {
        errors.department = "Department is required";
    }

    return errors;
};
