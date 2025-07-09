/**
 * Sign up request model
 * @summary
 * Represents a sign-up request. This is used to register a user.
 */
export class SignUpRequest {
    /**
     * Constructor
     * @param {string} username The username of the user.
     * @param {string} password The password of the user.
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} email
     * @param {string} birthDate
     * @param {string} gender
     * @param {string} image
     * @param {string} aboutMe
     */
    constructor(username, password, firstName, lastName, email, birthDate, gender, image, aboutMe) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.birthDate = birthDate;
        this.gender = gender;
        this.image = image;
        this.aboutMe = aboutMe;
    }
}