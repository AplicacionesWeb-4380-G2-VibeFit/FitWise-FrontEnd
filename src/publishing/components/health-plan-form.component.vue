<script>
import {HealthPlan} from "@/publishing/model/health-plan.entity.js";
import {useSessionStore} from "@/shared/stores/sessionStore.js";

export default {
  name: "health-plan-form",
  emits: ['save', 'hide'],
  props: {
    editingPlan: {
      type: HealthPlan,
      default: null,
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      visible: this.dialogVisible,
      planData: new HealthPlan({
        currency: 'USD'
      }),
      submitted: false,
      loading: false,
      durationTypeOptions: ['Day', 'Week', 'Month', 'Year'],

      currencies: [
        { name: 'USD', code: 'USD' },
        { name: 'PEN', code: 'PEN' },
        { name: 'EUR', code: 'EUR' }
      ]
    };
  },
  computed: {
    dialogHeader() {
      return this.isEditMode ? 'Editar Plan de Salud' : 'Crear Nuevo Plan de Salud';
    },
    saveButtonLabel() {
      return this.isEditMode ? 'Actualizar Plan' : 'Guardar Plan';
    },
    isEditMode() {
      return this.editingPlan !== null && this.editingPlan.id !== undefined;
    }
  },
  watch: {
    dialogVisible(newVal) {
      this.visible = newVal;
      if (newVal && !this.isEditMode) {
        this.planData = new HealthPlan({});
        const sessionStore = useSessionStore();
        this.planData.profileId = sessionStore.getUserId;
      }
    },
    editingPlan: {
      handler(newVal) {
        if (newVal) {
          this.planData = new HealthPlan({ ...newVal });
        } else {
          this.planData = new HealthPlan({});
          const sessionStore = useSessionStore();
          this.planData.profileId = sessionStore.getUserId;
        }
        this.submitted = false;
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    hideDialog() {
      this.visible = false;
      this.$emit('hide');
    },
    validateForm() {
      this.submitted = true;
      return (
          this.planData.planName &&
          this.planData.durationValue &&
          this.planData.durationType &&
          this.planData.priceValue
      );
    },
    async savePlan() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      try {
        let payload = { ...this.planData };

        if (!this.isEditMode) {
          delete payload.id;
        }

        this.$emit('save', payload, this.isEditMode);
      } catch (error) {
        console.error("Error preparing to save plan:", error);
      } finally {
        this.loading = false;
      }
    },
    onHideDialog() {
      this.submitted = false;
      this.loading = false;
      this.$emit('hide');
    }
  }
}
</script>

<template>
  <pv-dialog
      v-model:visible="visible"
      modal
      :header="dialogHeader"
      :style="{ width: '40rem' }"
      @hide="onHideDialog"
      :contentStyle="{ overflow: 'visible' }">
    <pv-fluid>

      <label for="plan-name" class="font-bold block mb-2">Nombre del Plan de salud</label>
      <pv-float-label class="mb-4" variant="on">
        <pv-input-text
            id="plan-name"
            v-model="planData.planName"
            class="w-full m-1"/>
        <label for="plan-name" class="z-5">Nombre del Plan</label>
      </pv-float-label>

      <label for="plan-description" class="font-bold block mb-2">Descripción del plan de salud</label>
      <pv-float-label class="mb-4" variant="on">
        <pv-textarea id="plan-description" v-model="planData.description" rows="4" class="w-full"/>
        <label for="plan-description" class="z-5">Descripción del Plan</label>
      </pv-float-label>

      <label for="plan-objective" class="font-bold block mb-2">Objetivo del plan de salud</label>
      <pv-float-label class="mb-4" variant="on">
        <pv-input-text
            id="plan-objective"
            v-model="planData.objective"
            class="w-full m-1"/>
        <label for="plan-objective" class="z-5">Objetivo</label>
      </pv-float-label>

      <div class="flex flex-wrap gap-6 mb-3">
        <div class="flex-auto">
          <label for="plan-duration-value" class="font-bold block mb-2">Tiempo de duración</label>
          <pv-input-number v-model="planData.durationValue" showButtons inputId="plan-duration-value"
                           class="w-full" placeholder="Cantidad de días, semanas, etc"/>
        </div>

        <div class="flex-auto">
          <label for="plan-duration-type" class="font-bold block mb-2">Tipo de duración</label>

          <pv-select inputId="plan-duration-type" v-model="planData.durationType" :options="durationTypeOptions"
                     placeholder="Select a duration type" :highlightOnSelect="false" class="w-full md:w-56"/>
        </div>
      </div>

      <div class="flex flex-wrap gap-6">
        <div class="flex-auto">
          <label for="plan-price" class="font-bold block mb-2">Precio</label>
          <pv-input-number v-model="planData.priceValue" inputId="plan-price" showButtons class="w-full" mode="currency"
                           :currency="planData.currency" placeholder="0.00" :currency-symbol="true" fluid
                           :min="0" :max="1000000"/>
        </div>

        <div class="flex-auto">
          <label for="plan-currency" class="font-bold block mb-2">Tipo de moneda</label>
          <pv-select inputId="plan-currency" v-model="planData.currency" :options="currencies" optionLabel="name"
                     placeholder="Select a currency" :highlightOnSelect="false" class="w-full md:w-56" optionValue="code"/>
        </div>
      </div>
    </pv-fluid>
    <template #footer>
      <pv-button label="Cancelar" severity="secondary" @click="hideDialog" autofocus rounded/>
      <pv-button :label="saveButtonLabel" severity="success" @click="savePlan" :loading="loading"
                 :disabled="!validateForm()" rounded/>
    </template>
  </pv-dialog>
</template>

<style scoped>

</style>