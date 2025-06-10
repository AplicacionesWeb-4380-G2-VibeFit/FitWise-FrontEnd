<script>
import { ReviewCommentService } from "@/reviewing/services/reviewComment.service.js";

export default {
  name: "review-comments",
  props: {
    reviewId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      comments: [],
      newCommentText: "",
      loading: false,
      errors: [],
      reviewCommentService: null
    };
  },
  methods: {
    loadComments() {
      this.loading = true;
      this.reviewCommentService.getByReviewId(this.reviewId)
          .then(response => {
            this.comments = response.data;
          })
          .catch(error => {
            this.errors.push(error);
            console.error(error);
          })
          .finally(() => {
            this.loading = false;
          });
    },
    sendComment() {
      if (!this.newCommentText.trim()) return;

      const newComment = {
        reviewId: this.reviewId,
        text: this.newCommentText.trim(),
        createdAt: new Date().toISOString()
        // otros campos si aplica
      };

      this.reviewCommentService.create(newComment)
          .then(response => {
            this.comments.push(response.data);
            this.newCommentText = "";
            this.$emit('commented', { reviewId: this.reviewId, comment: response.data });
          })
          .catch(error => {
            this.errors.push(error);
            console.error(error);
          });
    }
  },
  created() {
    this.reviewCommentService = new ReviewCommentService();
    this.loadComments();
  }
};
</script>

<template>
  <div class="review-comments">
    <div v-if="loading" class="mb-2 text-sm text-gray-500">{{ $t('loading') || 'Cargando comentarios...' }}</div>
    <ul v-if="comments.length" class="mb-2">
      <li v-for="comment in comments" :key="comment.id" class="mb-1 border-bottom p-1">
        <small class="text-gray-600">{{ comment.text }}</small>
        <br />
        <small class="text-gray-400">{{ new Date(comment.createdAt).toLocaleString() }}</small>
      </li>
    </ul>
    <div v-else class="mb-2 text-sm text-gray-500">{{ $t('review.no-comments') || 'No hay comentarios aún' }}</div>

    <div class="flex gap-2">
      <input
          v-model="newCommentText"
          type="text"
          class="p-inputtext p-component p-inputtext-sm"
          :placeholder="$t('review.write-comment') || 'Escribe un comentario...'"
          @keyup.enter="sendComment"
      />
      <pv-button
          label="Enviar"
          class="p-button-sm p-button-primary"
          @click="sendComment"
      />
    </div>

    <div v-if="errors.length" class="text-red-600 mt-2 text-xs">
      <div v-for="(err, idx) in errors" :key="idx">{{ err.message || err.toString() }}</div>
    </div>
  </div>
</template>

<style scoped>
.review-comments {
  font-size: 0.85rem;
}
</style>
