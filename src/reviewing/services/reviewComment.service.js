import httpInstance from "@/shared/services/http.instance.js";

export class ReviewCommentService {
    resourceEndpoint = import.meta.env.VITE_REVIEW_COMMENTS_ENDPOINT_PATH;

    getAll() {
        return httpInstance.get(this.resourceEndpoint);
    }

    getByReviewId(reviewId) {
        return httpInstance.get(this.resourceEndpoint, {
            params: {
                reviewId
            }
        });
    }

    create(resource) {
        return httpInstance.post(this.resourceEndpoint, resource);
    }

    delete(id) {
        return httpInstance.delete(`${this.resourceEndpoint}/${id}`);
    }
}
