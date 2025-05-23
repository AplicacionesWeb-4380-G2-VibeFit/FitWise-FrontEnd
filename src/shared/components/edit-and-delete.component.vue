<script>
export default {
  name: "edit-and-delete",
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'delete']
}
</script>

<template>
  <div class="action-buttons">
    <pv-button
        icon="pi pi-pencil"
        outlined
        rounded
        class="mr-2"
        @click="$emit('edit', data)"
        v-tooltip.top="'Editar'"
    />
    <pv-button
        icon="pi pi-trash"
        outlined
        rounded
        severity="danger"
        @click="$emit('delete', data)"
        v-tooltip.t op="'Eliminar'"
    />
  </div>
</template>

<style scoped>
.action-buttons {
  display: flex;
  gap: 0.5rem;
}
</style>