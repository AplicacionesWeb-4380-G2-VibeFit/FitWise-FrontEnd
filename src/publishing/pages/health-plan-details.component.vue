<script>
import HealthPlanSidebar from "@/publishing/components/health-plan-sidebar.component.vue";
import {HealthPlan} from "@/publishing/model/health-plan.entity.js";
import {HealthPlanService} from "@/publishing/services/health-plan.service.js";
import HealthPlanForm from "@/publishing/components/health-plan-form.component.vue";
import HealthPlanMealTable from "@/publishing/components/health-plan-meal-table.component.vue";
import {HealthPlanExercise} from "@/publishing/model/health-plan-exercise.entity.js";
import {HealthPlanMeal} from "@/publishing/model/health-plan-meal.entity.js";
import HealthPlanExerciseTable from "@/publishing/components/health-plan-exercise-table.component.vue";
import {ExerciseService} from "@/publishing/services/exercise.service.js";
import {MealService} from "@/publishing/services/meal.service.js";

export default {
  name: "health-plan-details",
  components: {HealthPlanExerciseTable, HealthPlanMealTable, HealthPlanForm, HealthPlanSidebar},
  data() {
    return {
      healthPlanData: new HealthPlan({}),
      healthPlanService: new HealthPlanService(),
      mealService: new MealService(),
      exerciseService: new ExerciseService(),

      errors: [],
      displayDialog: false,

      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],

      activeDayIndex: 0,
      healthPlanMeals: [],
      healthPlanExercises: []
    }
  },
  methods: {
    getHealthPlanById(planId) {
      this.healthPlanService.getById(planId).then(response => {
        this.healthPlanData = new HealthPlan(response.data);
        this.loadDayData(this.activeDayIndex);
      }).catch(error => { this.errors.push(error); this.healthPlanData = null; console.log(error);});
    },
    onEditPlan(plan) {
      console.log('Editar plan recibido:', plan);
      this.displayDialog = true;
    },
    async onSavePlan(planData, isEditMode) {
      try {
        if (isEditMode) {
          await this.healthPlanService.update(planData.id, planData);
          this.$toast.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'El plan de salud ha sido actualizado exitosamente.',
            life: 3000
          });
          this.getHealthPlanById(planData.id);
        }
        this.displayDialog = false;  // Cierra el modal
      } catch (error) {
        console.error("Error al guardar el plan:", error);
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al actualizar el plan de salud.',
          life: 3000
        });
        this.errors.push(error);
      }
    },
    deleteSelectedPlan(planId) {
      console.log('Parent received delete event for ID:', planId);
      this.$confirm.require({
        message: '¿Está seguro que desea eliminar este plan de salud? Esta acción no se puede deshacer.',
        header: 'Confirmar Eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, Eliminar',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-danger',
        accept: async () => { // Async function to await the delete call
          try {
            await this.healthPlanService.delete(planId);
            this.$toast.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'El plan de salud ha sido eliminado exitosamente.',
              life: 3000
            });
            this.getHealthPlanById();
          } catch (error) {
            console.error("Error deleting health plan:", error);
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Hubo un error al eliminar el plan de salud.',
              life: 3000
            });
            this.errors.push(error);
          }
        },
        reject: () => {
          this.$toast.add({
            severity: 'info',
            summary: 'Cancelado',
            detail: 'La eliminación del plan ha sido cancelada.',
            life: 3000
          });
        }
      });
    },

    async onTabChange(event) {
      this.activeDayIndex = event.index;
      await this.loadDayData(event.index);
    },

    async loadDayData(dayIndex) {
      if (!this.healthPlanData || !this.healthPlanData.id) {
        console.warn('No hay plan de salud o ID disponible para cargar datos del día.');
        this.healthPlanMeals = [];
        this.healthPlanExercises = [];
        return;
      }

      const planId = this.healthPlanData.id;
      const dayOfWeek = this.daysOfWeek[dayIndex];

      try {
        const mealsResponse = await this.healthPlanService.getMeals(planId, dayOfWeek);
        const exercisesResponse = await this.healthPlanService.getExercises(planId, dayOfWeek);

        // Caches para evitar duplicados en las peticiones
        const mealCache = {};
        const exerciseCache = {};

        this.healthPlanMeals = await Promise.all(mealsResponse.data.map(async (meal) => {
          if (!mealCache[meal.mealId]) {
            const mealDetails = await this.mealService.getById(meal.mealId);
            mealCache[meal.mealId] = mealDetails.data.name;
          }
          return new HealthPlanMeal({ ...meal, mealName: mealCache[meal.mealId] });
        }));

        this.healthPlanExercises = await Promise.all(exercisesResponse.data.map(async (exercise) => {
          if (!exerciseCache[exercise.exerciseId]) {
            const exerciseDetails = await this.exerciseService.getById(exercise.exerciseId);
            exerciseCache[exercise.exerciseId] = exerciseDetails.data.name;
          }
          return new HealthPlanExercise({ ...exercise, exerciseName: exerciseCache[exercise.exerciseId] });
        }));

      } catch (error) {
        console.error(`Error al cargar datos para ${dayOfWeek}:`, error);
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: `Hubo un error al cargar los datos para ${dayOfWeek}.`,
          life: 3000
        });
        this.errors.push(error);
      }
    },
    onEditHealthPlanMeal(healthPlanMealData) {
      console.log('Editar asignación de comida:', healthPlanMealData);
      this.loadDayData(this.activeDayIndex);
    },
    onDeleteHealthPlanMeal(healthPlanMealData) {
      console.log('Eliminar asignación de comida:', healthPlanMealData);
      this.loadDayData(this.activeDayIndex);
    },
    onNewHealthPlanMealCreated() {
      console.log('Nueva asignación de comida creada');
      this.loadDayData(this.activeDayIndex);
    },
    onEditHealthPlanExercise(healthPlanExerciseData) {
      console.log('Editar asignación de ejercicio:', healthPlanExerciseData);
      this.loadDayData(this.activeDayIndex);
    },
    onDeleteHealthPlanExercise(healthPlanExerciseData) {
      console.log('Eliminar asignación de ejercicio:', healthPlanExerciseData);
      this.loadDayData(this.activeDayIndex);
    },
    onNewHealthPlanExerciseCreated() {
      console.log('Nueva asignación de ejercicio creada');
      this.loadDayData(this.activeDayIndex);
    }
  },
  created(){
    const planId = this.$route.params.id;
    this.getHealthPlanById(planId);
  }
}
</script>

<template>
  <div class="health-plan-details-page p-4">
    <div class="flex justify-content-between align-items-center mb-4">
      <h1 class="m-0 text-color-secondary">Detalles del Plan: {{ healthPlanData.planName || 'No disponible' }}</h1>
      <router-link to="/publishing">
        <pv-button label="Volver a Planes" icon="pi pi-arrow-left" class="p-button-secondary" />
      </router-link>
    </div>

    <div class="grid gap-4">
      <div class="col-12 md:col-3 flex flex-column gap-4">
        <health-plan-sidebar
            :health-plan="healthPlanData"
            @edit-plan="onEditPlan"
            @delete-plan="deleteSelectedPlan"
          />
      </div>

      <div class="col-12 md:col-5 lg:col-8 flex flex-column gap-4">
        <pv-tab-view :activeIndex="activeDayIndex" @tab-change="onTabChange">
          <pv-tab-panel v-for="day in daysOfWeek" :key="day" :header="day">
            <!-- Sección para Comidas -->
            <div class="flex flex-column gap-4">
              <h3 class="mb-3">Comidas del {{ day }}</h3>
              <health-plan-meal-table
                  :health-plan-meals="healthPlanMeals"
                  @edit-health-plan-meal="onEditHealthPlanMeal"
                  @delete-health-plan-meal="onDeleteHealthPlanMeal"
                  @new-health-plan-meal-created="onNewHealthPlanMealCreated"
               :health-plan-id="healthPlanData.id" :health-plan-name="healthPlanData.planName"/>
            </div>

            <!-- Sección para Ejercicios -->
            <div class="flex flex-column gap-4">
              <h3 class="mb-3">Ejercicios del {{ day }}</h3>
              <health-plan-exercise-table
                  :health-plan-exercises="healthPlanExercises"
                  @edit-health-plan-exercise="onEditHealthPlanExercise"
                  @delete-health-plan-exercise="onDeleteHealthPlanExercise"
                  @new-health-plan-exercise-created="onNewHealthPlanExerciseCreated"
               :health-plan-name="healthPlanData.planName" :health-plan-id="healthPlanData.id"/>
            </div>
          </pv-tab-panel>
        </pv-tab-view>
      </div>
    </div>

    <health-plan-form
        :dialogVisible="displayDialog"
        :editingPlan="healthPlanData"
        @save="onSavePlan"
        @hide="() => { displayDialog = false }"
    />
  </div>
  <div class="flex justify-content-end">
    <router-link to="/meal-exercise-management">
      <pv-button label="Creación de comidas y ejercicios" icon="pi pi-arrow-right" class="p-button-secondary" />
    </router-link>
  </div>
</template>

<style scoped>

</style>