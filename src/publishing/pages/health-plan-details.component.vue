<script>
import HealthPlanInfo from "@/publishing/components/health-plan-info.component.vue";
import {HealthPlan} from "@/publishing/model/health-plan.entity.js";
import {HealthPlanService} from "@/publishing/services/health-plan.service.js";
import ExerciseList from "@/publishing/components/exercise-list.component.vue";

export default {
  name: "health-plan-details",
  components: {ExerciseList, HealthPlanInfo},
  data() {
    return {
      healthPlan: new HealthPlan({}),
      healthPlanService: null,
      errors: [],
      id: null,
    };
  },
  methods: {
    getHealthPlanById(id) {
      this.healthPlanService.getById(id).then(response => {
        this.healthPlan = new HealthPlan(response.data);
      }).catch(error => { this.errors.push(error); this.healthPlan = null; console.log(error); });
    }
  },
  created() {
    this.healthPlanService = new HealthPlanService();
    this.id = Number(this.$route.params.id);
    this.getHealthPlanById(this.id);
  }
}
</script>

<template>
  <health-plan-info :health-plan="healthPlan"/>
  <exercise-list :health-plan-id="id"/>
</template>

<style scoped>

</style>