<script>
import {Certificate} from "@/presenting/model/certificate.entity.js";
import {CertificateService} from "@/presenting/services/certificate.service.js";

export default {
  name: "certificates-from-other-users",
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    followedUserId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      certificates: [],
      certificateService: null,
      currentPage: 1, // Cambiado a base 1 para que la primera página sea 1
      rowsPerPage: 1
    };
  },
  methods: {
    fetchCertificates() {
      this.loading = true;
      this.certificateService
          .getByUserId(this.followedUserId)
          .then(response => {
            this.certificates = response.data.map(
                cert => new Certificate(cert),
            );
          })
          .catch(error => {
            console.error("Error fetching certifications:", error);
          })
    },
    onPageChange(event) {
      this.currentPage = event.page + 1; // Ajusta la página a base 1
      this.rowsPerPage = event.rows; // Actualiza el número de filas por página
    },
    getPaginatedCertificates() {
      const start = (this.currentPage - 1) * this.rowsPerPage; // Ajuste para base 1
      const end = start + this.rowsPerPage;

      return this.certificates.slice(start, end);
    },
    getSeverity(status) {
      switch (status) {
        case 'active':
          return 'success';
        case 'expired':
          return 'danger';
        case 'archived':
          return 'info';
        default:
          return 'info';
      }
    },
  },
  created() {

    this.certificateService = new CertificateService();
    this.fetchCertificates();
  }

}
</script>

<template>
  <pv-dialog
      :visible="visible"
      :style="{ width: '600px' }"
      header="Certificaciones" :modal="true"
      @update:visible="$emit('update:visible', $event)">
    <div v-if="certificates.length > 0">
      <div class="certification-card-container">
        <pv-card v-for="cert in getPaginatedCertificates()" :key="cert.id"
                 class="certification-card">
          <template #title>
            <div class="cert-title-row">
              <span class="cert-title">{{ cert.institution }}</span>
              <pv-tag v-if="cert.gender" :value="cert.gender === 'male' ? 'Masculino' : 'Femenino'" :severity="cert.gender === 'male' ? 'info' : 'danger'" class="cert-tag" />
            </div>
          </template>
          <template #content>
            <div class="cert-content">
              <p><strong class="cert-label">Fecha:</strong> {{ cert.dateObtained }}</p>
              <p><strong class="cert-label">Descripción:</strong></p>
              <div class="cert-description-box">
                <span class="cert-description">{{ cert.description }}</span>
              </div>
              <p><strong class="cert-label">Estado:</strong> <pv-tag :value="cert.status" :severity="getSeverity(cert.status)" /></p>
              <p><strong class="cert-label">Código:</strong> {{ cert.certificateCode }}</p>
              <p><strong class="cert-label">Años de experiencia:</strong> {{ cert.yearsOfWork }}</p>
            </div>
          </template>
        </pv-card>
      </div>
      <pv-paginator
          :rows="rowsPerPage"
          :totalRecords="certificates.length"
          :page="currentPage - 1" @page="onPageChange" />
    </div>
    <div v-else class="text-center">
      <p>No hay certificaciones disponibles.</p>
    </div>
  </pv-dialog>
</template>

<style scoped>
.certification-card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  width: 100%;
}
.certification-card {
  background: #111;
  color: #fff;
  border: 1px solid #444;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  max-width: 380px;
  width: 100%;
  margin: 0 auto 16px auto;
  padding: 18px 22px;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.certification-card:hover {
  box-shadow: 0 8px 32px rgba(59,130,246,0.18);
  border-color: #1976d2;
}
.cert-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cert-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #60a5fa;
}
.cert-tag {
  margin-left: 10px;
  font-weight: bold;
  font-size: 1rem;
}
.cert-content {
  margin-top: 10px;
}
.cert-label {
  color: #3b82f6;
  font-weight: 500;
}
.cert-description-box {
  background: #23272f;
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 8px;
  margin-top: 2px;
  color: #e0e0e0;
  max-height: 200px;
  overflow-y: auto;
  font-size: 1rem;
  white-space: pre-line;
  word-break: break-word;
}
.cert-description {
  white-space: pre-line;
  word-break: break-word;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 8px;
}
</style>
