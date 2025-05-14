import httpInstance from "@/shared/services/http.instance.js";

export class ExerciseService {
    resourceEndpoint = import.meta.env.VITE_EXERCISES_ENDPOINT_PATH;

    getAll() {
        return httpInstance.get(this.resourceEndpoint);
    }

    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}/${id}`);
    }

    getByHealthPlanId(healthPlanId) {
        return httpInstance.get(this.resourceEndpoint, {
            params: {
                healthPlanId: healthPlanId
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