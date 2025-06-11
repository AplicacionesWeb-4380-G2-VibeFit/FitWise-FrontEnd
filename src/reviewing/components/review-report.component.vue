<script>
import { ReviewReportService } from "@/reviewing/services/reviewReport.service.js";

export default {
  name: "review-report",
  props: {
    reviewId: {
      type: [String, Number],
      required: true
    },
    userId: {
      type: [String, Number],
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      reportReason: "",
      errors: [],
      reviewReportService: null,
      loading: false
    };
  },
  methods: {
    close() {
      this.reportReason = "";
      this.errors = [];
      this.$emit('close');
    },
    sendReport() {
      if (!this.reportReason.trim()) {
        this.errors = [{ message: this.$t('review.report-error') }];
        return;
      }

      this.loading = true;

      const newReport = {
        reviewId: this.reviewId,
        userId: this.userId,
        reason: this.reportReason.trim(),
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      this.reviewReportService.create(newReport)
          .then(() => {
            this.$toast.add({
              severity: 'success',
              summary: this.$t('review.reported-summary'),
              detail: this.$t('review.reported-detail'),
              life: 3000
            });
            this.$emit('reported');
            this.close();
          })
          .catch(error => {
            this.errors.push(error);
            console.error(error);
          })
          .finally(() => {
            this.loading = false;
          });
    }
  },
  created() {
    this.reviewReportService = new ReviewReportService();
  }
};
</script>

<template>
  <pv-dialog
      :visible="visible"
      modal
      :closable="true"
      :header="$t('review.report') || 'Reportar reseña'"
      @hide="close"
      @update:visible="close"
  >
    <div class="report-form">
      <label class="report-label" for="report-textarea">
      </label>
      <textarea
          id="report-textarea"
          v-model="reportReason"
          rows="4"
          class="p-inputtextarea p-component w-full report-textarea"
          :placeholder="$t('review.report-reason-placeholder')"
      ></textarea>

      <div v-if="errors.length" class="report-errors">
        <div v-for="(err, idx) in errors" :key="idx">{{ err.message || err.toString() }}</div>
      </div>
    </div>

    <template #footer>
      <pv-button
          :label="$t('review.report-cancel')"
          class="p-button-text report-cancel-btn"
          @click="close"
          :disabled="loading"
      />
      <pv-button
          :label="$t('review.report-submit')"
          class="p-button-danger report-submit-btn"
          @click="sendReport"
          :loading="loading"
      />
    </template>
  </pv-dialog>
</template>

<style scoped>
.report-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.report-textarea {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
}

.report-errors {
  color: #d32f2f;
  background-color: #ffe5e5;
  border: 1px solid #f5c2c2;
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 0.8rem;
}
</style>

