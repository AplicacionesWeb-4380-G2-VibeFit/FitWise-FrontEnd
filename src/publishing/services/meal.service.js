import httpInstance from "@/shared/services/http.instance.js";

export class MealService {
    resourceEndpoint = import.meta.env.VITE_MEALS_ENDPOINT_PATH;
    getAll() {
        return httpInstance.get(this.resourceEndpoint);
    }

    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}/${id}`);
    }

    create(resource) {
        return httpInstance.post(this.resourceEndpoint, resource);
    }

    update(id, resource) {
        return httpInstance.put(`${this.resourceEndpoint}/${id}`, resource);
    }
}