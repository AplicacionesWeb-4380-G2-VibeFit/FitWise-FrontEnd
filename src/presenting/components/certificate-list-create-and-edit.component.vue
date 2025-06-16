<script>
import {Certificate} from "@/presenting/model/certificate.entity.js";
import {CertificateService} from "@/presenting/services/certificate.service.js";


export default {
  name: "certificate-list-create-and-edit",
  props: {
    userId: {
      type: Number, String,
      required: true
    }
  },
  data() {
    return {
      certificateService: null,
      certificates: [],
      expandedRows:[],

      //New Certificate
      newCertificate: null,

      //Create or Edit Dialog
      certificateDialog: false,

      //Delete Confirmation Dialog
      deleteCertificateDialog: false,
      deleteCertificate: null,

      submitted: false,
      statuses: [
        { label: 'ACTIVE', value: 'active' },
        { label: 'EXPIRED', value: 'expired' },
        { label: 'ARCHIVED', value: 'archived' }
      ],
      filterText: '', // Add filter text data property
    }
  },
  computed: {
    filteredCertificates() {
      return this.certificates.filter(certificate => {
        return (
            certificate.institution.toLowerCase().includes(this.filterText.toLowerCase()) ||
            certificate.certificateCode.toLowerCase().includes(this.filterText.toLowerCase()) ||
            certificate.status.toLowerCase().includes(this.filterText.toLowerCase())
        );
      });
    }
  },
  methods: {
    getAllCertificatesByUserId() {
      this.certificateService.getByUserId(this.userId).then(response => {
        this.certificates = response.data.map(certificate =>  new Certificate(certificate));
      }).catch(error => {
        console.error("Error fetching certificates:", error);
      });
    },

    //Table Row Expansion
    expandAll(){
      this.expandedRows = this.certificates.reduce((acc, cert) => {
        acc[cert.id] = true;
        return acc;
      }, {});
    },
    collapseAll() {
      this.expandedRows = {};
    },
    getSeverity(status) {
      switch (status) {
        case 'active':
          return 'success';
        case 'expired':
          return 'danger';
        case 'pending':
          return 'warning';
        default:
          return 'info';
      }
    },

    // Dialog Edit and Create
    openNew(){
      this.certificateDialog= true;
      this.newCertificate = new Certificate({});
      this.newCertificate.userId = this.userId;
      this.submitted = false;
    },
    hideDialog() {
      this.certificateDialog = false;
      this.submitted = false;
    },
    saveCertificate() {
      this.submitted = true;
      if (this.newCertificate.institution
          && this.newCertificate.certificateCode
          && this.newCertificate.description
          && this.newCertificate.status
          && this.newCertificate.yearsOfWork > 0) {

        if( this.newCertificate.id) {
          //Edit existing certificate
          this.certificateService.update(this.newCertificate.id, this.newCertificate).then(response => {

            const index = this.certificates.findIndex(cert => cert.id === response.data.id);
            if (index !== -1) {
              this.certificates[index] = new Certificate(response.data);
            }


            this.hideDialog();
          }).catch(error => {
            console.error("Error updating certificate:", error);
          });
          } else {
            //Create certificate
            this.certificateService.create(this.newCertificate).then(response => {
              this.certificates.push(new Certificate(response.data));

              this.hideDialog();
            }).catch(error => {
              console.error("Error creating certificate:", error);
            });
        }
      }
    },
    editCertificate(cert) {
      this.certificateDialog = true;
      this.newCertificate = new Certificate(cert);
      this.submitted = false;
    },

    //Delete Dialog
    confirmDeleteCertificate(cert) {
      this.deleteCertificateDialog = true;
      this.deleteCertificate = new Certificate(cert);
    },
    deleteCertificateById() {
      this.certificateService.delete(this.deleteCertificate.id).then(() => {
        this.certificates = this.certificates.filter(cert => cert.id !== this.deleteCertificate.id);
        this.deleteCertificateDialog = false;
        this.deleteCertificate = null;
      }).catch(error => {
        console.error("Error deleting certificate:", error);
      });
    },

    // Extracting Date
    onDateObtainedChange(date) {
      if (date) {
        const d = new Date(date);
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const yyyy = d.getFullYear();
        this.newCertificate.dateObtained = `${mm}/${dd}/${yyyy}`;
      } else {
        this.newCertificate.dateObtained = '';
      }
    },


  },
  created() {
    this.certificateService = new CertificateService();
    this.getAllCertificatesByUserId();
  },

}
</script>

<template>

</template>

<style scoped>
.button-toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Profundiza el gap solo para los botones, por si PrimeVue tiene wrappers extra */
.button-toolbar :deep(.p-button) {
  height: auto;                  /* Altura automática */
  width: auto;                   /* Que solo crezca por el contenido */
  line-height: 1.1;
}

.button-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.left-buttons,
.right-buttons {
  display: flex;
  gap: 0.5rem;
}

/* Solo para el botón Expand All */
:deep(.button-toolbar .expand-all-btn) {
  color: #237aff !important;
  background: transparent !important;
}
:deep(.button-toolbar .expand-all-btn:hover) {
  background: #237aff15 !important;
  color: #237aff !important;
}
:deep(.button-toolbar .expand-all-btn:active) {
  background: #237aff33 !important;
  color: #237aff !important;
}

/* Collapse All: Rojo rosado */
:deep(.button-toolbar .p-button:nth-child(2)) {
  color: #ff4567 !important;
  background: transparent !important;
}
:deep(.button-toolbar .p-button:nth-child(2):hover) {
  background: #ff456715 !important;
  color: #ff4567 !important;
}
:deep(.button-toolbar .p-button:nth-child(2):active) {
  background: #ff456733 !important;
  color: #ff4567 !important;
}

/* Elimina cualquier fondo interno de label o ícono */
:deep(.button-toolbar .p-button .p-button-label),
:deep(.button-toolbar .p-button .pi) {
  color: inherit !important;
  background: transparent !important;
}




.custom-card-container {
  padding: 0.5rem; /* Espaciado exterior grande para separar el card */
}

.custom-card {
  max-width: 900px; /* Más ancho */
  width: 100%;
  margin: 0 auto 1.5rem auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(60,60,100,0.10);
  padding: 1.75rem 2rem 1.75rem 2rem; /* Mayor padding interno */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  color: #000;
}

.card-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #000;
  letter-spacing: 0.5px;
}

.card-description {
  font-size: 1.08rem;
  color: #000;
  word-break: break-word;
}

/* Responsive para dispositivos móviles */
@media (max-width: 900px) {
  .custom-card {
    max-width: 99vw;
    padding: 1.2rem 0.7rem;
  }
  .custom-card-container {
    padding: 1rem 0.2rem;
  }
  .card-title,
  .card-description {
    font-size: 0.98rem;
  }
}




.delete-dialog-content {
  display: flex;
  align-items: center;
  gap: 16px; /* equivalente a gap-4 de Tailwind (4*4px) */
}
.delete-dialog-icon {
  font-size: 2rem; /* equivalente a text-3xl de Tailwind */
}



.custom-card-container {
  display: flex;
  justify-content: center;   /* Centra horizontalmente */
  align-items: flex-start;   /* Alto según contenido */
  width: 100%;
}

.custom-card {
  width: 100%;              /* OJO, se adapta pero... */
  max-width: 600px;         /* ...nunca crece más que esto */
  min-width: 220px;         /* ...nunca es más chica que esto */
  margin: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 12px;
  padding: 1.5rem;
  background: #fff;
  box-sizing: border-box;
  transition: box-shadow 0.2s;
}

/* Responsive para pantallas pequeñas */
@media (max-width: 650px) {
  .custom-card {
    max-width: 95vw;
    padding: 0.8rem;
  }
}

.certificaciones-titulo {
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #1a237e;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 8px rgba(26,35,126,0.08);
  border-left: 5px solid #1976d2;
  padding-left: 1rem;
  background: linear-gradient(90deg, #e3f2fd 0%, #fff 100%);
  border-radius: 6px 0 0 6px;
  box-shadow: 0 1px 4px rgba(25,118,210,0.07);
}

.professional-table :deep(.p-datatable-thead > tr > th) {
  background: linear-gradient(90deg, #e3f0fd 0%, #f8fafc 100%);
  color: #1a237e;
  font-weight: 700;
  font-size: 1.08rem;
  border-bottom: 2px solid #1976d2;
  letter-spacing: 0.5px;
  padding: 1rem 0.75rem;
}
.professional-table :deep(.p-datatable-tbody > tr) {
  transition: background 0.2s;
}
.professional-table :deep(.p-datatable-tbody > tr:nth-child(even)) {
  background: #f4f8fd;
}
.professional-table :deep(.p-datatable-tbody > tr:hover) {
  background: #e3f2fd !important;
}
.professional-table :deep(.p-datatable-tbody > tr > td) {
  padding: 0.85rem 0.75rem;
  font-size: 1.01rem;
  vertical-align: middle;
}
.table-header {
  text-align: left;
}
.table-body {
  text-align: left;
}
.actions-col {
  text-align: center !important;
}
.actions-btns {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
.action-edit {
  color: #1976d2 !important;
}
.action-delete {
  color: #ff4567 !important;
}

.professional-expansion {
  background: #f4f8fd;
  border-radius: 0 0 12px 12px;
  padding: 1.5rem 0.5rem 2rem 0.5rem;
}
.professional-card {
  background: #fff;
  border-left: 6px solid #1976d2;
  box-shadow: 0 4px 18px 0 rgba(25,118,210,0.10);
  border-radius: 12px;
  padding: 2rem 2.5rem;
  margin: 0 auto 1.5rem auto;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  color: #222;
}
.professional-card .card-title {
  font-size: 1.18rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
  color: #1976d2;
  display: flex;
  align-items: center;
}
.professional-card .card-description {
  font-size: 1.08rem;
  color: #222;
  word-break: break-word;
  line-height: 1.6;
}
@media (max-width: 900px) {
  .professional-card {
    max-width: 99vw;
    padding: 1.2rem 0.7rem;
  }
  .professional-expansion {
    padding: 1rem 0.2rem 1.5rem 0.2rem;
  }
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


.seguidores-titulo-profesional {
  font-size: 2.1rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 1.5px;
  text-shadow: 0 4px 16px rgba(0,0,0,0.25);
  border-left: 7px solid #1abc9c;
  padding-left: 1.3rem;
  background: linear-gradient(90deg, #23272f 0%, #111 100%);
  border-radius: 8px 0 0 8px;
  box-shadow: 0 2px 8px rgba(26,188,156,0.10);
  margin-bottom: 2rem;
  margin-top: 0.5rem;
  display: inline-block;
}

</style>