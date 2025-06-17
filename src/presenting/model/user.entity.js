export class User {
    constructor({
        id = "",
        firstName = "",
        lastName = "",
        email = "",
        birthDate = "",
        gender = "",
        username = "",
        password = "",
                    image= "",
                    aboutMe="",
    }) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.birthDate = birthDate;
        this.gender = gender;
        this.username = username;
        this.password = password;
        this.image = image;
        this.aboutMe = aboutMe;
    }
}