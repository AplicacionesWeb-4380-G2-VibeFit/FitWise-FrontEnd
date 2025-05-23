export class PurchasedPlan {
    constructor({ id, ownerId, planId, purchaseDate, status }) {
        this.id = id;
        this.ownerId = ownerId;
        this.planId = planId;
        this.purchaseDate = purchaseDate;
        this.status = status;
    }
}
