<script>
import {Meal} from "@/publishing/model/meal.entity.js";
import {Textarea as PvTextarea} from "primevue";

export default {
  name: "meal-form",
  components: {PvTextarea},
  emits: ['save', 'hide'],
  props: {
    meal: {
      type: Meal,
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
      mealData: new Meal({}),
      submitted: false,
      loading: false,
    };
  },
  watch: {
    dialogVisible: {
      handler(newValue) {
        this.visible = newValue;

        if (newValue) {
          if (this.meal) {
            // Modo edición
            this.mealData = new Meal({ ...this.meal });
          } else {
            // Modo creación
            this.mealData = new Meal({});
          }
          this.submitted = false;
        }
      },
      immediate: true
    }
  },
  computed: {
    dialogHeader() {
      return this.isEditMode ? 'Editar Meal' : 'Crear Nuevo Meal';
    },
    saveButtonLabel() {
      return this.isEditMode ? 'Actualizar Meal' : 'Guardar Meal';
    },
    isEditMode() {
      return this.meal !== null && this.meal.id !== undefined;
    }
  },
  methods: {
    validateForm() {
      this.submitted = true;
      return this.mealData.name && this.mealData.description;
    },
    saveMeal() {
      if (!this.validateForm()) return;

      this.loading = true;

      try {
        const payload = new Meal({
          ...this.mealData,
        });
        this.$emit('save', payload);
      } catch (error) {
        console.error("Error al guardar meal:", error);
      } finally {
        this.loading = false;
      }
    },
    hideDialog() {
      this.visible = false;
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
      :style="{ width: '35rem' }"
      @hide="hideDialog"
      :contentStyle="{ overflow: 'visible' }"
  >
    <pv-fluid>
      <pv-float-label class="mb-4">
        <pv-input-text v-model="mealData.name" id="meal-name" class="w-full" />
        <label for="meal-name">Nombre del Meal</label>
      </pv-float-label>
      <pv-float-label class="mb-4">
        <pv-textarea v-model="mealData.description" id="meal-description" rows="4" class="w-full"/>
        <label for="meal-description">Descripción</label>
      </pv-float-label>
      <pv-float-label class="mb-4">
        <pv-input-text v-model="mealData.imageUri" id="meal-image" class="w-full" />
        <label for="meal-image">URL de la Imagen (opcional)</label>
      </pv-float-label>
    </pv-fluid>

    <template #footer>
      <pv-button label="Cancelar" severity="secondary" @click="hideDialog" rounded />
      <pv-button :label="saveButtonLabel" severity="success" @click="saveMeal" :loading="loading"
                 :disabled="!validateForm()" rounded />
    </template>
  </pv-dialog>
</template>

<style scoped>

</style>