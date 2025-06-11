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
      allReviews: [], // Todas las reviews del sistema
      reviews: [], // Reviews filtradas (por plan o todas)
      review: new Review({}),
      reviewService: null,
      errors: [],
      reviewPlanIds: [],
      selectedPlanId: null,
      showForm: false,
      isEditing: false
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

    // Cargar todas las reviews
    getAllReviews() {
      this.reviewService.getAll().then(response => {
        const rawReviews = response.data.map(r => new Review(r));
        this.allReviews = rawReviews;
        this.reviewPlanIds = [...new Set(rawReviews.map(r => r.healthPlanId))];

        if (this.selectedPlanId) {
          this.reviews = this.allReviews.filter(r => r.healthPlanId === this.selectedPlanId);
        } else {
          this.reviews = [...this.allReviews];
        }
      }).catch(error => {
        this.errors.push(error);
        this.allReviews = [];
        this.reviews = [];
        console.error(error);
      });
    },

    // Cambiar a un plan específico
    getReviewsByPlanId(planId) {
      this.selectedPlanId = planId;
      this.reviews = this.allReviews.filter(r => r.healthPlanId === planId);
    },

    // Mostrar todas las reviews sin filtrar
    resetToAll() {
      this.selectedPlanId = null;
      this.reviews = [...this.allReviews];
    },

    // Crear nueva review
    startCreate() {
      this.review = new Review({});
      this.showForm = true;
      this.isEditing = false;
    },

    // Editar una existente
    startEdit(review) {
      this.review = new Review({ ...review });
      this.showForm = true;
      this.isEditing = true;
    },

    // Guardar (crear o editar)
    saveReview(review) {
      const action = this.isEditing
          ? this.reviewService.update(review.id, review)
          : this.reviewService.create(review);

      action.then(() => {
        this.notifySuccessfulAction(this.isEditing ? 'review.updated' : 'review.created');
        this.showForm = false;
        this.getAllReviews(); // Actualizar datos desde backend tras guardar
      }).catch(error => {
        this.errors.push(error);
        console.error(error);
      });
    },

    // Cancelar edición
    cancelEdit() {
      this.showForm = false;
      this.review = new Review({});
    },

    // Eliminar review
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

            // Actualizar array maestro y filtrado
            this.allReviews = this.allReviews.filter(r => r.id !== reviewId);

            if (this.selectedPlanId) {
              this.reviews = this.allReviews.filter(r => r.healthPlanId === this.selectedPlanId);
            } else {
              this.reviews = [...this.allReviews];
            }
          }).catch(error => {
            this.errors.push(error);
            console.error(error);
          });
        }
      });
    },

    // Manejar reporte de review
    handleReported() {
      this.$toast.add({
        severity: 'info',
        summary: this.$t('review.reported-summary') || 'Reporte enviado',
        detail: this.$t('review.reported-detail') || 'Gracias por reportar esta reseña.',
        life: 3000
      });
      // Opcional: refrescar reviews si es necesario
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
    <ConfirmDialog />

    <!-- Filtros -->
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

    <!-- Botón crear -->
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

    <!-- Lista -->
    <review-list
        v-else
        :reviews="reviews"
        :health-plan-id="selectedPlanId"
        @edit-review="startEdit"
        @delete-review="deleteReview"
        @reported="handleReported"
    />
  </div>
</template>

<style scoped>
</style>
