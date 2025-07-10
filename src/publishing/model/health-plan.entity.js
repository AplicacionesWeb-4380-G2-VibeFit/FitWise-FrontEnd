export class HealthPlan {
    constructor({
        id = 0,
        planName = "",
        objective = "",
        durationValue = "",
        durationType = "",
        priceValue = 0,
        currency = "USD",
        description = "",
        profileId = ""
                }) {
        this.id = id;
        this.planName = planName;
        this.objective = objective;
        this.durationValue = durationValue;
        this.durationType = durationType;
        this.priceValue = priceValue;
        this.currency = currency;
        this.description = description;
        this.profileId = profileId;
    }
}