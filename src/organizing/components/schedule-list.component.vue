<script>
import {Card as PvCard} from "primevue";

export default {
  name: "schedule-list",
  components: {PvCard},
  props: {
    Schedules: {
      schedules: Array,
      required: true
    }
  },
}
</script>

<template>
  <div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <pv-card v-for="schedule in Schedules" :key="schedule.id" class="shadow-md">
      <template #title>{{ schedule.date }}</template>
      <template #content>
        <p><strong>User:</strong> ${{schedule.userId}}</p>
        <p><strong>Health Plan:</strong> ${{schedule.healthPlanId}}</p>
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