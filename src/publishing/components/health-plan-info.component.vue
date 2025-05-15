<script>
import {HealthPlan} from "@/publishing/model/health-plan.entity.js";

export default {
  name: "health-plan-info",
  props: {
    healthPlan: {
      type: HealthPlan,
      required: true
    }
  }
}
</script>

<template>
  <pv-panel :header="healthPlan.name" toggleable>
    <!-- Objetivo -->
    <div class="mb-3">
      <p class="text-lg font-semibold"><i class="pi pi-bullseye mr-2"></i>Objetivo</p>
      <p class="ml-4">{{ healthPlan.objective }}</p>
    </div>

    <pv-divider />

    <!-- Chips informativos -->
    <div class="flex flex-wrap align-items-center gap-3 mb-3">
      <!-- Duración -->
      <div class="flex align-items-center gap-2">
        <pv-chip label="Duración" icon="pi pi-clock" />
        <pv-chip :label="healthPlan.duration"/>
      </div>

      <!-- Precio -->
      <div class="flex align-items-center gap-2">
        <pv-chip label="Precio" icon="pi pi-dollar"/>
        <pv-chip :label="`$${healthPlan.price.toFixed(2)}`" />
      </div>
    </div>

    <pv-divider />

    <!-- Descripción -->
    <div>
      <p class="text-lg font-semibold mb-2"><i class="pi pi-align-left mr-2"></i>Descripción</p>
      <p class="ml-4">{{ healthPlan.description }}</p>
    </div>
  </pv-panel>
</template>

<style scoped>

</style>