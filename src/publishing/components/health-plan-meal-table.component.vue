<script>
import {HealthPlanMealService} from "@/publishing/services/health-plan-meal.service.js";
import {HealthPlanMeal} from "@/publishing/model/health-plan-meal.entity.js";
import HealthPlanMealForm from "@/publishing/components/health-plan-meal-form.component.vue";

export default {
  name: "health-plan-meal-table",
  components: {HealthPlanMealForm},
  emits: ['edit-health-plan-meal', 'delete-health-plan-meal', 'new-health-plan-meal-created'],
  data(){
    return{
      healthPlanMealData: new HealthPlanMeal({}),
      healthPlanMealService: new HealthPlanMealService(),
      displayDialog: false,
      errors: [],
      mealTime: ['Breakfast', 'MorningSnack', 'Lunch', 'AfternoonSnack', 'Dinner'],
    }
  },
  props: {
    healthPlanMeals: {
      type: Array,
      default: () => [],
      required: true,
    },
    emptyMessage: {
      type: String,
      default: "No hay comidas asignadas."
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
    onEditHealthPlanMeal(healthPlanMealData) {
      this.healthPlanMealData = new HealthPlanMeal(healthPlanMealData);
      this.displayDialog = true;
    },
    onCreateNewHealthPlanMeal() {
      this.healthPlanMealData = null;
      this.displayDialog = true;
    },
    onDeleteHealthPlanMeal(healthPlanMealData) {
      this.$confirm.require({
        message: '¿Está seguro que desea eliminar esta asignación? Esta acción no se puede deshacer.',
        header: 'Confirmar Eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, Eliminar',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-danger',
        accept: async () => {
          try {
            await this.healthPlanMealService.delete(healthPlanMealData.id);
            this.$toast.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'La asignación ha sido eliminada exitosamente.',
              life: 3000
            });
            this.$emit('delete-health-plan-meal', healthPlanMealData);
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
    async onSaveHealthPlanMeal(healthPlanMealData, isEditMode) {
      try {
        if (isEditMode) {
          await this.healthPlanMealService.update(healthPlanMealData.id, healthPlanMealData);
          this.$toast.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'La asignación de comida ha sido actualizada exitosamente.',
            life: 3000
          });
          this.$emit('edit-health-plan-meal', healthPlanMealData);
        } else {
          const createdAssignment = await this.healthPlanMealService.create(healthPlanMealData);
          this.$toast.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'La asignación de comida ha sido creada exitosamente.',
            life: 3000
          });
          this.$emit('new-health-plan-meal-created');
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
  },
  computed: {
    sortedHealthPlanMeals() {
      return [...this.healthPlanMeals].sort((a, b) => {
        const orderA = this.mealTime.indexOf(a.mealTime);
        const orderB = this.mealTime.indexOf(b.mealTime);
        return orderA - orderB;
      });
    }
  }

}
</script>

<template>
  <div class="health-plan-meal-table">
    <pv-data-table
        :value="sortedHealthPlanMeals"
        responsiveLayout="scroll"
        :emptyMessage="emptyMessage"
    >
      <pv-column field="mealName" header="Nombre de la Comida"></pv-column>
      <pv-column field="dayOfWeek" header="Día"></pv-column>
      <pv-column field="mealTime" header="Hora"></pv-column>
      <pv-column field="notes" header="Notas"></pv-column>
      <pv-column header="Acciones">
        <template #body="{ data }">
          <pv-button
              icon="pi pi-pencil"
              class="p-button-text p-button-sm p-button-warning ml-2"
              v-tooltip.top="'Editar Asignación'"
              @click="onEditHealthPlanMeal(data)"
          />
          <pv-button
              icon="pi pi-trash"
              class="p-button-text p-button-danger p-button-sm ml-2"
              v-tooltip.top="'Eliminar Asignación'"
              @click="onDeleteHealthPlanMeal(data)"
          />
        </template>
      </pv-column>
    </pv-data-table>
  </div>
  <div class="flex justify-content-end mt-4">
    <pv-button
        label="Nueva Asignación de Comida"
        icon="pi pi-plus"
        severity="success"
        @click="onCreateNewHealthPlanMeal"
        rounded
    />
  </div>
  <health-plan-meal-form
    :editing-plan-meal="healthPlanMealData"
    :dialogVisible="displayDialog"
    @hide="() => { displayDialog = false }"
    @save="onSaveHealthPlanMeal" :health-plan-name="healthPlanName"
    :current-health-plan-id="healthPlanId"/>
</template>

<style scoped>

</style>