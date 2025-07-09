<script>
import {HealthPlan} from "@/publishing/model/health-plan.entity.js";

export default {
  name: "health-plan-sidebar",
  props: {
    healthPlan: {
      type: HealthPlan,
      required: true
    }
  },
  methods: {
    // Estos métodos emiten eventos al componente padre, que es quien manejará la lógica real
    onEditPlan() {
      this.$emit('edit-plan', this.healthPlan);
    },
    onDeletePlan() {
      this.$emit('delete-plan', this.healthPlan.id);
    }
  }
}
</script>

<template>
  <div class="health-plan-sidebar flex flex-column gap-4">
    <pv-card>
      <template #header>
        <div class="p-card-header p-card-title p-2">
          <h3 class="m-0 text-color-secondary">{{ healthPlan.planName || 'No disponible' }}</h3>
        </div>
      </template>
      <template #content>
        <div class="p-card-content">
          <div class="field mb-3">
            <label class="font-bold text-color-secondary block mb-1">Descripción:</label>
            <p class="m-0 text-color-secondary">{{ healthPlan.description || 'No disponible' }}</p>
          </div>
          <pv-divider/>

          <div class="field mb-3">
            <label class="font-bold text-color-secondary block mb-1">Objetivo:</label>
            <p class="m-0 text-color-secondary">{{ healthPlan.objective || 'No disponible' }}</p>
          </div>
          <pv-divider/>

          <div class="field mb-3">
            <label class="font-bold text-color-secondary block mb-1">Duración:</label>
            <span class="text-color-secondary">
              {{ healthPlan.durationValue ? `${healthPlan.durationValue} ${healthPlan.durationType}` : 'No disponible' }}
            </span>
          </div>
          <pv-divider/>

          <div class="field mb-3">
            <label class="font-bold text-color-secondary block mb-1">Precio:</label>
            <span class="text-color-secondary">
              {{ healthPlan.priceValue ? `${healthPlan.currency} ${healthPlan.priceValue.toFixed(2)}` : 'No disponible' }}
            </span>
          </div>
        </div>
      </template>
    </pv-card>

    <pv-card>
      <template #header>
        <div class="p-card-header p-card-title p-2">
          <h3 class="m-0 text-color-secondary">Acciones del Plan</h3>
        </div>
      </template>
      <template #content>
        <div class="p-card-content flex flex-column gap-3">
          <pv-button label="Editar Plan" icon="pi pi-pencil" class="p-button-primary" @click="onEditPlan" />
          <pv-button label="Eliminar Plan" icon="pi pi-trash" class="p-button-danger" @click="onDeletePlan" />
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
/* Estilos para el texto dentro de las tarjetas */
.field label {
  font-size: 0.9rem;
}

.field p, .field span {
  font-size: 1rem;
}
</style>