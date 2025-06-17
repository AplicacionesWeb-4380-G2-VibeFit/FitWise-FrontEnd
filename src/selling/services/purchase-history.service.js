import axios from 'axios';

const API_URL = 'http://localhost:3000/purchaseHistory';

export const getPurchaseHistoryByUserId = async (userId) => {
    try {
        const res = await axios.get(`${API_URL}/${userId}`);
        return res.data;
    } catch (err) {
        if (err.response && err.response.status === 404) {
            // Si no existe, devolver uno vacío (no lanzar error)
            return { id: userId, payments: [] };
        } else {
            throw err;
        }
    }
};

export const addPaymentToHistory = async (userId, newPayment) => {
    try {
        const res = await axios.get(`${API_URL}/${userId}`);
        const existingPayments = res.data.payments || [];

        const updatedPayments = [...existingPayments, newPayment];

        return await axios.patch(`${API_URL}/${userId}`, {
            payments: updatedPayments
        });
    } catch (err) {
        if (err.response && err.response.status === 404) {
            // ✅ Crear nuevo historial si no existe
            return await axios.post(API_URL, {
                id: userId,
                payments: [newPayment]
            });
        } else {
            throw err;
        }
    }
};
