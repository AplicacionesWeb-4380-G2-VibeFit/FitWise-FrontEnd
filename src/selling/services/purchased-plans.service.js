// src/selling/services/purchased-plans.service.js
import httpInstance from "@/shared/services/http.instance.js";

const resourceEndpoint = import.meta.env.VITE_PURCHASED_PLANS_ENDPOINT_PATH;

/**
 * Obtiene todos los planes comprados
 */
export const getAllPurchasedPlans = () => {
    return httpInstance.get(resourceEndpoint);
};

/**
 * Obtiene un plan comprado por ID
 */
export const getPurchasedPlanById = (id) => {
    return httpInstance.get(`${resourceEndpoint}/${id}`);
};

/**
 * Crea un nuevo plan comprado
 */
export const createPurchasedPlan = (plan) => {
    return httpInstance.post(resourceEndpoint, plan);
};

/**
 * Actualiza un plan comprado por ID
 */
export const updatePurchasedPlan = (id, plan) => {
    return httpInstance.put(`${resourceEndpoint}/${id}`, plan);
};

/**
 * Elimina un plan comprado por ID
 */
export const deletePurchasedPlan = (id) => {
    return httpInstance.delete(`${resourceEndpoint}/${id}`);
};
