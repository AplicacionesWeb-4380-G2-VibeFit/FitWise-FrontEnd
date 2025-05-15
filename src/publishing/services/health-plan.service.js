import httpInstance from "@/shared/services/http.instance.js";

export class HealthPlanService {
    resourceEndpoint = import.meta.env.VITE_HEALTH_PLAN_ENDPOINT_PATH;

    getAll() {
        return httpInstance.get(this.resourceEndpoint);
    }

    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}/${id}`);
    }

    getByCreatorId(creatorId) {
        return httpInstance.get(this.resourceEndpoint, {
            params: {
                creadorId: creatorId
            }
        });
    }

    create(resource) {
        return httpInstance.post(this.resourceEndpoint, resource);
    }

    update(id, resource) {
        return httpInstance.put(`${this.resourceEndpoint}/${id}`, resource);
    }

    delete(id) {
        return httpInstance.delete(`${this.resourceEndpoint}/${id}`);
    }
}