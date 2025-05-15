<script>
import {Instruction} from "@/publishing/model/instruction.entity.js";
import {InstructionService} from "@/publishing/services/instruction.service.js";
import {OrderList as PvOrderList} from "primevue";

export default {
  name: "instruction-list",
  components: {PvOrderList},
  props: {
    mealId: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      instructions: [],
      intruction: new Instruction({}),
      instructionService: null,
      errors: []
    }
  },
  methods: {
    getAllInstructionsByMealId(mealId) {
      this.instructionService.getByMealId(mealId).then(response => {
        this.instructions = response.data.map(instruction => new Instruction(instruction));
        //console.log(this.instructions);
      }).catch(error => { this.errors.push(error); this.instructions = []; console.log(error); });
    }
  },
  computed: {
    sortedInstructions() {
      return [...this.instructions].sort((a, b) => a.position - b.position);
    }
  },
  created() {
    //console.log(this.mealId);
    this.instructionService = new InstructionService();
    this.getAllInstructionsByMealId(this.mealId);
  }
}
</script>

<template>
  <ol class="m-0 p-0 pl-4">
    <li
        v-for="(instruction, index) in sortedInstructions"
        :key="index"
        class="mb-2"
    >
      {{ instruction.description }}
    </li>
  </ol>
</template>

<style scoped>

</style>