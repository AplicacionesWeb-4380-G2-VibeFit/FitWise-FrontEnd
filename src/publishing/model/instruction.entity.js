export class Instruction {
    constructor({
        id = "",
        mealId = "",
        position = "",
        description = ""
                }) {
        this.id = id;
        this.mealId = mealId;
        this.position = position;
        this.description = description;
    }
}