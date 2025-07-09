import httpInstance from "../../shared/services/http.instance.js"

export class UserService {
    resourceEndpoint = import.meta.env.VITE_USERS_ENDPOINT_PATH;

    getAll() {
        return httpInstance.get(this.resourceEndpoint);
    }

    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}/${id}`);
    }

    getByEmail(email) {
        return httpInstance.get(this.resourceEndpoint, {
            params: { emailValue: email }
        });
    }

    getByProfileId(profileId) {
        return httpInstance.get(this.resourceEndpoint, {
            params: { profileId: profileId }
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