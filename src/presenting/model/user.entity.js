export class User {
    constructor({
        id = 0,
        firstName = "",
        lastName = "",
        email = "",
        birthDate = "",
        gender = "",
                    image= "",
                    aboutMe="",
        profileId = 0,
    }) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.birthDate = birthDate;
        this.gender = gender;
        this.image = image;
        this.aboutMe = aboutMe;
        this.profileId = profileId;
    }
}