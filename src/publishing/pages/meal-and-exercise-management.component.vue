<script>
import {MealService} from "@/publishing/services/meal.service.js";
import {ExerciseService} from "@/publishing/services/exercise.service.js";
import {Meal} from "@/publishing/model/meal.entity.js";
import {Exercise} from "@/publishing/model/exercise.entity.js";
import MealsList from "@/publishing/components/meals-list.component.vue";
import ExercisesList from "@/publishing/components/exercises-list.component.vue";
import ExerciseForm from "@/publishing/components/exercise-form.component.vue";
import MealForm from "@/publishing/components/meal-form.component.vue";

export default {
  name: "meal-and-exercise-management",
  components: {MealForm, ExerciseForm, ExercisesList, MealsList},
  data() {
    return {
      mealService: new MealService(),
      exerciseService: new ExerciseService(),
      meals: [],
      exercises: [],
      errors: [],

      selectedExercise: null,
      exerciseDialogVisible: false,

      selectedMeal: null,
      mealDialogVisible: false,
    }
  },
  methods: {
    getAllMeals(){
      this.mealService.getAll().then(respond => {
        this.meals = respond.data.map(meal => new Meal(meal));
        console.log(this.meals);
      }).catch(err => {
        this.errors.push(err);
      });
    },
    getAllExercises() {
      this.exerciseService.getAll().then(respond => {
        this.exercises = respond.data.map(exercise => new Exercise(exercise));
        console.log(this.exercises);
      }).catch(err => {
        this.errors.push(err);
      });
    },
    // Optional: Add update handlers if you want to catch events from child components
    handleUpdateMeal(meal) {
      console.log('Editar meal:', meal);
      this.selectedMeal = meal;
      this.mealDialogVisible = true;
    },
    handleUpdateExercise(exercise) {
      console.log('Editar ejercicio:', exercise);
      this.selectedExercise = exercise;
      this.exerciseDialogVisible = true;
    },
    handleSaveExercise(exerciseData, isEditMode) {
      console.log('Ejercicio guardado:', exerciseData);
      const serviceCall = isEditMode
          ? this.exerciseService.update(exerciseData.id, exerciseData)
          : this.exerciseService.create(exerciseData);

      serviceCall.then(() => {
        this.getAllExercises();
        this.exerciseDialogVisible = false;
        this.selectedExercise = null;
      }).catch(err => {
        this.errors.push(err);
      });
    },
    handleSaveMeal(mealData, isEditMode) {
      console.log('Meal guardado:', mealData);
      const serviceCall = isEditMode
          ? this.mealService.update(mealData.id, mealData)
          : this.mealService.create(mealData);

      serviceCall.then(() => {
        this.getAllMeals();
        this.mealDialogVisible = false;
        this.selectedMeal = null;
      }).catch(err => {
        this.errors.push(err);
      });
    },
    handleHideExerciseDialog() {
      this.exerciseDialogVisible = false;
      this.selectedExercise = null;
    },
    openCreateExerciseDialog() {
      this.selectedExercise = null;
      this.exerciseDialogVisible = true;
    },
    handleHideMealDialog() {
      this.mealDialogVisible = false;
      this.selectedMeal = null;
    },
    openCreateMealDialog() {
      this.selectedMeal = null;
      this.mealDialogVisible = true;
    }
  },
  created() {
    this.getAllMeals();
    this.getAllExercises();
  }
}
</script>

<template>
  <div class="flex justify-content-end mb-4">
    <router-link to="/publishing" class="pt-3">
      <pv-button label="Volver a Planes" icon="pi pi-arrow-left" class="p-button-secondary" />
    </router-link>
  </div>

  <div class="grid p-fluid">
    <div class="col-5">
      <meals-list
          :meals="meals"
          @update-meal="handleUpdateMeal"
          @create-meal="openCreateMealDialog"
      />
    </div>

    <div class="col-2 flex align-items-center justify-content-center">
      <pv-divider layout="vertical" />
    </div>

    <div class="col-5">
      <exercises-list
          :exercises="exercises"
          @update-exercise="handleUpdateExercise"
          @create-exercise="openCreateExerciseDialog"
      />
    </div>
  </div>

  <!-- Formulario (Modal) -->
  <exercise-form
      :editingExercise="selectedExercise"
      :dialogVisible="exerciseDialogVisible"
      @save="handleSaveExercise"
      @hide="handleHideExerciseDialog"
  />

  <meal-form
      :editingMeal="selectedMeal"
      :dialogVisible="mealDialogVisible"
      @save="handleSaveMeal"
      @hide="handleHideMealDialog"
  />
</template>

<style scoped>

</style>