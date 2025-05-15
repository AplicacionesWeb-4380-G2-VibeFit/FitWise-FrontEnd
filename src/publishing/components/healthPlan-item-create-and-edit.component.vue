<script>
import CreateAndEdit from "@/shared/components/create-and-edit.component.vue";

export default {
  name: "healthPlan-item-create-and-edit",
  components: {CreateAndEdit},
  emits: ['cancel-requested', 'save-requested'],
  props: {
    item: null,
    visible: false,
    isEdit: false
  },
  data() {
    return {
      submitted: false
    }
  },
  methods: {
    onCancelRequested() {
      this.submitted = false;
      this.$emit('cancel-requested');
    },
    onSaveRequested() {
      this.submitted = true;
      this.$emit('save-requested', this.item);
    }
  }
}
</script>

<template>
  <create-and-edit
      :entity="item"
      :visible="visible"
      entity-name="Health Plan"
      :edit="isEdit"
      @cancel-action-requested="onCancelRequested"
      @save-action-requested="onSaveRequested"
  >
    <template #content>
      <div class="p-fluid grid p-2">
        <!-- Nombre -->
        <div class="field col-12 md:col-6">
          <pv-float-label>
            <pv-input-text
                id="name"
                v-model="item.name"
                :class="{ 'p-invalid': submitted && !item.name }"
                class="p-inputtext"
            />
            <label for="name">
              <i class="pi pi-tag mr-2"></i>Name
            </label>
          </pv-float-label>
          <small v-if="submitted && !item.name" class="p-error">
            <i class="pi pi-exclamation-circle mr-1"></i>Name is required
          </small>
        </div>

        <!-- Objetivo -->
        <div class="field col-12 md:col-6">
          <pv-float-label>
            <pv-input-text
                id="objective"
                v-model="item.objective"
                :class="{ 'p-invalid': submitted && !item.objective }"
                class="p-inputtext"
            />
            <label for="objective">
              <i class="pi pi-bullseye mr-2"></i>Objective
            </label>
          </pv-float-label>
          <small v-if="submitted && !item.objective" class="p-error">
            <i class="pi pi-exclamation-circle mr-1"></i>Objective is required
          </small>
        </div>

        <!-- Duración -->
        <div class="field col-12 md:col-4">
          <pv-float-label>
            <pv-input-text
                id="duration"
                v-model="item.duration"
                :class="{ 'p-invalid': submitted && !item.duration }"
                class="p-inputtext"
            />
            <label for="duration">
              <i class="pi pi-calendar mr-2"></i>Duration
            </label>
          </pv-float-label>
          <small v-if="submitted && !item.duration" class="p-error">
            <i class="pi pi-exclamation-circle mr-1"></i>Duration is required
          </small>
        </div>

        <!-- Precio -->
        <div class="field col-12 md:col-4">
          <pv-float-label>
            <pv-input-number
                id="price"
                v-model="item.price"
                mode="currency"
                currency="USD"
                locale="en-US"
                :class="{ 'p-invalid': submitted && !item.price }"
                class="p-inputnumber-input"
            />
            <label for="price">
              <i class="pi pi-dollar mr-2"></i>Price
            </label>
          </pv-float-label>
          <small v-if="submitted && !item.price" class="p-error">
            <i class="pi pi-exclamation-circle mr-1"></i>Price is required
          </small>
        </div>

        <!-- Creador ID -->
        <div class="field col-12 md:col-4">
          <pv-float-label>
            <pv-input-number
                id="creadorId"
                v-model="item.creadorId"
                :class="{ 'p-invalid': submitted && !item.creadorId }"
                class="p-inputnumber-input"
            />
            <label for="creadorId">
              <i class="pi pi-user mr-2"></i>Creator ID
            </label>
          </pv-float-label>
          <small v-if="submitted && !item.creadorId" class="p-error">
            <i class="pi pi-exclamation-circle mr-1"></i>Creator ID is required
          </small>
        </div>

        <!-- Descripción -->
        <div class="field col-12">
          <pv-float-label>
            <pv-textarea
                id="description"
                v-model="item.description"
                rows="3"
                auto-resize
                :class="{ 'p-invalid': submitted && !item.description }"
                class="p-inputtext"
            />
            <label for="description">
              <i class="pi pi-align-left mr-2"></i>Description
            </label>
          </pv-float-label>
          <small v-if="submitted && !item.description" class="p-error">
            <i class="pi pi-exclamation-circle mr-1"></i>Description is required
          </small>
        </div>
      </div>
    </template>
  </create-and-edit>
</template>

<style scoped>
.p-fluid .field {
  margin-bottom: 1.5rem;
}

.p-inputtext, .p-inputnumber-input {
  width: 100%;
}

.p-float-label label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.p-error {
  display: flex;
  align-items: center;
  margin-top: 0.25rem;
}
</style>