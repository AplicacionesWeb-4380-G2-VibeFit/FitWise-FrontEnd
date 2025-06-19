// src/selling/services/purchase-history.service.js
import httpInstance from "@/shared/services/http.instance.js";

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
            });
        }
        throw err;
    }
};
