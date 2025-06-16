export class Follower {
    constructor({
                    id = "",
                    followerUserId = "",
                    followingUserId = ""
    }) {
        this.id = id;
        this.followerUserId = followerUserId;
        this.followingUserId = followingUserId;
    }
}
