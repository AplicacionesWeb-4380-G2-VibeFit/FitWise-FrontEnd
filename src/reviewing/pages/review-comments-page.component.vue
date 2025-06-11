<template>
  <div class="review-comments-page p-4">
    <h2 class="text-2xl font-semibold mb-4">{{ $t('review.comments') }}</h2>

    <pv-data-table
        :value="comments"
        :paginator="true"
        :rows="5"
        :loading="loading"
        dataKey="id"
        class="p-datatable-sm"
    >
      <pv-column field="content" header="{{ $t('review.comment') }}"></pv-column>
      <pv-column field="createdAt" header="{{ $t('created') }}" :body="formatDate"></pv-column>
      <pv-column header="{{ $t('actions') }}" :body="actionTemplate" style="width: 8rem"></pv-column>
    </pv-data-table>

    <pv-dialog v-model:visible="editDialogVisible" :header="$t('review.edit-comment')" modal>
      <div class="p-fluid">
        <pv-textarea v-model="editCommentContent" rows="3" autoResize />
      </div>
      <template #footer>
        <pv-button label="{{ $t('cancel') }}" icon="pi pi-times" @click="editDialogVisible = false" class="p-button-text" />
        <pv-button label="{{ $t('save') }}" icon="pi pi-check" @click="saveComment" class="p-button-primary" />
      </template>
    </pv-dialog>
  </div>
</template>

<script>
import { ReviewCommentService } from '@/reviewing/services/reviewComment.service.js';

export default {
  name: 'review-comments-page',
  data() {
    return {
      comments: [],
      loading: false,
      editDialogVisible: false,
      selectedCommentId: null,
      editCommentContent: '',
      service: null
    };
  },
  created() {
    this.service = new ReviewCommentService();
    this.loadComments();
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
    formatDate(row) {
      return new Date(row.createdAt).toLocaleString();
    },
    actionTemplate(row) {
      return (
          <div class="flex gap-2">
            <pv-button icon="pi pi-pencil" class="p-button-sm p-button-text" @click={() => this.editComment(row)} />
            <pv-button icon="pi pi-trash" class="p-button-sm p-button-text p-button-danger" @click={() => this.deleteComment(row.id)} />
          </div>
      );
    },
    editComment(comment) {
      this.selectedCommentId = comment.id;
      this.editCommentContent = comment.content;
      this.editDialogVisible = true;
    },
    saveComment() {
      const updated = {
        id: this.selectedCommentId,
        content: this.editCommentContent
      };
      this.service.update(this.selectedCommentId, updated)
          .then(() => {
            const index = this.comments.findIndex(c => c.id === this.selectedCommentId);
            if (index !== -1) this.comments[index].content = this.editCommentContent;
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
