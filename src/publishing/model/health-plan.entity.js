/**
 * @class HealthPlan
 * @description This class serves as a model for health plan objects, containing information such as
 * plan name, objectives, duration, pricing, and creator details. It provides a structured
 * way to create and manage health plan data throughout the application.
 */
export class HealthPlan {
    /**
     * Creates a new HealthPlan instance
     * @param {Object} params - The health plan initialization parameters
     * @param {string} [params.id=""] - Unique identifier fot the health plan
     * @param {string} [params.name=""] - Display name of the health plan
     * @param {string} [params.objective=""] - Display the main purpose of the health plan
     * @param {string} [params.duration=""] - Display the time that the health plan will be active
     * @param {number} [params.price=0] - Display the money that the health plan costs
     * @param {string} [params.description=""] - Display the information about the health plan
     * @param {string} [params.creadorId=""] - Contains the id of the trainer/user that created the health plan
     */
    constructor({
        id = "",
        name = "",
        objective = "",
        duration = "",
        price = 0,
        description = "",
        creadorId = ""
                }) {
        /**
         * @type {string}
         * @description Unique identifier fot the health plan
         */
        this.id = id;

        /**
         * @type {string}
         * @description Display name of the health plan
         */
        this.name = name;

        /**
         * @type {string}
         * @description Display the main purpose of the health plan
         */
        this.objective = objective;

        /**
         * @type {string}
         * @description Display the time that the health plan will be active
         */
        this.duration = duration;

        /**
         * @type {number}
         * @description Display the money that the health plan costs
         */
        this.price = price;

        /**
         * @type {string}
         * @description Display the information about the health plan
         */
        this.description = description;

        /**
         * @type {string}
         * @description Contains the id of the trainer/user that created the health plan
         */
        this.creadorId = creadorId;
    }
}