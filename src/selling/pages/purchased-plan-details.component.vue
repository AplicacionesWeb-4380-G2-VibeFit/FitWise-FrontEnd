<!-- src/selling/components/PurchasedPlanDetail.vue -->
<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="container">
        <h1>Detalle del Plan</h1>

        <div v-if="loading" class="info">Cargando detalle…</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else>
          <p><strong>ID:</strong> {{ plan.id }}</p>
          <p><strong>Owner ID:</strong> {{ plan.ownerId }}</p>
          <p><strong>Plan ID:</strong> {{ plan.planId }}</p>
          <p><strong>Fecha de Compra:</strong> {{ plan.purchaseDate }}</p>
          <p><strong>Estado:</strong> {{ plan.status }}</p>
        </div>

        <router-link to="/selling" class="back-link">← Volver al listado</router-link>
      </div>
      <button @click="$emit('close')">Cerrar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getPurchasedPlanById } from '@/selling/services/purchased-plans.service.js';

const route   = useRoute();
const plan    = ref({});
const loading = ref(false);
const error   = ref(null);

onMounted(async () => {
  loading.value = true;
  try {
    const { data } = await getPurchasedPlanById(route.params.id);
    plan.value = data;
  } catch (err) {
    console.error('Error cargando plan:', err);
    error.value = 'No se pudo cargar el plan.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #ededed;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: transform 0.2s;
}
.modal:hover {
  transform: translateY(-3px);
}

.container {
  max-width: 500px;
  margin: 0 auto;
}

h1 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
  color: #2b6cb0;
}

p {
  margin: 0.5rem 0;
  color: #4a5568;
}

.info {
  color: #718096;
}

.error {
  color: #e53e3e;
}

.back-link {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(90deg, #38a169, #2f855a);
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.3s, transform 0.2s;
}
.back-link:hover {
  background: linear-gradient(90deg, #2f855a, #38a169);
  transform: translateY(-2px);
}

button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.4rem 0.8rem;
  background: linear-gradient(90deg, #e53e3e, #c53030);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s, transform 0.2s;
}
button:hover {
  background: linear-gradient(90deg, #c53030, #e53e3e);
  transform: translateY(-1px);
}
</style>
