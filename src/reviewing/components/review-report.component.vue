<script>
import { ReviewReportService } from "@/reviewing/services/reviewReport.service.js";

export default {
  name: "review-report",
  props: {
    reviewId: {
      type: Number,
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
        this.errors = [{ message: 'Debe indicar una razón para el reporte.' }];
        return;
      }

      this.loading = true;

      const newReport = {
        reviewId: this.reviewId,
        reason: this.reportReason.trim(),
        createdAt: new Date().toISOString(),
        status: 'pending' // o según tu backend
      };

      this.reviewReportService.create(newReport)
          .then(() => {
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
  <p-dialog :visible="visible" modal header="Reportar review" @hide="close" :closable="true">
    <div>
      <textarea
          v-model="reportReason"
          rows="4"
          class="p-inputtextarea p-component"
          placeholder="Describe la razón del reporte"
      ></textarea>
      <div v-if="errors.length" class="text-red-600 mt-2 text-xs">
        <div v-for="(err, idx) in errors" :key="idx">{{ err.message || err.toString() }}</div>
      </div>
    </div>
    <template #footer>
      <pv-button label="Cancelar" class="p-button-text" @click="close" :disabled="loading" />
      <pv-button label="Enviar reporte" class="p-button-danger" @click="sendReport" :loading="loading" />
    </template>
  </p-dialog>
</template>

<style scoped>
/* Puedes añadir estilos aquí */
</style>
