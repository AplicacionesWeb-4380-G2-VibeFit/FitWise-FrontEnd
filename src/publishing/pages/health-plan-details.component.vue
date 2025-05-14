<script>
import HealthPlanInfo from "@/publishing/components/health-plan-info.component.vue";
import {HealthPlan} from "@/publishing/model/health-plan.entity.js";
import {HealthPlanService} from "@/publishing/services/health-plan.service.js";

export default {
  name: "health-plan-details",
  components: {HealthPlanInfo},
  data() {
    return {
      healthPlan: new HealthPlan({}),
      healthPlanService: null,
      errors: [],
    };
  },
  methods: {
    getHealthPlanById(id) {
      this.healthPlanService.getById(id).then(response => {
        console.log(response);
        this.healthPlan = new HealthPlan(response.data);
        console.log(this.healthPlan);
      }).catch(error => { this.errors.push(error); this.healthPlan = null; console.log(error); });
    }
  },
  created() {
    this.healthPlanService = new HealthPlanService();
    const id = Number(this.$route.params.id);
    this.getHealthPlanById(id);
  }
}
</script>

<template>
  <health-plan-info :health-plan="healthPlan"/>
</template>

<style scoped>

</style>