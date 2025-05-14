<script>
import {Exercise} from "@/publishing/model/exercise.entity.js";
import {ExerciseService} from "@/publishing/services/exercise.service.js";

export default {
  name: "exercise-list",
  props: {
    healthPlanId: {
      type: Number,
      required: true
    }
  },
  data(){
    return{
      exercises: [],
      exercise: new Exercise({}),
      exerciseService: null,
      errors: [],
      defaultImage: "https://via.placeholder.com/300x200?text=Exercise+Image"
    }
  },
  methods: {
    getExercisesByHealthPlanId(healthPlanId){
      this.exerciseService.getByHealthPlanId(healthPlanId).then(response => {
        this.exercises = response.data.map(exercise => new Exercise(exercise));
        console.log(this.exercises);
      }).catch(error => { this.errors.push(error); this.exercises = []; console.log(error); })
    }
  },
  created() {
    this.exerciseService = new ExerciseService();
    this.getExercisesByHealthPlanId(this.healthPlanId);
  }
}
</script>

<template>
  <div class="exercise-list-container">
    <pv-data-view :value="exercises" layout="list" dataKey="id">
      <template #list="slotProps">
        <div class="grid grid-nogutter">
          <div v-for="(exercise, index) in slotProps.items" :key="exercise.id"
               class="col-12 exercise-item p-3">
            <div class="flex flex-column md:flex-row align-items-center p-3 w-full gap-3"
                 :class="{'surface-50': index % 2 === 0, 'surface-0': index % 2 !== 0}">
              <pv-image :src="exercise.image || defaultImage" :alt="exercise.name" width="250" preview>
                <template #previewicon>
                  <i class="pi pi-search"></i>
                </template>
              </pv-image>
              <div class="flex-1 flex flex-column align-items-start gap-2">
                <div class="text-xl font-bold">{{ exercise.name }}</div>
                <div class="text-sm">{{ exercise.description }}</div>
              </div>
              <pv-button icon="pi pi-chevron-right"
                      class="p-button-rounded p-button-text"
                      @click="$emit('exercise-selected', exercise)" />
            </div>
          </div>
        </div>
      </template>

      <template #empty>
        <div class="flex justify-content-center p-5">
          <div class="text-center">
            <i class="pi pi-search text-6xl text-400 mb-3"></i>
            <div class="text-xl font-medium">No exercises found</div>
            <p class="text-500">Try a different health plan</p>
          </div>
        </div>
      </template>
    </pv-data-view>
  </div>
</template>

<style scoped>
.exercise-list-container {
  width: 100%;
}

.exercise-item {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.exercise-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>