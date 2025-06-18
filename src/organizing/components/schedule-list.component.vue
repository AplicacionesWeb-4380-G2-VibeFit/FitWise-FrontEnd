<template>
  <DataTable
      :value="schedules"
      dataKey="id"
      class="green-table"
      paginator :rows="5"
  >
    <Column field="userId" header="👤 Usuario">
      <template #body="{ data }">{{ getUserName(data.userId) }}</template>
    </Column>

    <Column field="healthPlanId" header="📋 Plan de Salud">
      <template #body="{ data }">{{ getPlanName(data.healthPlanId) }}</template>
    </Column>

    <Column field="date" header="📅 Fecha">
      <template #body="{ data }">{{ data.date }}</template>
    </Column>

    <Column header="⚙ Acciones" bodyStyle="text-align: center">
      <template #body="{ data }">
        <Button class="edit-button mr-2" @click.stop="$emit('edit-schedule', data)">
          <i class="pi pi-pencil"></i>
        </Button>
        <Button class="delete-button" @click.stop="$emit('delete-schedule', data.id)">
          <i class="pi pi-trash"></i>
        </Button>
      </template>
    </Column>
  </DataTable>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

export default {
  name: "schedule-list",
  components: {DataTable, Column, Button},
  props: {
    schedules: Array,
    users: Array,
    healthPlans: Array
  },
  methods: {
    getUserName(id) {
      const u = this.users.find(u => u.id === id);
      return u ? u.username : '---';
    },
    getPlanName(id) {
      const p = this.healthPlans.find(p => p.id === id);
      return p ? p.name : '---';
    }
  }
};
</script>

<style scoped>
.green-table ::v-deep(.p-datatable-thead > tr > th) {
  background-color: #1e7e34;
  color: #fff;
  font-weight: bold;
  text-align: center;
}

.green-table ::v-deep(.p-datatable-tbody > tr) {
  background-color: #2e8b57;
  color: #fff;
}

.green-table ::v-deep(.p-datatable-tbody > tr:hover) {
  background-color: #256d46 !important;
}

.edit-button {
  background-color: #28a745;
  border: none;
  color: white;
}

.edit-button:hover {
  background-color: #1c5d2f;
}

.delete-button {
  background-color: #6bbf59;
  border: none;
  color: white;
}

.delete-button:hover {
  background-color: #4e9b3e;
}
</style>
