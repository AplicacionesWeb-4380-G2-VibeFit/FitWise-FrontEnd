import httpInstance from "../../shared/services/http.instance.js"

export class FollowedUserService {
    resourceEndpoint = import.meta.env.VITE_FOLLOWED_USERS_ENDPOINT_PATH;

    getAll() {
        return httpInstance.get(this.resourceEndpoint);
    }

    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}/${id}`);
    }

    getByFollowerId(followerId) {
        return httpInstance.get(`${this.resourceEndpoint}?followerId=${followerId}`);
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