<template>
  <div class="schedule-management-container">
    <div class="header-bar">
      <Button
          label="➕ Agregar Horario"
          icon="pi pi-plus"
          class="add-button"
          @click="startCreate"
      />
    </div>

    <ScheduleForm
        v-if="showForm"
        :schedule="currentSchedule"
        :isEditing="isEditing"
        :users="users"
        :healthPlans="healthPlans"
        @saved="handleSaved"
        @cancelled="showForm = false"
    />

    <ScheduleList
        v-else
        :schedules="schedules"
        :users="users"
        :healthPlans="healthPlans"
        @delete-schedule="handleDelete"
        @edit-schedule="startEdit"
    />
  </div>
</template>

<script>
import { Schedule } from "@/organizing/model/schedule.entity.js";
import { ScheduleService } from "@/organizing/services/schedule.service.js";
import { UserService } from "@/presenting/services/user.service.js";
import { HealthPlanService } from "@/publishing/services/health-plan.service.js";
import ScheduleList from "@/organizing/components/schedule-list.component.vue";
import ScheduleForm from "@/organizing/components/schedule-form.component.vue";
import ConfirmDialog from 'primevue/confirmdialog';
import Button from 'primevue/button';

export default {
  name: "schedule-management",
  components: { ScheduleList, ScheduleForm, ConfirmDialog, Button },
  data() {
    return {
      schedules: [],
      users: [],
      healthPlans: [],
      showForm: false,
      isEditing: false,
      currentSchedule: new Schedule({}),
      service: new ScheduleService()
    };
  },
  async created() {
    const userService = new UserService();
    const planService = new HealthPlanService();

    const [sRes, uRes, hRes] = await Promise.all([
      this.service.getAll(),
      userService.getAll(),
      planService.getAll()
    ]);

    this.schedules = sRes.data;
    this.users = uRes.data;
    this.healthPlans = hRes.data;
  },
  methods: {
    reloadSchedules() {
      this.service.getAll().then(res => this.schedules = res.data);
    },
    startCreate() {
      this.currentSchedule = new Schedule({});
      this.isEditing = false;
      this.showForm = true;
    },
    startEdit(schedule) {
      this.currentSchedule = { ...schedule };
      this.isEditing = true;
      this.showForm = true;
    },
    handleSaved(newSchedule) {
      this.showForm = false;
      if (!this.isEditing) {
        this.schedules.push(newSchedule);
      } else {
        this.reloadSchedules();
      }
    },
    handleDelete(id) {
      console.log("handleDelete triggered for ID:", id);
      this.$confirm.require({
        message: '¿Estás seguro de eliminar este horario?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.service.delete(id).then(() => {
            this.$toast.add({ severity: 'info', summary: 'Eliminado', detail: 'Horario eliminado', life: 3000 });
            this.reloadSchedules();
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.schedule-management-container {
  padding: 2rem;
  background-color: gray;
  border-radius: 8px;
}

.header-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.add-button {
  background: linear-gradient(90deg, #28a745, #218838);
  border: none;
  color: white;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 8px;
  transition: background 0.3s ease;
}
.add-button:hover {
  background: linear-gradient(90deg, #218838, #1e7e34);
}
</style>
