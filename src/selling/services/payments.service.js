<<<<<<< Updated upstream
// src/selling/services/payments.service.js
import httpInstance from "@/shared/services/http.instance.js";

const resourceEndpoint = import.meta.env.VITE_PAYMENTS_ENDPOINT_PATH;

/**
 * Crea un nuevo pago
 */
export const createPayment = (payment) => {
    return httpInstance.post(resourceEndpoint, payment);
};

/**
 * Parchea (PATCH) un pago existente
 */
export const patchPayment = (id, data) => {
    return httpInstance.patch(`${resourceEndpoint}/${id}`, data);
};

/**
 * Obtiene los pagos pendientes de un usuario
 */
export const getPendingByUser = (userId) => {
    return httpInstance.get(resourceEndpoint, {
        params: {
            ownerId: userId,
            status:  "pending"
        }
    });
};

/**
 * Elimina un pago por ID
 */
export const deletePayment = (id) => {
    return httpInstance.delete(`${resourceEndpoint}/${id}`);
=======
import axios from 'axios';

const API = 'http://localhost:5144/api/v1/payments';

export const createPayment = (p) => axios.post(API, p);

export const patchPayment = (id, data) => axios.patch(`${API}/${id}`, data);

export const deletePayment = async (id) => {
    return await axios.delete(`${API}/${id}`);
>>>>>>> Stashed changes
};
