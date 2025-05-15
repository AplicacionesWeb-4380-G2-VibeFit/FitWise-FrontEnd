<script>
import { Schedule } from "../model/schedule.entity.js";

export default {
  name: "schedule-info",
  props: {
    schedule: {
      type: Schedule,
      required: true
    }
  }
}
</script>

<template>
  <pv-panel :header="schedule.date" toggleable>
    <pv-divider/>
    <!-- User -->
    <div class="flex align-items-center gap-2">
      <pv-chip label="User" icon="pi pi-clock" />
      <pv-chip :label="schedule.userId"/>
    </div>

    <!-- Health Plan -->
    <div class="flex align-items-center gap-2">
      <pv-chip label="Health_Plan" icon="pi pi-clock" />
      <pv-chip :label="schedule.healthPlanId"/>
    </div>

  </pv-panel>
</template>

<style scoped>

</style>