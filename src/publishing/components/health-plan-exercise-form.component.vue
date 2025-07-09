<script>
import {HealthPlanExercise} from "@/publishing/model/health-plan-exercise.entity.js";
import {ExerciseService} from "@/publishing/services/exercise.service.js";
import {Exercise} from "@/publishing/model/exercise.entity.js";

export default {
  name: "health-plan-exercise-form",
  emits: ['save', 'hide'],
  props: {
    editingPlanExercise: {
      type: HealthPlanExercise,
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
      planExerciseData: new HealthPlanExercise({ }),
      submitted: false,
      loading: false,
      dayOfWeekTypes: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      availableExercises: [],
      exerciseService: new ExerciseService(),
    };
  },
  watch: {
    dialogVisible: {
      handler(newValue) {
        this.visible = newValue;

        if (newValue) {
          if (this.editingPlanExercise) {
            // Editar: copia los datos existentes
            this.planExerciseData = new HealthPlanExercise({ ...this.editingPlanExercise });
          } else {
            // Crear: inicializar con healthPlanId
            this.planExerciseData = new HealthPlanExercise({
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
      return this.isEditMode ? 'Editar Asignación de Ejercicio' : 'Crear Nueva Asignación de Ejercicio';
    },
    saveButtonLabel() {
      return this.isEditMode ? 'Actualizar Asignación' : 'Guardar Asignación';
    },
    isEditMode() {
      return this.editingPlanExercise !== null && this.editingPlanExercise.id !== undefined;
    }
  },
  methods: {
    async fetchAvailableExercises() {
      this.exerciseService.getAll().then(response => {
        this.availableExercises = response.data.map(exercise => new Exercise(exercise));
      }).catch(error => { this.errors.push(error); this.healthPlans = []; console.log(error);});
    },
    hideDialog() {
      this.visible = false;
      this.$emit('hide');
    },
    validateForm() {
      this.submitted = true;
      const isExerciseSelected = this.isEditMode ? true : this.planExerciseData.exerciseId !== undefined &&
          this.planExerciseData.exerciseId !== null;
      return (
          this.planExerciseData.healthPlanId &&
          isExerciseSelected && // <--- Use the new validation for exerciseId
          this.planExerciseData.dayOfWeek &&
          this.planExerciseData.instructions
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
          // Al editar, asegúrate de incluir healthPlanId explícitamente
          payload = new HealthPlanExercise({
            ...this.planExerciseData,
            healthPlanId: this.currentHealthPlanId // <--- Agregado para que no falte
          });
          delete payload.exerciseName;
        } else {
          // Si estás creando, crea una instancia completa correctamente
          const selectedExercise = this.availableExercises.find(e => e.id === this.planExerciseData.exerciseId);

          payload = new HealthPlanExercise({
            id: "", // se ignora en creación
            healthPlanId: this.currentHealthPlanId,
            exerciseId: this.planExerciseData.exerciseId,
            exerciseName: selectedExercise ? selectedExercise.name : "",
            dayOfWeek: this.planExerciseData.dayOfWeek,
            instructions: this.planExerciseData.instructions,
            sets: this.planExerciseData.sets,
            reps: this.planExerciseData.reps,
            durationInMinutes: this.planExerciseData.durationInMinutes,
          });
          delete payload.id;
        }
        console.log('Payload para actualizar:', payload);
        this.$emit('save', payload, this.isEditMode);
      } catch (error) {
        console.error("Error preparing to save plan:", error);
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
    this.fetchAvailableExercises();
  }
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
        <pv-input-text :modelValue="healthPlanName" inputId="plan-exercise-healthPlanName" class="w-full m-1" readonly/>
        <label for="plan-exercise-healthPlanName" class="z-5">Nombre del Plan de Salud</label>
      </pv-float-label>

      <div class="mb-4">
        <label for="plan-exercise-exercise" class="font-bold block mb-2">Nombre del Ejercicio</label>
        <pv-select
            v-if="!isEditMode"
            inputId="plan-exercise-exercise"
            v-model="planExerciseData.exerciseId"
            :options="availableExercises"
            optionLabel="name"  optionValue="id"    placeholder="Selecciona un Ejercicio"
            class="w-full"
            :class="{'p-invalid': submitted && !planExerciseData.exerciseId}"
        />
        <pv-input-text
            v-else
            :modelValue="planExerciseData.exerciseName"
            inputId="plan-exercise-exerciseName"
            class="w-full m-1"
            readonly
        />
        <small class="p-error" v-if="submitted && !planExerciseData.exerciseId && !isEditMode">
          El ejercicio es requerido.
        </small>
      </div>

      <div class="flex flex-wrap gap-6 mb-3">
        <div class="flex-auto">
          <label for="health-plan-exercise-dayOfWeek" class="font-bold block mb-2">Día de la semana</label>
          <pv-select inputId="health-plan-exercise-dayOfWeek" v-model="planExerciseData.dayOfWeek" :options="dayOfWeekTypes"
                     placeholder="Select a Day of the Week" :highlightOnSelect="false" class="w-full md:w-56"/>
        </div>
        <div class="flex-auto">
          <label for="health-plan-exercise-duration" class="font-bold block mb-2">Tiempo de duración</label>
          <pv-input-number v-model="planExerciseData.durationInMinutes" showButtons inputId="health-plan-exercise-duration"
                           class="w-full" placeholder="Cantidad de minutos del ejercicio"/>
        </div>
      </div>

      <div class="flex flex-wrap gap-6">
        <div class="flex-auto">
          <label for="health-plan-exercise-reps" class="font-bold block mb-2">Cantidad de repeticiones</label>
          <pv-input-number v-model="planExerciseData.reps" showButtons inputId="health-plan-exercise-reps"
                           class="w-full" placeholder="Cantidad de repeticiones del ejercicio"/>
        </div>
        <div class="flex-auto">
          <label for="health-plan-exercise-sets" class="font-bold block mb-2">Cantidad de sets</label>
          <pv-input-number v-model="planExerciseData.sets" showButtons inputId="health-plan-exercise-sets"
                           class="w-full" placeholder="Cantidad de sets del ejercicio"/>
        </div>
      </div>

      <label for="health-plan-exercise-instructions" class="font-bold block mb-2">Instrucciones del ejercicio</label>
      <pv-float-label class="mb-4" variant="on">
        <pv-textarea id="health-plan-exercise-instructions" v-model="planExerciseData.instructions" rows="4" class="w-full"/>
        <label for="plan-description" class="z-5">Instrucciones</label>
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