import httpInstance from "@/shared/services/http.instance.js";

export class ScheduleService {
    resourceEndpoint = import.meta.env.VITE_SCHEDULES_ENDPOINT_PATH;

    getAll() {
        return httpInstance.get(this.resourceEndpoint);
    }

    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}/${id}`);
    }

    getByUserId(userId) {
        return httpInstance.get(this.resourceEndpoint, {
            params: {
                userId: userId
            }
        });
    }
    getByHealthPlanId(healthPlanId) {
        return httpInstance.get(this.resourceEndpoint, {
            params: {
                userId: healthPlanId
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