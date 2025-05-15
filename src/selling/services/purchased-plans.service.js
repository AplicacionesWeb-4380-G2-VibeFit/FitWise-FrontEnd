import axios from 'axios';

const API_URL = 'http://localhost:3000/purchasedPlans';

export const getAllPurchasedPlans = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

export const getPurchasedPlanById = async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
};

export const deletePurchasedPlan = async (id) => {
    return await axios.delete(`${API_URL}/${id}`);
};

export const createPurchasedPlan = async (plan) => {
    return await axios.post(API_URL, plan);
};

export const updatePurchasedPlan = async (id, plan) => {
    return await axios.put(`${API_URL}/${id}`, plan);
};
