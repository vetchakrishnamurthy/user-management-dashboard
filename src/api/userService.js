
import axios from 'axios';

const API_URL = "https://jsonplaceholder.typicode.com/users";

// GET request
export const getUsers = () => {
    return axios.get(API_URL);
};

// POST request
export const createUser = (user) => {
    return axios.post(API_URL, user);
};

// PUT request
export const updateUser = (id, user) => {
    return axios.put(`${API_URL}/${id}`, user);
};

// DELETE request
export const deleteUser = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};
