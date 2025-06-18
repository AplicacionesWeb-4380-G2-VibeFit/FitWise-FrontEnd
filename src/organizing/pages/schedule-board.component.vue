<template>
  <div class="board-container">
    <h1>Organización de Entrenamientos</h1>

    <!-- Aquí podrías agregar filtros o widgets -->

    
    <ScheduleListV2/>
  </div>
</template>

<script>
import ScheduleListComponent from '@/organizing/components/schedule-list.component.vue';
import ScheduleListV2 from "@/organizing/components/schedule-list-v2.vue";
export default {
  name: 'ScheduleBoardComponent',
  components:{ ScheduleListComponent, ScheduleListV2 }
}
</script>

<style scoped>
.board-container {
  padding: 2rem;
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}
</style>
