/**
 * @class Schedule
 * @description This class serves as a model for schedule objects containing information such as
 * the user owner, health plan whose it belongs and date. It provides a structured
 * way to create and manage schedule throughout the application.
 */
export class Schedule {
    /**
     * Creates a new ScheduleEntity instance
     * @param {Object} params - The schedule initialization parameters
     * @param {string} [params.id=""] - Unique identifier for the schedule
     * @param {string} [params.userId=""] - Contains the id of a user
     * @param {string} [params.healthPlanId=""] - Contains the id of a Health Plan whose it belongs
     * @param {string} [params.date=""] - Display the date of the schedule
     *
     */
    constructor({
                    id = "",
                    userId = "",
                    healthPlanId = "",
                    date = "",
                }) {
        /**
         * @type {string}
         * @description Unique identifier for the schedule
         */
        this.id = id;

        /**
         * @type {string}
         * @description Contains the id of a user
         */
        this.userId = userId;

        /**
         * @type {string}
         * @description Contains the id of a Health Plan whose it belongs
         */
        this.healthPlanId = healthPlanId;

        /**
         * @type {string}
         * @description Display the date of the schedule
         */
        this.date = date;
    }
}