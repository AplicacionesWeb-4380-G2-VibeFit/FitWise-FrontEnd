import httpInstance from "../../shared/services/http.instance.js"

export class CertificateService {
    resourceEndpoint = import.meta.env.VITE_CERTIFICATES_ENDPOINT_PATH;

    getAll() {
        return httpInstance.get(this.resourceEndpoint);
    }

    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}/${id}`);
    }

    getByUserId(userId) {
        return httpInstance.get(this.resourceEndpoint, {
            params: { userId: userId }
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