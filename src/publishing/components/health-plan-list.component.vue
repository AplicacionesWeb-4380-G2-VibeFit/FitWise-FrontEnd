<script>
import HealthPlanCard from "@/publishing/components/health-plan-card.component.vue";

export default {
  name: "health-plan-list",
  emits: ['viewPlan', 'editPlan', 'deletePlan'],
  components: {HealthPlanCard},
  props: {
    healthPlans: {
      type: Array,
      required: true,
    }
  },
  methods: {
    handleViewPlan(planId) {
      console.log('Re-emitting view event for plan ID:', planId);
      this.$emit('viewPlan', planId); // Emit a new event, perhaps 'viewPlan'
    },
    handleEditPlan(plan) {
      console.log('Re-emitting edit event for plan:', plan);
      this.$emit('editPlan', plan); // Emit a new event, perhaps 'editPlan'
    },
    handleDeletePlan(planId) {
      console.log('Re-emitting delete event for plan ID:', planId);
      this.$emit('deletePlan', planId); // Emit a new event, perhaps 'deletePlan'
    },
  }
}
</script>

<template>
  <div class="grid">
    <div
        v-for="plan in healthPlans"
        :key="plan.id"
        class="col-12 md:col-6 lg:col-3"
    >
      <health-plan-card
          :plan="plan"
          @view="handleViewPlan"
          @edit="handleEditPlan"
          @delete="handleDeletePlan"
      />
    </div>
  </div>
</template>

<style scoped>

</style>