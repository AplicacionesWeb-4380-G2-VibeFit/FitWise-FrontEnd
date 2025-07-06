// src/selling/services/purchase-history.service.js
import httpInstance from "@/shared/services/http.instance.js";

<<<<<<< Updated upstream
const resourceEndpoint = import.meta.env.VITE_PURCHASE_HISTORY_ENDPOINT_PATH;

/**
 * Obtiene TODO el recurso de purchaseHistory (lista plana de usuarios con pagos)
 */
export const getAllPurchaseHistory = () => {
    return httpInstance.get(resourceEndpoint);
};

/**
 * Obtiene el historial de pagos de un usuario
 */
export const getPurchaseHistoryByUserId = (userId) => {
    return httpInstance.get(`${resourceEndpoint}/${userId}`);
};

/**
 * Añade un pago al historial de un usuario.
 */
export const addPaymentToHistory = async (userId, newPayment) => {
    try {
        const { data } = await httpInstance.get(`${resourceEndpoint}/${userId}`);
        const payments = Array.isArray(data.payments) ? data.payments : [];
        payments.push(newPayment);
        return await httpInstance.patch(`${resourceEndpoint}/${userId}`, {
            payments
        });
    } catch (err) {
        if (err.response?.status === 404) {
            return await httpInstance.post(resourceEndpoint, {
                id:       userId,
                payments: [newPayment]
=======
const API_URL = 'http://localhost:5144/api/v1/purchase-history';
const PLANS_URL = 'http://localhost:5144/api/v1/purchased-plans';

export const addPaymentToHistory = async (userId, paymentId) => {
    try {
        // POST: crea nuevo historial
        await axios.post(API_URL, {
            userId: String(userId) // ✅ así lo espera el backend
        });

        // PATCH: añade el payment
        return await axios.patch(`${API_URL}/${userId}`, {
            paymentId
        });
    } catch (err) {
        if (err.response && (err.response.status === 400 || err.response.status === 409)) {
            // ya existe, solo hace patch
            return await axios.patch(`${API_URL}/${userId}`, {
                paymentId
>>>>>>> Stashed changes
            });
        }
        throw err;
    }
};


export const getAllPurchaseHistory = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};



export const addPaymentToHistoryNow = async (userId, payment) => {
    try {
        // Asegura que solo mandas el userId como string
        await axios.post(API_URL, { userId })

        // Agrega el ID del pago
        return await axios.patch(`${API_URL}/${userId}`, {
            paymentId: payment.id
        })
    } catch (err) {
        if (err.response?.status === 400) {
            return await axios.patch(`${API_URL}/${userId}`, {
                paymentId: payment.id
            })
        } else {
            throw err
        }
    }
}


