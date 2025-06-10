import httpInstance from "@/shared/services/http.instance.js";

export class ReviewReportService {
    resourceEndpoint = import.meta.env.VITE_REVIEW_REPORTS_ENDPOINT_PATH;

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

    updateStatus(id, newStatus) {
        return httpInstance.patch(`${this.resourceEndpoint}/${id}/status`, {
            status: newStatus
        });
    }

    delete(id) {
        return httpInstance.delete(`${this.resourceEndpoint}/${id}`);
    }
}
