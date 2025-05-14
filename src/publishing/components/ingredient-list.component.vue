<script>
import {Ingredient} from "@/publishing/model/ingredient.entity.js";
import {IngredientService} from "@/publishing/services/ingredient.service.js";

export default {
  name: "ingredient-list",
  props: {
    mealId: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      ingredients: [],
      ingredient: new Ingredient({}),
      ingredientService: null,
      errors: []
    }
  },
  methods: {
    getAllIngredientsByMealId(mealId) {
      this.ingredientService.getByMealId(mealId).then(response => {
        //console.log(response);
        this.ingredients = response.data.map(ingredient => new Ingredient(ingredient));
      }).catch(error => { this.errors.push(error); this.ingredients = []; console.log(error); });
    }
  },
  created() {
    this.ingredientService = new IngredientService();
    this.getAllIngredientsByMealId(this.mealId);
  }
}
</script>

<template>
  <ul class="list-disc pl-4 m-0">
    <li v-for="ing in ingredients" :key="ing.id" class="mb-2">
      <span class="font-semibold">{{ ing.name }}</span>: {{ ing.description }}
    </li>
  </ul>
</template>

<style scoped>

</style>