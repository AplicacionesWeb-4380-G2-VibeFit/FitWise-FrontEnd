<script>
import {HealthPlanExerciseService} from "@/publishing/services/health-plan-exercise.service.js";
import HealthPlanExerciseForm from "@/publishing/components/health-plan-exercise-form.component.vue";
import {HealthPlanExercise} from "@/publishing/model/health-plan-exercise.entity.js";

export default {
  name: "health-plan-exercise-table",
  emits: ['edit-health-plan-exercise', 'delete-health-plan-exercise', 'new-health-plan-exercise-created'],
  components: {HealthPlanExerciseForm},
  data (){
    return{
      healthPlanExerciseData: new HealthPlanExercise({}),
      healthPlanExerciseService: new HealthPlanExerciseService(),
      displayDialog: false,
      errors: [],
    }
  },
  props: {
    // El array de objetos healthPlanExercise tal como los recibes de tu API
    healthPlanExercises: {
      type: Array,
      default: () => [],
      required: true
    },
    // Mensaje a mostrar cuando la tabla está vacía
    emptyMessage: {
      type: String,
      default: "No hay ejercicios asignados."
    },
    healthPlanName: {
      type: String,
      required: true
    },
    healthPlanId: {
      type: Number,
      required: true
    }
  },
  methods: {
    onEditHealthPlanExercise(healthPlanExerciseData) {
      this.healthPlanExerciseData = new HealthPlanExercise(healthPlanExerciseData);
      this.displayDialog = true;
    },
    onCreateNewHealthPlanExercise() {
      this.healthPlanExerciseData = null;
      this.displayDialog = true; // Show the dialog
    },
    onDeleteHealthPlanExercise(healthPlanExerciseData) {
      this.$confirm.require({
        message: '¿Está seguro que desea eliminar esta asignación? Esta acción no se puede deshacer.',
        header: 'Confirmar Eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, Eliminar',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-danger',
        accept: async () => {
          try {
            await this.healthPlanExerciseService.delete(healthPlanExerciseData.id);
            this.$toast.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'La asignación ha sido eliminada exitosamente.',
              life: 3000
            });
            this.$emit('delete-health-plan-exercise', healthPlanExerciseData);
          } catch (e) {
            console.error("Error deleting assigment:", e);
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Hubo un error al eliminar la asignación.',
              life: 3000
            });
            this.errors.push(e);
          }
        }
      })
    },
    // Important: Modify onSaveHealthPlanExercise to handle creation
    async onSaveHealthPlanExercise(healthPlanExerciseData, isEditMode) {
      try {
        if (isEditMode) {
          await this.healthPlanExerciseService.update(healthPlanExerciseData.id, healthPlanExerciseData);
          this.$toast.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'La asignación de ejercicio ha sido actualizada exitosamente.',
            life: 3000
          });
          this.$emit('edit-health-plan-exercise', healthPlanExerciseData);
        } else {
          const createdAssignment = await this.healthPlanExerciseService.create(healthPlanExerciseData);
          this.$toast.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'La asignación de ejercicio ha sido creada exitosamente.',
            life: 3000
          });
          this.$emit('new-health-plan-exercise-created');
        }
        this.displayDialog = false;
      } catch (error) {
        console.error("Error al guardar la asignación:", error);
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: `Hubo un error al ${isEditMode ? 'actualizar' : 'crear'} la asignación.`,
          life: 3000
        });
        this.errors.push(error);
      }
    },
  }
}
</script>

<template>
  <div class="health-plan-exercise-table">
    <pv-data-table
        :value="healthPlanExercises"
        responsiveLayout="scroll"
        :emptyMessage="emptyMessage"
    >
      <pv-column field="exerciseName" header="Nombre del Ejercicio"></pv-column>
      <pv-column field="dayOfWeek" header="Día"></pv-column>
      <pv-column field="instructions" header="Instrucciones"></pv-column>
      <pv-column field="sets" header="Series"></pv-column>
      <pv-column field="reps" header="Repeticiones"></pv-column>
      <pv-column field="durationInMinutes" header="Duración (min)"></pv-column>
      <pv-column header="Acciones">
        <template #body="{ data }">
          <pv-button
              icon="pi pi-pencil"
              class="p-button-text p-button-sm p-button-warning ml-2"
              v-tooltip.top="'Editar Asignación'"
              @click="onEditHealthPlanExercise(data)"
          />
          <pv-button
              icon="pi pi-trash"
              class="p-button-text p-button-danger p-button-sm ml-2"
              v-tooltip.top="'Eliminar Asignación'"
              @click="onDeleteHealthPlanExercise(data)"
          />
        </template>
      </pv-column>
    </pv-data-table>
  </div>
  <div class="flex justify-content-end mt-4">
    <pv-button
        label="Nueva Asignación de Ejercicio"
        icon="pi pi-plus"
        severity="success"
        @click="onCreateNewHealthPlanExercise"
        rounded
    />
  </div>
  <health-plan-exercise-form
      :editing-plan-exercise="healthPlanExerciseData"
      :dialogVisible="displayDialog"
      @hide="() => { displayDialog = false }"
      @save="onSaveHealthPlanExercise" :health-plan-name="healthPlanName"
      :current-health-plan-id="healthPlanId"/>
</template>

<style scoped>

</style>