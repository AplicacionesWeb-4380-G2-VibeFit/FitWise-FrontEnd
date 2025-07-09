export class HealthPlanMeal {
    constructor({
        id = "",
        healthPlanId = "",
        mealId = "",
        dayOfWeek = "",
        mealTime = "",
        notes = "",
                    mealName = ""
                }){
        this.id = id;
        this.healthPlanId = healthPlanId;
        this.mealId = mealId;
        this.dayOfWeek = dayOfWeek;
        this.mealTime = mealTime;
        this.notes = notes;
        this.mealName = mealName;
    }
}