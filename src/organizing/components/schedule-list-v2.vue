<script setup>
import { ScheduleService } from '@/organizing/services/schedule.service';
import { FilterMatchMode } from '@primevue/core/api';

import { Button, Toolbar, InputIcon, InputText, IconField, Column, DataTable, Dialog, } from "primevue";
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const scheduleService = new ScheduleService();

onMounted(() => {
  console.log('ScheduleService instance:', scheduleService);
  scheduleService.getAll()
    .then((data) => {
      console.log('Fetched schedules:', data);
      schedules.value = data;
    })
    .catch((error) => {
      console.error('Error fetching schedules:', error);
    });
});

const toast = useToast();
const dt = ref();
const schedules = ref();
const scheduleDialog = ref(false);
const deleteScheduleDialog = ref(false);
const deleteSchedulesDialog = ref(false);
const schedule = ref({});
const selectedSchedules = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

function openNew() {
  schedule.value = {};
  submitted.value = false;
  scheduleDialog.value = true;
}

function hideDialog() {
  scheduleDialog.value = false;
  submitted.value = false;
}

function saveSchedule() {
  submitted.value = true;

  if (schedule?.value.name?.trim()) {
    if (schedule.value.id) {
      schedules.value[findIndexById(schedule.value.id)] = schedule.value;
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
    } else {
      schedule.value.id = createId();
      schedule.value.push(schedule.value);
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
    }

    scheduleDialog.value = false;
    schedule.value = {};
  }
}
function editSchedule(sched) {
  schedule.value = { ...sched };
  scheduleDialog.value = true;
}

function confirmDeleteSchedule(sched) {
  schedule.value = sched;
  deleteScheduleDialog.value = true;
}

function deleteProduct() {
  schedules.value = schedules.value.filter((val) => val.id !== schedule.value.id);
  deleteScheduleDialog.value = false;
  schedule.value = {};
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
}

function findIndexById(id) {
  let index = -1;
  for (let i = 0; i < schedules.value.length; i++) {
    if (schedules.value[i].id === id) {
      index = i;
      break;
    }
  }

  return index;
}

function createId() {
  const ids = schedules.value.map(schedule => parseInt(schedule.id, 10)).filter(id => !isNaN(id));
  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  return (maxId + 1).toString();
}

function exportCSV() {
  dt.value.exportCSV();
}

function confirmDeleteSelected() {
  deleteSchedulesDialog.value = true;
}
function deleteSelectedSchedules() {
  schedules.value = schedules.value.filter(val => !selectedSchedules.value.includes(val));
  deleteSchedulesDialog.value = false;
  selectedSchedules.value = null;
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
}


</script>

<template>

  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
          <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedSchedules || !selectedSchedules.length" />
        </template>

        <template #end>
          <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
        </template>
      </Toolbar>
      <DataTable
          ref="dt"
          v-model:selection="selectedSchedules"
          :value="schedules"
          dataKey="id"
          :paginator="true"
          :rows="5"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Manage Schedules</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Search..." />
            </IconField>
          </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column field="user" header="Usuario" sortable style="min-width: 12rem"></Column>
        <Column field="healthPlan" header="Health Plan" sortable style="min-width: 16rem"></Column>
        <Column field="date" header="Date" sortable style="min-width: 12rem"></Column>

        <Column :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editSchedule(slotProps.data)" />
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteSchedule(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="scheduleDialog" :style="{ width: '450px' }" header="Product Details" :modal="true">
      <div class="flex flex-col gap-6">
        <div>
          <label for="user" class="block font-bold mb-3">User</label>
          <InputText id="user" v-model.trim="schedule.userId" required="true" autofocus :invalid="submitted && !schedule.userId" fluid />
          <small v-if="submitted && !schedule.userId" class="text-red-500">User is required.</small>
        </div>
        <div>
          <label for="healthPlan" class="block font-bold mb-3">User</label>
          <InputText id="healthPlan" v-model.trim="schedule.healthPlanId" required="true" autofocus :invalid="submitted && !schedule.healthPlanId" fluid />
          <small v-if="submitted && !schedule.healthPlanId" class="text-red-500">Health Plan is required.</small>
        </div>
        <
        <div>
          <label for="date" class="block font-bold mb-3">User</label>
          <InputText id="date" v-model.trim="schedule.startDate" required="true" autofocus :invalid="submitted && !schedule.startDate" fluid />
          <small v-if="submitted && !schedule.startDate" class="text-red-500">Date is required.</small>
        </div>
        
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" @click="saveSchedule" />
      </template>
    </Dialog>
    <Dialog v-model:visible="deleteScheduleDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="schedule"
        >Are you sure you want to delete <b>{{ schedule.id }}</b
        >?</span
        >
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteScheduleDialog = false" />
        <Button label="Yes" icon="pi pi-check" @click="deleteProduct" />
      </template>
    </Dialog>
    <Dialog v-model:visible="deleteSchedulesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="schedule">Are you sure you want to delete the selected schedules?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteSchedulesDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedSchedules" />
      </template>
    </Dialog>
    
  </div>
  
</template>

<style scoped>

</style>