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
export const addPaymentToHistory = async (userId, paymentId) => {
    try {
        // POST: crea nuevo historial
        await httpInstance.post(resourceEndpoint, {
            userId: String(userId) // ✅ así lo espera el backend
        });

        // PATCH: añade el payment
        return await httpInstance.patch(`${resourceEndpoint}/${userId}`, {
            paymentId
        });
    } catch (err) {
        if (err.response && (err.response.status === 400 || err.response.status === 409)) {
            // ya existe, solo hace patch
            return await httpInstance.patch(`${resourceEndpoint}/${userId}`, {
                paymentId
            });
        } else {
            throw err;
        }
    }
};


/**
 * Versión alternativa para añadir un pago en tiempo real
 */
export const addPaymentToHistoryNow = async (userId, payment) => {
    try {
        // Asegura que solo mandas el userId como string
        await httpInstance.post(resourceEndpoint, { userId })

        // Agrega el ID del pago
        return await httpInstance.patch(`${resourceEndpoint}/${userId}`, {
            paymentId: payment.id
        })
    } catch (err) {
        if (err.response?.status === 400) {
            return await httpInstance.patch(`${resourceEndpoint}/${userId}`, {
                paymentId: payment.id
            })
        } else {
            throw err
        }
    }
}
