export class Payment {
    constructor({   id=""
                    , purchasedPlanId=""
                    , method=""
                    , amount=""
                    , currency=""
                    , status=""
                    , paymentDate="" }) {
        this.id = id;
        this.purchasedPlanId = purchasedPlanId;
        this.method = method;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.paymentDate = paymentDate;
    }

}
