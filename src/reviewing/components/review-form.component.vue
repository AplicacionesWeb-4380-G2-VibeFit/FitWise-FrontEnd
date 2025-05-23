<script>
import { Review } from "@/reviewing/model/review.entity.js";

export default {
  name: "review-form",
  props: {
    review: {
      type: Object,
      default: () => new Review({})
    }
  },
  emits: ["saved", "cancelled"],
  data() {
    return {
      localReview: new Review({ ...this.review }),
      errors: []
    };
  },
  methods: {
    submit() {
      if (!this.localReview.description || this.localReview.score < 1 || this.localReview.score > 5) {
        this.errors = ["Todos los campos son obligatorios y el puntaje debe estar entre 1 y 5."];
        return;
      }
      this.$emit("saved", this.localReview);
    },
    cancel() {
      this.$emit("cancelled");
    }
  },
  watch: {
    review: {
      handler(newVal) {
        this.localReview = new Review({ ...newVal });
      },
      deep: true
    }
  }
};
</script>

<template>
  <div class="review-form">
    <div v-if="errors.length" class="p-error mb-2">
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </div>
    <pv-input-text v-model="localReview.userId" placeholder="User ID" class="mb-3" />
    <pv-input-number v-model="localReview.score" placeholder="Puntaje (1-5)" :min="1" :max="5" class="mb-3" />
    <pv-textarea v-model="localReview.description" placeholder="Comentario" rows="4" class="mb-3" />
    <pv-input-number v-model="localReview.healthPlanId" placeholder="Plan ID" class="mb-3" />

    <div class="flex gap-2">
      <pv-button label="Guardar" icon="pi pi-check" @click="submit" />
      <pv-button label="Cancelar" icon="pi pi-times" class="p-button-secondary" @click="cancel" />
    </div>
  </div>
</template>

<style scoped>
.review-form {
  max-width: 500px;
}
</style>
