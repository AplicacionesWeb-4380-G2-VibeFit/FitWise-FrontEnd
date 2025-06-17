<template>
  <div class="card">
    <h2>Gestión de Horarios</h2>

    <DataTable
        ref="dt"
        :value="schedules"
        dataKey="id"
        paginator
        :rows="5"
        editMode="row"
        v-model:editingRows="editingRows"
        class="p-datatable-gridlines"
        @row-edit-init="onRowEditInit"
        @row-edit-save="onRowEditSave"
    >
      <Column field="userId" header="Usuario">
        <template #body="{ data }">
          {{ getUserName(data.userId) }}
        </template>
        <template #editor="{ data }">
          <Dropdown
              v-model="data.userId"
              :options="users"
              optionLabel="username"
              optionValue="id"
              placeholder="Selecciona un usuario"
          />
        </template>
      </Column>

      <Column field="healthPlanId" header="Plan de Salud">
        <template #body="{ data }">
          {{ getPlanName(data.healthPlanId) }}
        </template>
        <template #editor="{ data }">
          <Dropdown
              v-model="data.healthPlanId"
              :options="healthPlans"
              optionLabel="healthPlans"
              optionValue="id"
              placeholder="Selecciona un plan de salud"
          />
        </template>
      </Column>

      <Column field="startDate" header="Fecha de Inicio">
        <template #body="{ data }">
          {{ data.startDate }}
        </template>
        <template #editor="{ data }">
          <Calendar
              v-model="data.startDate"
              dateFormat="yy-mm-dd"
              placeholder="Selecciona una fecha"
          />
        </template>
      </Column>


      <Column header="Acciones" bodyStyle="text-align: center">
        <template #body="{ data, index }">
          <Button icon="pi pi-pencil" @click="editRow(data)" v-if="!editingRows[data.id]" />
          <Button icon="pi pi-check" class="p-button-success" @click="saveRow(data)" v-else />
          <Button icon="pi pi-trash" class="p-button-danger" @click="deleteRow(data.id)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';

import { ScheduleService } from '@/organizing/services/schedule.service.js';
import { UserService } from '@/presenting/services/user.service.js';
import { HealthPlanService } from '@/organizing/services/healthPlan.service.js';

export default {
  name: 'ScheduleListComponent',
  components: {
    DataTable,
    Column,
    Button,
    Dropdown,
    Calendar
  },
  data() {
    return {
      schedules: [],
      editingRows: {} ,
      users: [],
      healthPlans: []
    };
  },
  async mounted() {
    const scheduleService = new ScheduleService();
    const userService = new UserService();
    const planService = new HealthPlanService();

    const [sRes, uRes, hRes] = await Promise.all([
      scheduleService.getAll(),
      userService.getAll(),
      planService.getAll()
    ]);

    console.log("Usuarios cargados:", this.users);
    console.log("Planes de salud cargados:", this.healthPlans);


    this.schedules = sRes.data;
    this.users = uRes.data;
    this.healthPlans = hRes.data;
  },
  methods: {
    onRowEditInit(event) {
      this.editingRows = { ...this.editingRows, [event.data.id]: true };
    },
    onRowEditSave(event) {
      this.saveRow(event.data);
    },

    // Guardar fila editada
    async saveRow(rowData) {
      const service = new ScheduleService();
      await service.update(rowData.id, rowData);
      this.editingRows = {};
    },

    // Activar edición
    editRow(rowData) {
      this.editingRows = { ...this.editingRows, [rowData.id]: true };
    },

    // Eliminar horario
    async deleteRow(id) {
      const service = new ScheduleService();
      await service.delete(id);
      this.schedules = this.schedules.filter((s) => s.id !== id);
    },

    getUserName(userId) {
      const user = this.users.find(u => u.id === userId);
      return user ? user.userName : '---';
    },

    getPlanName(planId) {
      const plan = this.healthPlans.find(p => p.id === planId);
      return plan ? plan.name : '---';
    }

  }
};
</script>

<style scoped>
h2 {
  margin-bottom: 1rem;
}
</style>
