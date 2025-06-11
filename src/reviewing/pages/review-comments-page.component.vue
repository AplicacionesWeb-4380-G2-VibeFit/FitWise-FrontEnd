<template>
  <div class="review-comments-page p-4">
    <h2 class="text-2xl font-semibold mb-4">{{ $t('review.comments') }}</h2>

    <!-- Formulario para agregar comentarios -->
    <div class="mb-6">
      <div class="flex gap-2 mb-3">
        <pv-input-text
            v-model="newCommentContent"
            :placeholder="$t('review.write-comment')"
            class="w-full"
        />
        <pv-select
            v-model="selectedReviewId"
            :options="availableReviewIds"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('review.select-review')"
            class="w-30rem"
        />
        <pv-button
            icon="pi pi-plus"
            :label="$t('review.add-comment')"
            @click="createComment"
            class="p-button-success"
        />
      </div>
    </div>

    <!-- Comentarios agrupados por review -->
    <div v-for="(group, reviewId) in groupedComments" :key="reviewId" class="mb-6">
      <h3 class="text-lg font-bold mb-2">{{ $t('review.review-id') }}: {{ reviewId }}</h3>

      <pv-data-table
          :value="group"
          :paginator="true"
          :rows="5"
          dataKey="id"
          class="p-datatable-sm"
      >
        <pv-column field="content" :header="$t('review.comment')"></pv-column>
        <pv-column field="createdAt" :header="$t('created')">
          <template #body="{ data }">
            {{ formatDate(data.createdAt) }}
          </template>
        </pv-column>
        <pv-column :header="$t('actions')">
          <template #body="{ data }">
            <div class="flex gap-2">
              <pv-button icon="pi pi-pencil" class="p-button-sm p-button-text" @click="editComment(data)" />
              <pv-button icon="pi pi-trash" class="p-button-sm p-button-text p-button-danger" @click="deleteComment(data.id)" />
            </div>
          </template>
        </pv-column>
      </pv-data-table>
    </div>

    <!-- Modal de edición -->
    <pv-dialog v-model:visible="editDialogVisible" :header="$t('review.edit-comment')" modal>
      <div class="p-fluid">
        <pv-textarea v-model="editCommentContent" rows="3" autoResize />
      </div>
      <template #footer>
        <pv-button :label="$t('cancel')" icon="pi pi-times" @click="editDialogVisible = false" class="p-button-text" />
        <pv-button :label="$t('save')" icon="pi pi-check" @click="saveComment" class="p-button-primary" />
      </template>
    </pv-dialog>
  </div>
</template>

<script>
import { ReviewCommentService } from '@/reviewing/services/reviewComment.service.js';
import { ReviewService } from '@/reviewing/services/review.service.js';

export default {
  name: 'review-comments-page',
  data() {
    return {
      comments: [],
      loading: false,
      editDialogVisible: false,
      selectedCommentId: null,
      editCommentContent: '',
      newCommentContent: '',
      selectedReviewId: null,
      availableReviewIds: [],
      service: null,
      reviewService: null,
      currentUserId: 1
    };
  },
  computed: {
    groupedComments() {
      return this.comments.reduce((acc, comment) => {
        if (!acc[comment.reviewId]) acc[comment.reviewId] = [];
        acc[comment.reviewId].push(comment);
        return acc;
      }, {});
    }
  },
  created() {
    this.service = new ReviewCommentService();
    this.reviewService = new ReviewService();
    this.loadComments();
    this.loadReviewOptions();
  },
  methods: {
    loadComments() {
      this.loading = true;
      this.service.getAll()
          .then(res => {
            this.comments = res.data;
          })
          .catch(err => console.error(err))
          .finally(() => {
            this.loading = false;
          });
    },
    loadReviewOptions() {
      this.reviewService.getAll()
          .then(res => {
            this.availableReviewIds = res.data.map(r => ({
              label: `Review ${r.id} - Score ${r.score}`,
              value: r.id
            }));
          })
          .catch(err => console.error('Error loading reviews:', err));
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? this.$t('invalid.date') : date.toLocaleString();
    },
    editComment(comment) {
      this.selectedCommentId = comment.id;
      this.editCommentContent = comment.content;
      this.editDialogVisible = true;
    },
    saveComment() {
      const original = this.comments.find(c => c.id === this.selectedCommentId);
      if (!original) return;

      const updated = {...original, content: this.editCommentContent};

      this.service.update(this.selectedCommentId, updated)
          .then(() => {
            const index = this.comments.findIndex(c => c.id === this.selectedCommentId);
            if (index !== -1) {
              this.comments[index] = updated;
            }
            this.editDialogVisible = false;
          });
    },
    deleteComment(id) {
      this.$confirm.require({
        message: this.$t('confirm.delete'),
        header: this.$t('review.confirm-delete'),
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.service.delete(id)
              .then(() => {
                this.comments = this.comments.filter(c => c.id !== id);
              });
        }
      });
    },
    createComment() {
      if (!this.newCommentContent.trim() || !this.selectedReviewId) {
        this.$toast.add({
          severity: 'warn',
          summary: this.$t('warning'),
          detail: this.$t('review.fill-required-fields'),
          life: 3000
        });
        return;
      }

      const newComment = {
        reviewId: this.selectedReviewId,
        userId: this.currentUserId,
        content: this.newCommentContent.trim(),
        createdAt: new Date().toISOString()
      };

      this.service.create(newComment)
          .then(res => {
            if (res && res.data) {
              this.comments.push(res.data);
              this.newCommentContent = '';
              this.selectedReviewId = null;
            }
          })
          .catch(err => {
            console.error(err);
            this.$toast.add({
              severity: 'error',
              summary: this.$t('error'),
              detail: this.$t('review.creation-error'),
              life: 3000
            });
          });
    }
  }
};
</script>

<style scoped>
.review-comments-page {
  max-width: 900px;
  margin: 0 auto;
}
</style>
