export class Schedule {
    constructor({
                    id = "",
                    userId = "",
                    healthPlanId = "",
                    date = ""
                }) {
        this.id = id;
        this.userId = userId;
        this.healthPlanId = healthPlanId;
        this.date = date;
    }
}
