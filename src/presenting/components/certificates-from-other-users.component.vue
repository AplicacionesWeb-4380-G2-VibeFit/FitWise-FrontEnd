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
    },
    followedUserUsername: {
      type: String,
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
      :modal="true"
      @update:visible="$emit('update:visible', $event)"
  >
    <template #header>
      <div class="cert-header">
        {{ $t('followers.certificateDialog.title') }}
        <span class="username-highlight">{{ followedUserUsername }}</span>
      </div>
    </template>

    <div v-if="certificates.length > 0">
      <div class="certification-card-container">
        <pv-card v-for="cert in getPaginatedCertificates()" :key="cert.id"
                 class="certification-card">
          <template #title>
            <div class="cert-title-row">
              <span class="cert-title">{{ cert.institution }}</span>
            </div>
          </template>
          <template #content>
            <div class="cert-content">
              <p><strong class="cert-label">{{ $t('followers.certificateDialog.date') }}:</strong> {{ cert.dateObtained }}</p>

              <p><strong class="cert-label">{{ $t('followers.certificateDialog.description') }}:</strong></p>
              <div class="cert-description-box">
                <span class="cert-description">{{ cert.description }}</span>
              </div>

              <p><strong class="cert-label">{{ $t('followers.certificateDialog.status') }}:</strong> <pv-tag :value="cert.status" :severity="getSeverity(cert.status)" /></p>


              <p><strong class="cert-label">{{ $t('followers.certificateDialog.code') }}:</strong></p>
              <div class="cert-description-box">
                <span class="cert-description">{{ cert.certificateCode }}</span>
              </div>

              <p><strong class="cert-label">{{ $t('followers.certificateDialog.years') }}:</strong> {{ cert.yearsOfWork }}</p>
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
.cert-header {
  font-size: 1.3em;
  font-weight: bold;
  color: #f5f5f5;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #232526 0%, #393939 100%);
  padding: 14px 0;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.18);
}

.username-highlight {
  color: #4ade80; /* verde suave */
  font-weight: bold;
  font-size: 1.15em;
  margin-left: 10px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.22);
  letter-spacing: 0.5px;
}

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
