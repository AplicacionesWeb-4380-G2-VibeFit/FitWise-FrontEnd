export class Profile {
    constructor(
        {
            id = '',
            name = '',
            lastname = '',
            gender = '',
            userId = '',
            image = '',
            isPremium = false,
            membershipExpiry = ''
        }
    ) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.gender = gender;
        this.userId = userId;
        this.image = image;
        this.isPremium = isPremium;
        this.membershipExpiry = membershipExpiry;
    }
}