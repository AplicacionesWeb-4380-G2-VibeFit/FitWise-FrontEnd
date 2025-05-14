<script>
import {HealthPlan} from "@/publishing/model/health-plan.entity.js";
import {HealthPlanService} from "@/publishing/services/health-plan.service.js";

export default {
  name: "health-plan-management",
  data() {
    return {
      healthPlans: [],
      healthPlan: new HealthPlan({}),
      healthPlanService: null
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
      this.healthPlanService = new HealthPlanService();
      this.healthPlanService.getAll().then(response => {
        console.log(response)
        this.healthPlans = response.data.map(healthPlan => new HealthPlan(healthPlan));
        console.log(this.healthPlans);
      }).catch(error => console.log(error));
    }
  },
  created() {
    this.getAllHealthPlans();
  }
}
</script>

<template>
    <h1>Miguelito</h1>
</template>

<style scoped>

</style>