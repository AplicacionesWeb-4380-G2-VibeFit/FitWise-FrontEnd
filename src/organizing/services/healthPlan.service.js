// src/organizing/services/health-plan.service.js

import httpInstance from "../../../../../../../aux folder/FitWise-FrontEnd-develop/FitWise-FrontEnd-develop/src/shared/services/http.instance.js";

export class HealthPlanService {
    resourceEndpoint = import.meta.env.VITE_HEALTH_PLAN_ENDPOINT_PATH;

    getAll() {
        return httpInstance.get(this.resourceEndpoint);
    }

    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}/${id}`);
    }
}
    