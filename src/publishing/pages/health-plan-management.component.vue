<script>
import {HealthPlan} from "@/publishing/model/health-plan.entity.js";
import {HealthPlanService} from "@/publishing/services/health-plan.service.js";
import HealthPlanList from "@/publishing/components/health-plan-list.component.vue";
import HealthPlanItemCreateAndEdit from "@/publishing/components/healthPlan-item-create-and-edit.component.vue";

export default {
  name: "health-plan-management",
  components: {HealthPlanItemCreateAndEdit, HealthPlanList},
  data() {
    return {
      healthPlans: [],
      healthPlan: new HealthPlan({}),
      healthPlanService: null,
      errors: [],
      creatorIds: [],
      showDialog: false,
      isEdit: false
    }
  },
  methods: {
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },
    findIndexById(id) {
      return this.healthPlans.findIndex(healthPlan => healthPlan.id === id);
    },
    getAllHealthPlans() {
      this.healthPlanService.getAll().then(response => {
        const rawPlans = response.data.map(healthPlan => new HealthPlan(healthPlan));
        this.healthPlans = rawPlans;
        console.log(this.healthPlans);
        // Obtener creadorIds únicos
        this.creatorIds = [...new Set(rawPlans.map(plan => plan.creadorId))];
      }).catch(error => { this.errors.push(error); this.healthPlans = []; console.log(error); });
    },
    getPlansByCreator(creatorId) {
      this.healthPlanService.getByCreatorId(creatorId).then(response => {
        this.healthPlans = response.data.map(healthPlan => new HealthPlan(healthPlan));
        console.log(this.healthPlans);
      }).catch(error => { this.errors.push(error); this.healthPlans = []; console.log(error); });
    },
    resetToAll() {
      this.getAllHealthPlans();
    },
    editHealthPlan(plan) {
      // Lógica para editar el plan
      console.log('Editar plan:', plan);
      this.healthPlan = new HealthPlan(plan);
      this.isEdit = true;
      this.submitted = false;
      this.showDialog = true;

    },
    updateHealthPlan() {
      this.healthPlanService.update(this.healthPlan.id, this.healthPlan).then(response => {
        console.log('updateHealthPlan');
        let index = this.findIndexById(this.healthPlan.id);
        this.healthPlans[index] = new HealthPlan(response.data);
        console.log(this.healthPlans);
        this.notifySuccessfulAction("Category Updated");
      }).catch(error => console.error(error));
    },
    deleteHealthPlan(plan) {
      this.healthPlanService.delete(plan.id)
          .then(() => {
            this.notifySuccessfulAction('Plan eliminado correctamente');
            this.getAllHealthPlans(); // Refrescar la lista
          })
          .catch(error => {
            this.errors.push(error);
            console.error('Error al eliminar:', error);
          });
    },
    confirmDeleteHealthPlan(plan) {
      this.$confirm.require({
        message: `¿Estás seguro de eliminar el plan "${plan.name}"?`,
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, eliminar',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-danger',
        accept: () => this.deleteHealthPlan(plan),
        reject: () => {}
      });
    },
    onCancelRequested() {
      this.showDialog = false;
      this.submitted = false;
      this.isEdit = false;
    },
    onSaveRequested(item) {
      console.log('onSaveRequested');
      this.submitted = true;
      if (this.healthPlan.name.trim()) {
        if (item.id) {
          this.updateHealthPlan();
        } else {
          this.createHealthPlan();
        }
        this.showDialog = false;
        this.isEdit = false;
      }
    },
    onNewItem() {
      this.healthPlan = new HealthPlan({});
      this.isEdit = false;
      this.submitted = false;
      this.showDialog = true;
      console.log(this.showDialog);
    },
    createHealthPlan() {
      this.healthPlanService.create(this.healthPlan).then(response => {
        let healthPlan = new HealthPlan(response.data);
        this.healthPlans.push(healthPlan);
        this.notifySuccessfulAction("HealthPlan Created");
      }).catch(error => console.error(error));
    }
  },
  computed: {
    uniqueCreadorCount() {
      const ids = new Set(this.healthPlans.map(plan => plan.creadorId));
      return ids.size;
    }
  },
  created() {
    this.healthPlanService = new HealthPlanService();
    this.getAllHealthPlans();
  }
}
</script>

<template>
  <p>Total de creadores únicos: {{ uniqueCreadorCount }}</p>
  <div class="mb-4">
    <pv-button
        label="Mostrar todos"
        class="p-button-secondary mr-2 mb-2"
        @click="resetToAll"
    />
    <pv-button
        v-for="id in creatorIds"
        :key="id"
        class="p-button-outlined mr-2 mb-2"
        :label="'Creador ' + id"
        @click="getPlansByCreator(id)"
    />
  </div>
  <div class="mb-4">
    <pv-button class="mr-2" icon="pi pi-plus" label="New" severity="success" @click="onNewItem"/>
  </div>
  <health-plan-list v-if="errors" :health-plans="healthPlans" @edit-plan="editHealthPlan($event)"
                    @delete-plan="confirmDeleteHealthPlan($event)"/>
  <health-plan-item-create-and-edit
      :isEdit="isEdit"
      :item="healthPlan"
      :visible="showDialog"
      @cancel-requested="onCancelRequested"
      @save-requested="onSaveRequested($event)"/>
</template>

<style scoped>
</style>