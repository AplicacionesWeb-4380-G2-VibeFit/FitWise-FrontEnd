<script>
import { ReviewComment } from "@/reviewing/model/reviewComment.entity.js";
import { ReviewCommentService } from "@/reviewing/services/reviewComment.service.js";

export default {
  name: "review-comments",
  props: {
    reviewId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      comments: [],
      newComment: new ReviewComment({ reviewId: this.reviewId }),
      commentService: new ReviewCommentService(),
      loading: false,
      error: ""
    };
  },
  methods: {
    fetchComments() {
      this.loading = true;
      this.commentService.getByReviewId(this.reviewId)
          .then(response => {
            this.comments = response.data;
            this.loading = false;
          })
          .catch(error => {
            this.error = "Error al cargar los comentarios.";
            this.loading = false;
          });
    },
    submitComment() {
      if (!this.newComment.content.trim()) {
        this.error = "El comentario no puede estar vacío.";
        return;
      }

      this.commentService.create(this.newComment)
          .then(() => {
            this.newComment = new ReviewComment({ reviewId: this.reviewId });
            this.fetchComments();
          })
          .catch(() => {
            this.error = "Error al enviar el comentario.";
          });
    }
  },
  created() {
    this.fetchComments();
  }
};
</script>

<template>
  <div class="review-comments">
    <h4>Comentarios</h4>

    <div v-if="loading">Cargando comentarios...</div>
    <div v-else>
      <div v-if="comments.length">
        <ul>
          <li v-for="comment in comments" :key="comment.id" class="mb-2">
            <div><strong>{{ comment.userId }}</strong></div>
            <div>{{ comment.content }}</div>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>No hay comentarios aún.</p>
      </div>
    </div>

    <div class="mt-3">
      <pv-textarea
          v-model="newComment.content"
          placeholder="Escribe tu comentario..."
          rows="3"
          class="mb-2"
      />
      <pv-button label="Enviar" icon="pi pi-send" @click="submitComment" />

      <div class="text-danger mt-2" v-if="error">{{ error }}</div>
    </div>
  </div>
</template>

<style scoped>
.review-comments {
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}
</style>
