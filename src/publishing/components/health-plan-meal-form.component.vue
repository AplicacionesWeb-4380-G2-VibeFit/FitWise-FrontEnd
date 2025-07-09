<script>
import {HealthPlanMeal} from "@/publishing/model/health-plan-meal.entity.js";
import {MealService} from "@/publishing/services/meal.service.js";
import {Meal} from "@/publishing/model/meal.entity.js";

export default {
  name: "health-plan-meal-form",
  emits: ['save', 'hide'],
  props: {
    editingPlanMeal: {
      type: HealthPlanMeal, // Assuming HealthPlanMeal is an object
      default: null,
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    healthPlanName: {
      type: String,
      required: true,
    },
    currentHealthPlanId: { // <--- Add this new prop
      type: Number, // Or String, depending on your ID type
      default: null,
      required: true // Make it required if it's always needed for new creations
    }
  },
  data() {
    return {
      errors: [],
      visible: this.dialogVisible,
      planMealData: new HealthPlanMeal({ }),
      submitted: false,
      loading: false,
      dayOfWeekTypes: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      mealTime: ['Breakfast', 'MorningSnack', 'Lunch', 'AfternoonSnack', 'Dinner'],
      availableMeals: [],
      mealService: new MealService(),
    };
  },
  watch: {
    dialogVisible: {
      handler(newValue) {
        this.visible = newValue;

        if (newValue) {
          if (this.editingPlanMeal) {
            // Editar: copia los datos existentes
            this.planMealData = new HealthPlanMeal({ ...this.editingPlanMeal });
          } else {
            // Crear: inicializar con healthPlanId
            this.planMealData = new HealthPlanMeal({
              healthPlanId: this.currentHealthPlanId
            });
          }
          this.submitted = false;
        }
      },
      immediate: true
    }
  },
  computed: {
    dialogHeader() {
      return this.isEditMode ? 'Editar Asignación de Comida' : 'Crear Nueva Asignación de Comida';
    },
    saveButtonLabel() {
      return this.isEditMode ? 'Actualizar Asignación' : 'Guardar Asignación';
    },
    isEditMode() {
      return this.editingPlanMeal !== null && this.editingPlanMeal.id !== undefined;
    }
  },
  methods:{
    async fetchAvailableMeals() {
      this.mealService.getAll().then(response => {
        this.availableMeals = response.data.map(meal => new Meal(meal));
      }).catch(error => { this.errors.push(error); this.healthPlans = []; console.log(error);});
    },
    hideDialog() {
      this.visible = false;
      this.$emit('hide');
    },
    validateForm() {
      this.submitted = true;
      const isMealSelected = this.isEditMode ? true : this.planMealData.mealId !== undefined &&
          this.planMealData.mealId !== null;

      return (
          this.planMealData.healthPlanId &&
          isMealSelected &&
          this.planMealData.dayOfWeek &&
          this.planMealData.mealTime
      );
    },
    async savePlan() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      try {
        let payload;
        if (this.isEditMode) {
          // Update existing plan meal
          payload = new HealthPlanMeal({
            ...this.planMealData, healthPlanId: this.currentHealthPlanId});
        } else {
          const selectedMeal = this.availableMeals.find(meal => meal.id === this.planMealData.mealId);
          payload = new HealthPlanMeal({
            id: "",
            healthPlanId: this.currentHealthPlanId,
            mealId: this.planMealData.mealId,
            mealName: selectedMeal ? selectedMeal.name : "",
            dayOfWeek: this.planMealData.dayOfWeek,
            mealTime: this.planMealData.mealTime,
            notes: this.planMealData.notes,
          });
          delete payload.id; // Ensure id is not included for new entries
        }
        console.log('Payload para actualizar:', payload);
        this.$emit('save', payload, this.isEditMode);
      } catch (error) {
        console.error("Error saving plan meal:", error);
      } finally {
        this.loading = false;
      }
    },
    onHideDialog() {
      this.submitted = false;
      this.loading = false;
      this.$emit('hide');
    }
  },
  created() {
    this.fetchAvailableMeals();
  },
}
</script>

<template>
  <pv-dialog
      v-model:visible="visible"
      modal
      :header="dialogHeader"
      :style="{ width: '40rem' }"
      @hide="onHideDialog"
      :contentStyle="{ overflow: 'visible' }">
    <pv-fluid>
      <pv-float-label class="mb-4" variant="on">
        <pv-input-text :modelValue="healthPlanName" inputId="plan-meal-healthPlanName" class="w-full m-1" readonly/>
        <label for="plan-meal-healthPlanName" class="z-5">Nombre del Plan de Salud</label>
      </pv-float-label>

      <div class="mb-4">
        <label for="plan-meal" class="font-bold block mb-2">Nombre del Ejercicio</label>
        <pv-select
            v-if="!isEditMode"
            inputId="plan-meal"
            v-model="planMealData.mealId"
            :options="availableMeals"
            optionLabel="name"  optionValue="id"    placeholder="Selecciona una comida"
            class="w-full"
            :class="{'p-invalid': submitted && !planMealData.mealId}"
        />
        <pv-input-text
            v-else
            :modelValue="planMealData.mealName"
            inputId="plan-meal"
            class="w-full m-1"
            readonly
        />
        <small class="p-error" v-if="submitted && !planMealData.mealId && !isEditMode">
          La comida es requerida.
        </small>
      </div>

      <div class="flex flex-wrap gap-6 mb-3">
        <div class="flex-auto">
          <label for="health-plan-meal-dayOfWeek" class="font-bold block mb-2">Día de la semana</label>
          <pv-select inputId="health-plan-meal-dayOfWeek" v-model="planMealData.dayOfWeek" :options="dayOfWeekTypes"
                     placeholder="Select a Day of the Week" :highlightOnSelect="false" class="w-full md:w-56"/>
        </div>
        <div class="flex-auto">
          <label for="health-plan-meal-mealTime" class="font-bold block mb-2">Hora de la comida</label>
          <pv-select inputId="health-plan-meal-mealTime" v-model="planMealData.mealTime" :options="mealTime"
          placeholder="Select a Meal Time" :highlightOnSelect="false" class="w-full md:w-56"/>
        </div>
      </div>

      <label for="health-plan-meal-notes" class="font-bold block mb-2">Notas de la comida</label>
      <pv-float-label class="mb-4" variant="on">
        <pv-textarea id="health-plan-meal-notes" v-model="planMealData.notes" rows="4" class="w-full"/>
        <label for="plan-description" class="z-5">Notas</label>
      </pv-float-label>
    </pv-fluid>
    <template #footer>
      <pv-button label="Cancelar" severity="secondary" @click="hideDialog" autofocus rounded/>
      <pv-button :label="saveButtonLabel" severity="success" @click="savePlan" :loading="loading"
                 :disabled="!validateForm()" rounded/>
    </template>
  </pv-dialog>
</template>

<style scoped>

</style>