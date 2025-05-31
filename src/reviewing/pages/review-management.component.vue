<script>
import { Review } from "@/reviewing/model/review.entity.js";
import { ReviewService } from "@/reviewing/services/review.service.js";
import ReviewList from "@/reviewing/components/review-list.component.vue";
import ReviewForm from "@/reviewing/components/review-form.component.vue";

export default {
  name: "review-management",
  components: { ReviewList, ReviewForm },
  data() {
    return {
      reviews: [],
      review: new Review({}),
      reviewService: null,
      errors: [],
      reviewPlanIds: [],
      selectedPlanId: null,
      showForm: false,
      isEditing: false,
      reviewIdToDelete: null
    };
  },
  methods: {
    notifySuccessfulAction(messageKey) {
      this.$toast.add({
        severity: 'success',
        summary: this.$t('success'),
        detail: this.$t(messageKey),
        life: 3000
      });
    },
    getAllReviews() {
      this.reviewService.getAll().then(response => {
        const rawReviews = response.data.map(review => new Review(review));
        this.reviews = rawReviews;
        this.reviewPlanIds = [...new Set(rawReviews.map(r => r.healthPlanId))];
        this.selectedPlanId = null;
      }).catch(error => {
        this.errors.push(error);
        this.reviews = [];
        console.error(error);
      });
    },
    getReviewsByPlanId(planId) {
      this.reviewService.getByHealthPlanId(planId).then(response => {
        this.reviews = response.data.map(r => new Review(r));
        this.selectedPlanId = planId;
      }).catch(error => {
        this.errors.push(error);
        this.reviews = [];
        console.error(error);
      });
    },
    startCreate() {
      this.review = new Review({});
      this.showForm = true;
      this.isEditing = false;
    },
    startEdit(review) {
      this.review = new Review({ ...review });
      this.showForm = true;
      this.isEditing = true;
    },
    saveReview(review) {
      const action = this.isEditing
          ? this.reviewService.update(review.id, review)
          : this.reviewService.create(review);

      action.then(() => {
        const messageKey = this.isEditing ? 'review.updated' : 'review.created';
        this.notifySuccessfulAction(messageKey);
        this.showForm = false;
        this.selectedPlanId
            ? this.getReviewsByPlanId(this.selectedPlanId)
            : this.getAllReviews();
      }).catch(error => {
        this.errors.push(error);
        console.error(error);
      });
    },
    cancelEdit() {
      this.showForm = false;
      this.review = new Review({});
    },
    deleteReview(reviewId) {
      this.$confirm.require({
        message: this.$t('review.confirm-message'),
        header: this.$t('review.confirm-title'),
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: this.$t('yes'),
        rejectLabel: this.$t('no'),
        accept: () => {
          this.reviewService.delete(reviewId).then(() => {
            this.notifySuccessfulAction('review.deleted');
            this.selectedPlanId
                ? this.getReviewsByPlanId(this.selectedPlanId)
                : this.getAllReviews();
          }).catch(error => {
            this.errors.push(error);
            console.error(error);
          });
        }
      });
    },
    resetToAll() {
      this.getAllReviews();
    }
  },
  created() {
    this.reviewService = new ReviewService();
    this.getAllReviews();
  }
};
</script>

<template>
  <div>
    <!-- Confirmación para eliminar -->
    <ConfirmDialog/>

    <!-- Filtros de planes -->
    <div class="mb-4">
      <p>{{ $t('review.plan-count') }}: {{ reviewPlanIds.length }}</p>
      <pv-button
          :label="$t('review.show-all')"
          class="p-button-secondary mr-2 mb-2"
          @click="resetToAll"
      />
      <pv-button
          v-for="id in reviewPlanIds"
          :key="id"
          class="p-button-outlined mr-2 mb-2"
          :label="'Plan ' + id"
          @click="getReviewsByPlanId(id)"
      />
    </div>

    <!-- Botón para agregar nueva review -->
    <div class="mb-3">
      <pv-button
          :label="$t('review.add')"
          icon="pi pi-plus"
          class="p-button-success"
          @click="startCreate"
      />
    </div>

    <!-- Formulario -->
    <review-form
        v-if="showForm"
        :review="review"
        @saved="saveReview"
        @cancelled="cancelEdit"
    />

    <!-- Lista de reviews -->
    <review-list
        v-else
        :reviews="reviews"
        :health-plan-id="selectedPlanId"
        @edit-review="startEdit"
        @delete-review="deleteReview"
    />
  </div>
</template>

<style scoped>
</style>
