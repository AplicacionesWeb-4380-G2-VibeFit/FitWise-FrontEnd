export class FollowedUser {
    constructor(
        {
            id = '',
            followerId = '',
            followedId = '',
        }
    ) {
        this.id = id;
        this.followerId = followerId;
        this.followedId = followedId;
    }
}