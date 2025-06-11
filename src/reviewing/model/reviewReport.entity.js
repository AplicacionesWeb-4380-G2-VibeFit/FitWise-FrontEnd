export class ReviewReport {
    constructor({
                    id = "",
                    reviewId = "",
                    userId = "",
                    reason = "",
                    status = "pending", // Estados posibles: pending, reviewed, dismissed
                    createdAt = new Date()
                }) {
        this.id = id;
        this.reviewId = reviewId;
        this.userId = userId;
        this.reason = reason;
        this.status = status;
        this.createdAt = createdAt;
    }
}
