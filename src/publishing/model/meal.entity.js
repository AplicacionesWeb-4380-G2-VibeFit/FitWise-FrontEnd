export class Meal {
    constructor({
        id = "",
        healthPlanId = "",
        image = ""
                }) {
        this.id = id;
        this.healthPlanId = healthPlanId;
        this.image = image;
    }
}