<script>
import {Meal} from "@/publishing/model/meal.entity.js";
import {MealService} from "@/publishing/services/meal.service.js";
import IngredientList from "@/publishing/components/ingredient-list.component.vue";
import InstructionList from "@/publishing/components/instruction-list.component.vue";

export default {
  name: "meal-list",
  components: {InstructionList, IngredientList},
  props: {
    healthPlanId: {
      type: Number,
      required: true
    }
  },
  data(){
    return {
      meals: [],
      meal: new Meal({}),
      mealService: null,
      errors: [],
      defaultImage: "https://via.placeholder.com/300x200?text=Exercise+Image",
    }
  },
  methods: {
    getMealsByHealthPlanId(healthPlanId){
      this.mealService.getByHealthPlanId(healthPlanId).then(response => {
        this.meals = response.data.map(meal => new Meal(meal));
        console.log(this.meals);
      }).catch(error => { this.errors.push(error); this.meals = []; console.log(error); })
    },
  },
  created(){
    this.mealService = new MealService();
    this.getMealsByHealthPlanId(this.healthPlanId);
  }
}
</script>

<template>
  <div class="meal-list-container">
    <pv-data-view :value="meals" layout="list" dataKey="id">
      <template #list="slotProps">
        <div class="grid grid-nogutter">
          <div v-for="(meal, index) in slotProps.items" :key="meal.id" class="col-12">
            <!-- Contenedor principal flex -->
            <div class="flex flex-column md:flex-row p-3 w-full gap-5"
                 :class="{'surface-50': index % 2 === 0, 'surface-0': index % 2 !== 0}">

              <!-- Columna izquierda (Título + Imagen) -->
              <div class="flex flex-column align-items-start gap-3 w-full md:w-4">
                <h3 class="text-xl font-bold m-0">Comida {{ index + 1 }}</h3>
                <pv-image :src="meal.image || defaultImage"
                          alt="meal"
                          width="100%"
                          height="250"
                          class="border-round shadow-2"
                          preview>
                  <template #previewicon>
                    <i class="pi pi-search"></i>
                  </template>
                </pv-image>
              </div>

              <!-- Columna derecha (Ingredientes + Instrucciones) -->
              <div class="flex flex-column md:flex-row gap-5 w-full md:w-8">
                <!-- Ingredientes -->
                <div class="w-full md:w-6">
                  <h4 class="font-medium text-lg mb-3">Ingredientes</h4>
                  <ingredient-list :meal-id="meal.id"/>
                </div>

                <!-- Instrucciones -->
                <div class="w-full md:w-6">
                  <h4 class="font-medium text-lg mb-3">Instrucciones</h4>
                  <instruction-list :meal-id="meal.id"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </pv-data-view>
  </div>
</template>


<style scoped>
.meal-list-container {
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