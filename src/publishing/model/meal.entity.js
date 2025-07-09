export class Meal {
    constructor({
        id = "",
        name = "",
        description = "",
        imageUri = ""
                }){
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUri = imageUri;
    }
}