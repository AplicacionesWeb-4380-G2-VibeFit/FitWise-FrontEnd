export class HealthPlanExercise {
    constructor({
        id = "",
        healthPlanId = "",
        exerciseId = "",
        dayOfWeek = "",
        instructions = "",
        sets = 0,
        reps = 0,
        durationInMinutes = 0,
                    exerciseName = ""
                }) {
        this.id = id;
        this.healthPlanId = healthPlanId;
        this.exerciseId = exerciseId;
        this.dayOfWeek = dayOfWeek;
        this.instructions = instructions;
        this.sets = sets;
        this.reps = reps;
        this.durationInMinutes = durationInMinutes;
        this.exerciseName = exerciseName;
    }
}