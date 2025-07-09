<template>
  <div class="form-container p-4">
    <div class="p-field mb-3">
      <label class="form-label">👤 Usuario</label>
      <Dropdown v-model="localSchedule.userId" :options="users" optionLabel="username" optionValue="id" placeholder="Selecciona usuario" class="p-inputtext-lg" />
    </div>
    <div class="p-field mb-3">
      <label class="form-label">📋 Plan de Salud</label>
      <Dropdown v-model="localSchedule.healthPlanId" :options="healthPlans" optionLabel="name" optionValue="id" placeholder="Selecciona plan" class="p-inputtext-lg" />
    </div>
    <div class="p-field mb-3">
      <label class="form-label">📅 Fecha</label>
      <Calendar v-model="localSchedule.date" dateFormat="yy-mm-dd" placeholder="Selecciona fecha" class="p-inputtext-lg" />
    </div>
    <div class="mt-4 text-center">
      <Button label="Guardar" icon="pi pi-check" class="save-button mr-2" @click="save" />
      <Button label="Cancelar" icon="pi pi-times" class="cancel-button" @click="$emit('cancelled')" />
    </div>
  </div>
</template>

<script>
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import { ScheduleService } from "@/organizing/services/schedule.service.js";
import { Schedule } from "@/organizing/model/schedule.entity.js";

export default {
  name: "schedule-form",
  components: { Dropdown, Calendar, Button },
  props: {
    users: Array,
    healthPlans: Array,
    schedule: { type: Object, default: () => new Schedule({}) },
    isEditing: Boolean
  },
  data() {
    return {
      localSchedule: { ...this.schedule },
      service: new ScheduleService()
    };
  },
  methods: {
    save() {
      const action = this.isEditing
          ? this.service.update(this.localSchedule.id, this.localSchedule)
          : this.service.create(this.localSchedule);

      action.then((res) => {
        this.$toast.add({
          severity: 'success',
          summary: 'Guardado',
          detail: this.isEditing ? 'Horario actualizado' : 'Horario creado',
          life: 3000
        });
        this.$emit('saved', res.data);
      }).catch(err => {
        console.error("Error al guardar:", err);
      });
    }
  }
};
</script>

<style scoped>
.form-container {
  background-color: #d4edda;
  border-radius: 10px;
}
.form-label {
  font-weight: 600;
  color: #155724;
}
.save-button {
  background-color: #28a745;
  border: none;
  color: white;
}
.save-button:hover {
  background-color: #1e7e34;
}
.cancel-button {
  background-color: #6bbf59;
  border: none;
  color: white;
}
.cancel-button:hover {
  background-color: #4e9b3e;
}
</style>
