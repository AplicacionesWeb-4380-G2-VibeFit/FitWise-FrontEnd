export class Exercise {
    constructor({
        id = "",
        healthPlanId = "",
        name = "",
        description = "",
        image = ""
                }) {
        this.id = id;
        this.healthPlanId = healthPlanId;
        this.name = name;
        this.description = description;
        this.image = image;
    }
}