<script>

import {Schedule} from "@/organizing/model/schedule.entity.js";
import {ScheduleService} from "@/organizing/services/schedule.service.js"
import ScheduleList from "@/organizing/components/schedule-list.component.vue";

export default {
  name: "schedule-management.component.vue",
  components: {ScheduleList},
  data(){
    return {
      schedules: [],
      schedule: new Schedule({}),
      scheduleService: null,
      errors: []
    }
  },
  methods: {
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },
    findIndexById(id) {
      return this.schedules.findIndex(schedule => schedule.id === id);
    },
    getAllSchedules() {
      this.scheduleService.getAll().then(response => {
        const rawScheds = response.data.map(schedule => new Schedule(schedule));
        this.schedules = rawScheds;
        console.log(this.schedules);
        // Obtain uniques userIds
        this.userIds = [...new Set(rawScheds.map(shed => shed.userId))];
        // Obtain uniques healthPlanIds
        this.healthPlanIds = [...new Set(rawScheds.map(shed => shed.userId))];
      }).catch(error => { this.errors.push(error); this.schedules = []; console.log(error); });
    },
    getPlansByUser(userId) {
      this.scheduleService.getByUserId(userId).then(response => {
        this.schedules = response.data.map(schedule => new Schedule(schedule));
        console.log(this.schedules);
      }).catch(error => { this.errors.push(error); this.schedules = []; console.log(error); });
    },
    getPlansByHealthPlan(healthPlanId) {
      this.scheduleService.getByHealthPlanId(healthPlanId).then(response => {
        this.schedules = response.data.map(schedule => new Schedule(schedule));
        console.log(this.schedules);
      }).catch(error => { this.errors.push(error); this.schedules = []; console.log(error); });
    },
    resetToAll() {
      this.getAllSchedules();
    }
  },
  computed: {
    uniqueUserCount() {
      const ids = new Set(this.schedules.map(shed => shed.userId));
      return ids.size;
    },
    uniqueHealthPlanCount() {
      const ids = new Set(this.schedules.map(shed => shed.healthPlanId));
      return ids.size;
    }
  },
  created() {
    this.scheduleService = new ScheduleService();
    this.getAllSchedules();
  }
}
</script>

<template>
  <p>Total de users únicos: {{uniqueUserCount}}</p>
  <div class="mb-4">
    <pv-button
        label="Mostrar todos"
        class="p-button-secondary mr-2 mb-2"
        @click="resetToAll"
    />
    <pv-button
        v-for="id in creatorIds"
        :key="id"
        class="p-button-outlined mr-2 mb-2"
        :label="'Creador ' + id"
        @click="getPlansByUser(id)"
    />
  </div>

  <p>Total de planes únicos: {{uniqueHealthPlanCount}}</p>
  <div class="mb-4">
    <pv-button
        label="Mostrar todos"
        class="p-button-secondary mr-2 mb-2"
        @click="resetToAll"
    />
    <pv-button
        v-for="id in creatorIds"
        :key="id"
        class="p-button-outlined mr-2 mb-2"
        :label="'Creador ' + id"
        @click="getPlansByHealthPlan(id)"
    />
  </div>
  <schedule-list v-if="errors" :schedules="schedules"/>
</template>

<style scoped>

</style>