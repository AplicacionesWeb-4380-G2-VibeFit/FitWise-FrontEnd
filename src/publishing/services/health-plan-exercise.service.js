import httpInstance from "@/shared/services/http.instance.js";

export class HealthPlanExerciseService {
    resourceEndpoint = import.meta.env.VITE_HEALTH_PLAN_EXERCISE_ENDPOINT_PATH;

    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}/${id}`);
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