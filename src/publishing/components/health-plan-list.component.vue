<script>
export default {
  name: "health-plan-list",
  props: {
    healthPlans: {
      type: Array,
      required: true
    }
  },
  methods: {
    goToDetails(planId) {
      console.log(this.$router);
      this.$router.push({ name: 'details', params: { id: planId } });
    }
  }
}
</script>

<template>
  <div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <pv-card v-for="plan in healthPlans" :key="plan.id" class="shadow-md">
      <template #title>{{ plan.name }}</template>
      <template #subtitle>{{ plan.objective }}</template>
      <template #content>
        <p><strong>Duración:</strong> {{ plan.duration }}</p>
        <p><strong>Precio:</strong> ${{ plan.price }}</p>
        <p class="mt-2">{{ plan.description }}</p>
      </template>
      <template #footer>
        <pv-button label="Ver más" icon="pi pi-eye" class="p-button-sm" @click="goToDetails(plan.id)"/>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
pv-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
}
</style>