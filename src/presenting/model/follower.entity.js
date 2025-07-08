export class Follower {
    constructor({
                    id = 0,
                    followerUserId = 0,
                    followedUserId = 0
    }) {
        this.id = id;
        this.followerUserId = followerUserId;
        this.followedUserId = followedUserId;
    }
}
