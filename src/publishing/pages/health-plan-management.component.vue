<script>
import {HealthPlan} from "@/publishing/model/health-plan.entity.js";
import {HealthPlanService} from "@/publishing/services/health-plan.service.js";
import HealthPlanList from "@/publishing/components/health-plan-list.component.vue";

export default {
  name: "health-plan-management",
  components: {HealthPlanList},
  data() {
    return {
      healthPlans: [],
      healthPlan: new HealthPlan({}),
      healthPlanService: null,
      errors: [],
      creatorIds: [],
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
  <health-plan-list v-if="errors" :health-plans="healthPlans"/>
</template>

<style scoped>
</style>