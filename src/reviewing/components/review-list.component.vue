<script>
import { Review } from "@/reviewing/model/review.entity.js";

export default {
  name: "review-list",
  props: {
    healthPlanId: {
      type: Number,
      required: true
    },
    reviews: {
      type: Array,
      required: true
    }
  },
  methods: {
    editReview(review) {
      this.$emit('edit-review', review);
    },
    deleteReview(reviewId) {
      this.$emit('delete-review', reviewId);
    }
  }
};
</script>

<template>
  <div class="review-list-container">
    <div v-if="reviews.length" class="grid">
      <div
          v-for="review in reviews"
          :key="review.id"
          class="col-12 md:col-6 lg:col-4 p-3"
      >
        <div class="review-card shadow-2 p-4 border-round surface-card">
          <div class="flex justify-content-between align-items-center mb-2">
            <span class="font-bold text-lg">
              {{ $t('review.score') }}: {{ review.score }}/5
            </span>
            <i class="pi pi-star-fill text-yellow-500" v-for="n in review.score" :key="n"></i>
          </div>
          <p class="mb-2 text-sm line-height-3">{{ review.description }}</p>
          <div class="text-xs text-500 mt-3">
            {{ $t('review.user') }}: {{ review.userId }}
          </div>

          <!-- Botones de edición y eliminación -->
          <div class="mt-3 flex justify-content-between">
            <pv-button
                icon="pi pi-pencil"
                class="p-button-outlined p-button-text p-button-sm"
                :label="$t('review.edit')"
                @click="editReview(review)"
            />
            <pv-button
                icon="pi pi-trash"
                class="p-button-outlined p-button-danger p-button-sm"
                :label="$t('review.delete')"
                @click="deleteReview(review.id)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje cuando no hay reseñas -->
    <div v-else class="flex justify-content-center p-5">
      <div class="text-center">
        <i class="pi pi-comment text-6xl text-400 mb-3"></i>
        <div class="text-xl font-medium">{{ $t('review.no-reviews-title') }}</div>
        <p class="text-500">{{ $t('review.no-reviews-message') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.review-list-container {
  width: 100%;
}

.review-card {
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.review-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.pv-button {
  min-width: 100px;
}
</style>
