<script>
import {HealthPlan} from "@/publishing/model/health-plan.entity.js";
import {HealthPlanService} from "@/publishing/services/health-plan.service.js";
import HealthPlanList from "@/publishing/components/health-plan-list.component.vue";
import {useSessionStore} from "@/shared/stores/sessionStore.js";
import HealthPlanForm from "@/publishing/components/health-plan-form.component.vue";

export default {
  name: "health-plan-management",
  components: {HealthPlanForm, HealthPlanList},
  data() {
    return {
      healthPlans: [],
      healthPlan: new HealthPlan({}),
      healthPlanService: new HealthPlanService(),
      errors: [],
      displayDialog: false, // Controls dialog visibility
      selectedPlan: null,   // Holds the plan being edited (or null for new)
      loadingPlans: false,  // For loading state of the list
    }
  },
  methods:{
    getHealthPlansByProfileId(userId){
      this.healthPlanService.getByProfileId(userId).then(response => {
        this.healthPlans = response.data.map(healthPlan => new HealthPlan(healthPlan));
        console.log(this.healthPlans);
      }).catch(error => { this.errors.push(error); this.healthPlans = []; console.log(error);});
    },
    fetchDataBasedOnSession() {
      const sessionStore = useSessionStore();
      const currentUserId = sessionStore.getUserId;

      if (currentUserId) {
        console.log(`Fetching data for user: ${currentUserId}`);
        this.getHealthPlansByProfileId(currentUserId);
      } else {
        console.log('User not authenticated/session not active.');
        this.healthPlans = [];
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
            this.fetchDataBasedOnSession();
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
    // --- Dialog Management Methods ---
    openNewPlanDialog() {
      this.selectedPlan = null;
      this.displayDialog = true;
    },
    editSelectedPlan(plan) {
      this.selectedPlan = plan;
      this.displayDialog = true;
    },
    closeDialog() {
      this.displayDialog = false;
      this.selectedPlan = null;
    },

    // --- Save/Update Logic ---
    async handleSaveHealthPlan(planData, isEditMode) {
      try {
        if (isEditMode) {
          await this.healthPlanService.update(planData.id, planData);
          this.$toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Plan de salud actualizado exitosamente.', life: 3000 });
        } else {
          await this.healthPlanService.create(planData);
          this.$toast.add({ severity: 'success', summary: 'Creado', detail: 'Plan de salud creado exitosamente.', life: 3000 });
        }
        this.fetchDataBasedOnSession();
        this.closeDialog();
      } catch (error) {
        console.error("Error saving health plan:", error);
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al guardar el plan de salud.', life: 3000 });
        this.errors.push(error);
      }
    },
    viewSelectedPlan(planId) {
      console.log('Parent received view event for ID:', planId);
      this.$router.push(`/publishing/details/${planId}`);
    },
  },
  mounted() {
    const sessionStore = useSessionStore();
    sessionStore.initializeSession();
    this.fetchDataBasedOnSession();
  }
}
</script>

<template>
  <div class="p-4 w-full max-w-none">
    <div class="flex justify-content-end mb-4">
      <pv-button label="Crear Nuevo Plan" icon="pi pi-plus" class="p-button-primary" @click="openNewPlanDialog" />
    </div>

    <health-plan-list
        :health-plans="healthPlans"
        @viewPlan="viewSelectedPlan"
        @editPlan="editSelectedPlan"
        @deletePlan="deleteSelectedPlan"
    />

    <div v-if="errors.length > 0" class="p-error p-3 mt-4">
      <p>Ocurrió un error:</p>
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{ error.message || error }}</li>
      </ul>
    </div>

    <health-plan-form
        :dialogVisible="displayDialog"
        :editingPlan="selectedPlan"
        @save="handleSaveHealthPlan"
        @hide="closeDialog"
    />
  </div>
</template>

<style scoped>

</style>