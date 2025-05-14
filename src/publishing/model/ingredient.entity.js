export class Ingredient {
    constructor({
        id = "",
        mealId = "",
        name = "",
        description = ""
                }) {
        this.id = id;
        this.mealId = mealId;
        this.name = name;
        this.description = description;
    }
}