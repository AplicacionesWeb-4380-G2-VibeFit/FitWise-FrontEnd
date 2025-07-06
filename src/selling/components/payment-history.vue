<!-- src/selling/components/PaymentHistoryList.vue -->
<template>
  <div class="container">
    <h1>Historial de Pagos</h1>

    <div v-if="loading" class="info">Cargando historial…</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="grid">
      <div
          v-for="payment in payments"
          :key="payment.id"
          class="card"
      >
        <h2>Pago ID: {{ payment.id }}</h2>
        <p><strong>Owner ID:</strong> {{ payment.ownerId }}</p>
        <p><strong>Plan comprado:</strong> {{ payment.purchasedPlanId }}</p>
        <p><strong>Método:</strong> {{ payment.method }}</p>
        <p><strong>Monto:</strong> {{ payment.amount }} {{ payment.currency }}</p>
        <p><strong>Fecha:</strong> {{ payment.paymentDate }}</p>
        <p><strong>Estado:</strong> {{ payment.status }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
<<<<<<< Updated upstream
import { ref, onMounted } from 'vue';
import { getAllPurchaseHistory } from '@/selling/services/purchase-history.service.js';
=======
import { ref, onMounted } from 'vue'
>>>>>>> Stashed changes

const payments = ref([]);
const loading  = ref(false);
const error    = ref(null);

import { getAllPurchaseHistory } from '@/selling/services/purchase-history.service.js';

onMounted(async () => {
<<<<<<< Updated upstream
  loading.value = true;
  try {
    const res = await getAllPurchaseHistory();
    // res.data es un array de { id, payments: [...] } por usuario
    const allPayments = res.data.flatMap(user => user.payments || []);
    // Filtramos solo los completados
    payments.value = allPayments.filter(p => p.status === 'completed');
  } catch (err) {
    console.error('Error al cargar historial de pagos:', err);
    error.value = 'No se pudo cargar el historial. Intenta más tarde.';
  } finally {
    loading.value = false;
  }
});
=======
  const res = await getAllPurchaseHistory();
  const allPayments = res.flatMap(user => user.payments || []);
  payments.value = allPayments.filter(p => p.status === 'completed');
});

>>>>>>> Stashed changes
</script>

<style scoped>
.container { padding: 1rem; }
h1 { font-size: 1.8rem; margin-bottom: 1rem; }
.info { color: #555; }
.error { color: #c00; }
.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
.card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
}
.card h2 { margin-bottom: 0.5rem; color: #2d89ef; }
</style>
