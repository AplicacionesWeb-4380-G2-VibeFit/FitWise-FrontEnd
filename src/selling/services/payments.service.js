import axios from 'axios';
const API = 'http://localhost:3000/payments';

export const createPayment = (p) => axios.post(API, p);                // nuevo
export const patchPayment  = (id, data) => axios.patch(`${API}/${id}`, data);
export const getPendingByUser = async (userId) => {
    const res = await axios.get(`http://localhost:3000/payments`)
    return res.data.filter(p => p.ownerId == userId && p.status === 'pending')
}
export const deletePayment = async (id) => {
    return await axios.delete(`${API}/${id}`);
};