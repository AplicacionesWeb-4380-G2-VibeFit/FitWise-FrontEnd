<script>
import { ReviewReport } from "@/reviewing/model/reviewReport.entity.js";
import { ReviewReportService } from "@/reviewing/services/reviewReport.service.js";

export default {
  name: "review-report",
  props: {
    reviewId: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  emits: ["close", "reported"],
  data() {
    return {
      selectedReason: "",
      reasons: ["Inapropiado", "Spam", "Contenido falso", "Lenguaje ofensivo"],
      reportService: new ReviewReportService(),
      error: ""
    };
  },
  methods: {
    submitReport() {
      if (!this.selectedReason) {
        this.error = "Debes seleccionar un motivo.";
        return;
      }

      const report = new ReviewReport({
        reviewId: this.reviewId,
        userId: "USER_ID_AQUI", // ⚠️ Reemplaza con el ID real del usuario logueado
        reason: this.selectedReason
      });

      this.reportService.create(report)
          .then(() => {
            this.$emit("reported");
            this.$emit("close");
          })
          .catch(() => {
            this.error = "Error al enviar el reporte.";
          });
    }
  }
};
</script>

<template>
  <Dialog
      :visible="visible"
      modal
      header="Reportar reseña"
      @hide="$emit('close')"
  >
    <div>
      <p>Selecciona el motivo del reporte:</p>

      <pv-dropdown
          v-model="selectedReason"
          :options="reasons"
          placeholder="Motivo"
          class="mb-3"
      />

      <pv-button
          label="Enviar Reporte"
          icon="pi pi-flag"
          class="p-button-warning"
          @click="submitReport"
      />

      <div class="text-danger mt-2" v-if="error">{{ error }}</div>
    </div>
  </Dialog>
</template>

<style scoped>
.text-danger {
  color: red;
}
</style>
