<script>
import EditAndDeleteComponent from "@/shared/components/edit-and-delete.component.vue";

export default {
  name: "health-plan-list",
  components: {EditAndDeleteComponent},
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
    },
    editPlan(plan) {
      this.$emit('edit-plan', plan); // Emite evento al padre
    },
    confirmDeletePlan(plan) {
      this.$emit('delete-plan', plan); // Emite evento al padre
    }
  }
}
</script>

<template>
  <div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <pv-card v-for="plan in healthPlans" :key="plan.id" class="shadow-md">
      <template #title>{{ plan.name }}
      </template>
      <template #subtitle>{{ plan.objective }}</template>
      <template #content>
        <p><strong>Duración:</strong> {{ plan.duration }}</p>
        <p><strong>Precio:</strong> ${{ plan.price }}</p>
        <p class="mt-2">{{ plan.description }}</p>
      </template>
      <template #footer>
        <div class="flex justify-content-between align-items-center">
          <div class="flex items-center gap-2">
            <pv-button
                label="Ver más"
                icon="pi pi-eye"
                class="p-button-sm p-button-outlined"
                @click="goToDetails(plan.id)"
            />
            <edit-and-delete-component
                :data="plan"
                @edit="editPlan($event)"
                @delete="confirmDeletePlan($event)"
                size="small"
            />
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
pv-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  transition: transform 0.2s;
}

pv-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>