import {Payment} from "@/selling/model/payment.entity.js";

export class PurchaseHistory {
    constructor({ userId = "", payments = [] }) {
        this.userId = userId;
        this.payments = payments.map(p => new Payment(p));
    }
}
