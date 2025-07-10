<script>
import {Exercise} from "@/publishing/model/exercise.entity.js";

export default {
  name: "exercise-form",
  emits: ['save', 'hide'],
  props: {
    editingExercise: {
      type: Exercise,
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
      exerciseData: new Exercise({}),
      submitted: false,
      loading: false,
    };
  },
  watch: {
    dialogVisible: {
      immediate: true,
      handler(newVal) {
        this.visible = newVal;

        if (newVal) {
          if (this.editingExercise) {
            this.exerciseData = new Exercise({ ...this.editingExercise });
          } else {
            this.exerciseData = new Exercise({});
          }
          this.submitted = false;
        }
      }
    }
  },
  computed: {
    dialogHeader() {
      return this.isEditMode ? 'Editar Ejercicio' : 'Crear Nuevo Ejercicio';
    },
    saveButtonLabel() {
      return this.isEditMode ? 'Actualizar' : 'Crear';
    },
    isEditMode() {
      return this.editingExercise !== null && this.editingExercise.id !== undefined;
    }
  },
  methods: {
    validateForm() {
      this.submitted = true;
      return this.exerciseData.name && this.exerciseData.description;
    },
    saveExercise() {
      if (!this.validateForm()) return;

      this.loading = true;
      try {
        const payload = new Exercise({ ...this.exerciseData });
        this.$emit('save', payload, this.isEditMode);
      } catch (error) {
        console.error('Error saving exercise:', error);
      } finally {
        this.loading = false;
      }
    },
    hideDialog() {
      this.submitted = false;
      this.loading = false;
      this.$emit('hide');
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
      :style="{ width: '35rem' }"
      @hide="onHideDialog"
      :contentStyle="{ overflow: 'visible' }"
  >
    <pv-fluid>
      <pv-float-label class="mb-4">
        <pv-input-text v-model="exerciseData.name" id="exercise-name" class="w-full" />
        <label for="exercise-name">Nombre del Ejercicio</label>
      </pv-float-label>
      <small v-if="submitted && !exerciseData.name" class="p-error">El nombre es requerido.</small>

      <pv-float-label class="mb-4">
        <pv-textarea v-model="exerciseData.description" id="exercise-description" rows="4" class="w-full" />
        <label for="exercise-description">Descripción</label>
      </pv-float-label>
      <small v-if="submitted && !exerciseData.description" class="p-error">La descripción es requerida.</small>

      <pv-float-label class="mb-4">
        <pv-input-text v-model="exerciseData.imageUri" id="exercise-image" class="w-full" />
        <label for="exercise-image">URL de Imagen (opcional)</label>
      </pv-float-label>
    </pv-fluid>

    <template #footer>
      <pv-button label="Cancelar" severity="secondary" @click="hideDialog" rounded autofocus />
      <pv-button :label="saveButtonLabel" severity="success" @click="saveExercise" :loading="loading" rounded />
    </template>
  </pv-dialog>
</template>

<style scoped>

</style>