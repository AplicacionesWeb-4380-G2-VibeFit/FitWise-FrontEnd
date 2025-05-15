<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="container">
        <h2>{{ isEditing ? 'Editar Plan' : 'Crear Plan' }}</h2>
        <form @submit.prevent="handleSubmit" class="form">
          <input v-model="form.ownerId" placeholder="Owner ID" required />
          <input v-model="form.planId" placeholder="Plan ID" required />
          <input v-model="form.purchaseDate" type="date" required />
          <select v-model="form.status">
            <option value="active">Activo</option>
            <option value="expired">Expirado</option>
          </select>
          <div class="actions">
            <button type="submit">{{ isEditing ? 'Actualizar' : 'Crear' }}</button>
            <button v-if="isEditing" @click="handleDelete" type="button" class="delete-btn">Eliminar</button>
          </div>
        </form>
        <router-link to="/selling" class="back-link">← Volver al listado</router-link>
      </div>
      <button @click="$emit('close')">Cerrar</button>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  getPurchasedPlanById,
  createPurchasedPlan,
  updatePurchasedPlan,
  deletePurchasedPlan,
} from '@/selling/services/purchased-plans.service.js';

const router = useRouter();
const route = useRoute();

const form = ref({
  ownerId: '',
  planId: '',
  purchaseDate: '',
  status: 'active',
});
const isEditing = ref(false);

onMounted(async () => {
  const id = route.query.id;
  if (id) {
    const existing = await getPurchasedPlanById(id);
    form.value = { ...existing };
    isEditing.value = true;
  }
});

const handleSubmit = async () => {
  if (isEditing.value) {
    await updatePurchasedPlan(form.value.id, form.value);
  } else {
    await createPurchasedPlan(form.value);
  }
  router.push('/selling');
};

const handleDelete = async () => {
  if (confirm('¿Estás seguro de que deseas eliminar este plan?')) {
    await deletePurchasedPlan(form.value.id);
    router.push('/selling');
  }
};
</script>
<style scoped>
.container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
}
h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.form input,
.form select {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  background: #2d89ef;
  color: white;
  cursor: pointer;
}
button:hover {
  background: #1e5cb3;
}
.delete-btn {
  background: #d32f2f;
}
.delete-btn:hover {
  background: #a32424;
}
.back-link {
  display: inline-block;
  margin-top: 1.5rem;
  color: #2d89ef;
  text-decoration: none;
}
.back-link:hover {
  text-decoration: underline;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; bottom: 0; right: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background: #292924;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
}
</style>
