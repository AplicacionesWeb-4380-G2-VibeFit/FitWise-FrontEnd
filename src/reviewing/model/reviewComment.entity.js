export class ReviewComment {
    constructor({
                    id = "",
                    reviewId = "",
                    userId = "",
                    content = "",
                    createdAt = new Date()
                }) {
        this.id = id;
        this.reviewId = reviewId;
        this.userId = userId;
        this.content = content;
        this.createdAt = createdAt;
    }
}
