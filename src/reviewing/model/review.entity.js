export class Review {
    constructor({
                    id = "",
                    userId = "",
                    score = 0,
                    description = "",
                    healthPlanId = ""
                }) {
        this.id = id;
        this.userId = userId;
        this.score = score;
        this.description = description;
        this.healthPlanId = healthPlanId;
    }
}
