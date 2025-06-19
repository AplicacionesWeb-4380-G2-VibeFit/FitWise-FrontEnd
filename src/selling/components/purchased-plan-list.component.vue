<template>
  <div class="container">
    <h1>Purchased Plans</h1>

    <div v-if="loading" class="info">Cargando planes…</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="grid">
      <div
          v-for="plan in purchasedPlans"
          :key="plan.id"
          class="card"
      >
        <h2>Plan ID: {{ plan.planId }}</h2>
        <p><strong>Owner:</strong> {{ plan.ownerId }}</p>
        <p><strong>Date:</strong> {{ plan.purchaseDate }}</p>
        <p><strong>Status:</strong> {{ plan.status }}</p>
        <div class="links">
          <router-link :to="`/selling/${plan.id}`">Detalles</router-link>
          <router-link :to="`/selling/create?id=${plan.id}`">Editar</router-link>
        </div>
      </div>
    </div>

    <div class="create-button">
      <router-link to="/selling/create">Crear nuevo plan</router-link>
      <router-link to="/selling/payments">Ver historial de pagos</router-link>
      <router-link to="/selling/payments/pending">Pagos</router-link>

    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {getAllPurchasedPlans} from '@/selling/services/purchased-plans.service.js';

const purchasedPlans = ref([]);
const loading = ref(false);
const error = ref(null);

onMounted(async () => {
  loading.value = true;
  try {
    const response = await getAllPurchasedPlans();
    purchasedPlans.value = response.data;
  } catch (err) {
    console.error('Error fetching purchased plans:', err);
    error.value = 'No se pudieron cargar los planes. Intenta de nuevo más tarde.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.container {
  padding: 1.5rem;
  background: rgba(60, 60, 60, 0.25);

  border-radius: 8px;
}
p {
  color: #718096;

}
h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.99);
}

.info {
  color: #718096;
}

.error {
  color: #e53e3e;
}

.grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.card h2 {
  margin-bottom: 0.75rem;
  color: #2b6cb0;
}

.links {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.links a {
  padding: 0.5rem 1rem;
  background: linear-gradient(90deg, #2b6cb0, #2c5282);
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.3s, transform 0.2s;
}

.links a:hover {
  background: linear-gradient(90deg, #2c5282, #2b6cb0);
  transform: translateY(-2px);
}

.create-button {
  margin-top: 2rem;
  text-align: center;
  
}

.create-button a {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #38a169, #2f855a);
  color: #fff;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  transition: background 0.3s, transform 0.2s;
}

.create-button a:hover {
  background: linear-gradient(90deg, #2f855a, #38a169);
  transform: translateY(-2px);
}
</style>
