<script>
import {HealthPlan} from "@/publishing/model/health-plan.entity.js";

export default {
  name: "health-plan-card",
  emits: ["view", "edit", "delete"],
  props: {
    plan: {
      type: HealthPlan,
      required: true
    }
  },
  methods: {
    // Métodos para emitir eventos al componente padre
    viewPlan() {
      // Emitimos un evento 'view' con el ID del plan
      this.$emit('view', this.plan.id);
    },
    editPlan() {
      // Emitimos un evento 'edit' con el objeto plan completo (o solo el ID, según lo que necesite el padre)
      this.$emit('edit', this.plan);
    },
    deletePlan() {
      // Emitimos un evento 'delete' con el ID del plan
      this.$emit('delete', this.plan.id);
    }
  }
}
</script>

<template>
  <pv-card class="health-plan-card">
    <template #header>
      <div class="card-header-custom flex justify-content-between align-items-center p-3 bg-primary text-white border-round-top">
        <span class="plan-name text-xl font-semibold">{{ plan.planName }}</span>
      </div>
    </template>

    <template #content>
      <div class="card-content-custom p-4 flex-grow-1">
        <p class="plan-description mb-3 text-sm text-secondary line-height-3">
          {{ plan.description }}
        </p>

        <div class="detail-item flex justify-content-between mb-2 pb-1 border-bottom-1 surface-border">
          <span class="detail-label font-semibold text-secondary">Objetivo:</span>
          <span class="detail-value text-color">{{ plan.objective }}</span>
        </div>

        <div class="detail-item flex justify-content-between mb-2 pb-1 border-bottom-1 surface-border">
          <span class="detail-label font-semibold text-secondary">Duración:</span>
          <span class="detail-value text-color">{{ plan.durationValue }} {{ plan.durationType }}</span>
        </div>

        <div class="detail-item flex justify-content-between mb-2 pb-1 border-bottom-1 surface-border">
          <span class="detail-label font-semibold text-secondary">Precio:</span>
          <span class="detail-value text-color">{{ plan.currency }} {{ plan.priceValue }}</span>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="card-actions-custom flex justify-content-end gap-2 p-3 bg-surface-100 border-top-1 surface-border">
        <pv-button label="Ver" icon="pi pi-eye" severity="info" @click="viewPlan" rounded/>
        <pv-button label="Editar" icon="pi pi-pencil" severity="warn" @click="editPlan" rounded/>
        <pv-button label="Eliminar" icon="pi pi-trash" severity="danger" @click="deletePlan" rounded/>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
.health-plan-card {
  /* Elimina width: 100% */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  box-sizing: border-box;
}
</style>