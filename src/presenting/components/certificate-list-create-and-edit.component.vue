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
  <!--Create and Edit-->
  <pv-dialog
      v-model:visible="certificateDialog"
      :style="{ width: '450px' }"
      :header="!newCertificate || !newCertificate.id ? $t('profile.certificateManagement.createTitle') : $t('profile.certificateManagement.editTitle')"
      :modal="true">

    <div style=" display: flex; flex-direction: column; gap: 1.5rem;">

      <div>
        <label
            for="institution"
            style=" display: block;
                    font-weight: bold;
                    margin-bottom: 0.75rem;">
          {{ $t('profile.certificateManagement.institution') }}
        </label>
        <pv-input-text
            id="institution"
            v-model.trim="newCertificate.institution"
            required="true"
            autofocus
            :invalid="submitted && !newCertificate.institution"
            fluid
        />
        <small
            v-if="submitted && !newCertificate.institution"
            style="color: #ef4444;"
        >{{ $t('profile.certificateManagement.institutionValidation') }}</small>
      </div>

      <div style="
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 1rem;">
        <div style="grid-column: span 6 / span 6;">
          <label
              for="certificateCode"
              style=" display: block;
                    font-weight: bold;
                    margin-bottom: 0.75rem;">
            {{ $t('profile.certificateManagement.certificateCode') }}
          </label>
          <pv-input-text
              id="certificateCode"
              v-model.trim="newCertificate.certificateCode"
              required="true"
              autofocus
              :invalid="submitted && !newCertificate.certificateCode"
              fluid
          />
          <small
              v-if="submitted && !newCertificate.certificateCode"
              style="color: #ef4444;"
          >{{ $t('profile.certificateManagement.certificateCodeValidation') }}</small>
        </div>
        <div style="grid-column: span 6 / span 6;">
          <label
              for="certificateCode"
              style=" display: block;
                    font-weight: bold;
                    margin-bottom: 0.75rem;">
            {{ $t('profile.certificateManagement.dateObtained') }}
          </label>
          <pv-date-picker
              id="dateObtained"
              :showIcon="true"
              :showButtonBar="true"
              v-model="newCertificate.dateObtained"
              @update:modelValue="onDateObtainedChange"
              :invalid="submitted && (!newCertificate.dateObtained || new Date(newCertificate.dateObtained) > new Date(new Date().toDateString()))"
          />
          <small
              v-if="submitted && (!newCertificate.dateObtained || new Date(newCertificate.dateObtained) > new Date(new Date().toDateString()))"
              style="color: #ef4444;"
          >{{ $t('profile.certificateManagement.dateObtainedValidation') }}</small>
        </div>
      </div>


      <div>
        <label
            for="description"
            style="
          display: block;
          font-weight: bold;
          margin-bottom: 0.75rem;
        "
        >{{ $t('profile.certificateManagement.description') }}</label>
        <pv-textarea
            id="description"
            v-model="newCertificate.description"
            required="true"
            rows="3"
            cols="20"
            fluid
            :invalid="submitted && !newCertificate.description"
            style="resize: vertical;"
        />
        <small
            v-if="submitted && !newCertificate.description"
            style="color: #ef4444;"
        >{{ $t('profile.certificateManagement.descriptionValidation') }}</small>
      </div>


      <div style="
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 1rem;">
        <div style="grid-column: span 6 / span 6;">
          <label
              for="inventoryStatus"
              style="
                display: block;
                font-weight: bold;
                margin-bottom: 0.75rem;
              "
          >{{ $t('profile.certificateManagement.certificateStatus') }}</label>
          <pv-select
              id="inventoryStatus"
              v-model="newCertificate.status"
              :options="statuses"
              optionLabel="label"
              optionValue="value"
              placeholder="Select a Status"
              fluid
              :invalid="submitted && !newCertificate.status"
          ></pv-select>
          <small
              v-if="submitted && !newCertificate.status"
              style="color: #ef4444;"
          >{{ $t('profile.certificateManagement.certificateStatusValidation') }}</small>
        </div>
        <div style="grid-column: span 6 / span 6;">
          <label
              for="quantity"
              style="
            display: block;
            font-weight: bold;
            margin-bottom: 0.75rem;
          "
          >{{ $t('profile.certificateManagement.yearsOfExperience') }}</label>
          <pv-input-number
              id="quantity"
              v-model="newCertificate.yearsOfWork"
              integeronly
              fluid
              :invalid="submitted && (!newCertificate.yearsOfWork || newCertificate.yearsOfWork === 0)"
          />
          <small
              v-if="submitted && (!newCertificate.yearsOfWork || newCertificate.yearsOfWork === 0)"
              style="color: #ef4444;"
          >{{ $t('profile.certificateManagement.yearsOfExperienceValidation') }}</small>
        </div>
      </div>



    </div>

    <template #footer>
      <pv-button
          :label="$t('profile.profileManagement.cancel')"
          icon="pi pi-times"
          text
          @click="hideDialog"
      />
      <pv-button
          :label="$t('profile.profileManagement.accept')"
          icon="pi pi-check"
          @click="saveCertificate"
      />
    </template>


  </pv-dialog>

  <!--Remove -->
  <pv-dialog
      v-model:visible="deleteCertificateDialog"
      :style="{ width: '450px' }"
      :header="$t('profile.certificateManagement.deleteTitle')"
      :modal="true">
    <div class="delete-dialog-content">
      <i class="pi pi-exclamation-triangle delete-dialog-icon" />
      <span>
        {{ $t('profile.certificateManagement.deleteQuestion') }} <b>{{ deleteCertificate.certificateCode }}</b>?
      </span>
    </div>
    <template #footer>
      <pv-button label="No" icon="pi pi-times" text @click="deleteCertificateDialog = false" />
      <pv-button label="Yes" icon="pi pi-check" @click="deleteCertificateById" />
    </template>
  </pv-dialog>



  <div class="custom-table-wrapper">
    <div class="certificaciones-card">
      <div class="seguidores-titulo-profesional">{{ $t('profile.certificateManagement.certificateListTitle') }}</div>
      <div>
        <pv-data-table v-model:expandedRows="expandedRows" :value="filteredCertificates" dataKey="id" tableStyle="min-width: 60rem; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
          <template #header>
            <div class="button-toolbar professional-toolbar">
              <div class="left-buttons">
                <pv-button :label="$t('profile.certificateManagement.certificateListAdd')" icon="pi pi-plus-circle" class="p-button-success" @click="openNew"/>
              </div>
              <div class="center-filter" style="flex:1; display:flex; justify-content:center; align-items:center;">
                <pv-input-text v-model="filterText" :placeholder="$t('profile.certificateManagement.certificateListFilter')" style="width: 540px;" />
              </div>
              <div class="right-buttons">
                <pv-button class="expand-all-btn" text icon="pi pi-plus" :label="$t('profile.certificateManagement.certificateListExpandAll')" @click="expandAll" />
                <pv-button text icon="pi pi-minus" :label="$t('profile.certificateManagement.certificateListCollapseAll')" @click="collapseAll" />
              </div>
            </div>
          </template>

          <pv-column expander style="width: 4rem;" />
          <pv-column field="institution" :header="$t('profile.certificateManagement.certificateListInstitution')">
            <template #body="slotProps">
              <span class="institution-cell table-cell-main">{{ slotProps.data.institution }}</span>
            </template>
          </pv-column>
          <pv-column field="dateObtained" :header="$t('profile.certificateManagement.certificateListStatus')">
            <template #body="slotProps">
              <span class="table-cell-main">
                <pv-tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)" />
              </span>
            </template>
          </pv-column>

          <pv-column field="certificateCode" :header="$t('profile.certificateManagement.certificateListCode')">
            <template #body="slotProps">
              <span class="table-cell-main">{{ slotProps.data.certificateCode }}</span>
            </template>
          </pv-column>

          <pv-column field="yearsOfWork" :header="$t('profile.certificateManagement.certificateListYears')">
            <template #body="slotProps">
              <span class="table-cell-main">{{ slotProps.data.yearsOfWork }}</span>
            </template>
          </pv-column>

          <pv-column :header="$t('profile.certificateManagement.certificateListActions')" style="width: 8rem;">
            <template #body="slotProps">
              <pv-button n icon="pi pi-pencil" class="p-button-rounded p-button-text" @click="editCertificate(slotProps.data)" />
              <pv-button icon="pi pi-trash" class="p-button-rounded p-button-text" @click="confirmDeleteCertificate(slotProps.data)" />
            </template>
          </pv-column>

          <template #expansion="slotProps">
            <div class="certification-card-container">
              <pv-card class="certification-card">
                <template #title>
                  <div class="cert-title-row">
                    <span class="cert-title">{{ slotProps.data.institution }}</span>
                    <pv-tag v-if="slotProps.data.gender" :value="slotProps.data.gender === 'male' ? 'Masculino' : 'Femenino'" :severity="slotProps.data.gender === 'male' ? 'info' : 'danger'" class="cert-tag" />
                  </div>
                </template>
                <template #content>
                  <div class="cert-content">
                    <p><strong class="cert-label">{{ $t('followers.certificateDialog.date') }}:</strong> {{ slotProps.data.dateObtained }}</p>
                    <p><strong class="cert-label">{{ $t('followers.certificateDialog.description') }}:</strong></p>
                    <div class="cert-description-box">
                      <span class="cert-description">{{ slotProps.data.description }}</span>
                    </div>
                    <p><strong class="cert-label">{{ $t('followers.certificateDialog.status') }}:</strong> <pv-tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)" /></p>
                    <p><strong class="cert-label">{{ $t('followers.certificateDialog.code') }}:</strong></p>
                    <div class="cert-description-box">
                      <span class="cert-description">{{ slotProps.data.certificateCode }}</span>
                    </div>

                    <p><strong class="cert-label">{{ $t('followers.certificateDialog.years') }}:</strong> {{ slotProps.data.yearsOfWork }}</p>
                  </div>
                </template>
              </pv-card>
            </div>
          </template>
        </pv-data-table>
      </div>
    </div>
  </div>




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

.delete-dialog-content {
  display: flex;
  align-items: center;
  gap: 16px; /* equivalente a gap-4 de Tailwind (4*4px) */
}
.delete-dialog-icon {
  font-size: 2rem; /* equivalente a text-3xl de Tailwind */
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