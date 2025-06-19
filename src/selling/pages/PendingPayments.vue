<template>
  <div class="container">
    <h1>Pagos pendientes</h1>

    <div v-if="loading" class="info">Cargando pagos pendientes…</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="grid">
      <div v-for="p in pending" :key="p.id" class="card">
        <p><strong>Owner ID:</strong> {{ p.ownerId }}</p>
        <p><strong>Plan:</strong> {{ p.planId }}</p>
        <p><strong>Método:</strong> {{ p.method }}</p>
        <p><strong>Monto:</strong> {{ p.amount }} {{ p.currency }}</p>
        <p><strong>Fecha tentativa:</strong> {{ p.paymentDate }}</p>
        <p><strong>Estado:</strong> {{ p.status }}</p>
        <button @click="finishPayment(p)" :disabled="processing">
          Completar pago
        </button>
      </div>
    </div>
    <!-- Botón para volver al inicio -->
    <div class="back-button">
      <router-link to="/selling" class="back-link">
        ← Volver al listado
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  getPendingByUser,
  deletePayment
} from '@/selling/services/payments.service.js';
import { createPurchasedPlan } from '@/selling/services/purchased-plans.service.js';
import { addPaymentToHistory } from '@/selling/services/purchase-history.service.js';

const props = defineProps({
  userId: { type: [String, Number], required: true }
});

const pending    = ref([]);
const loading    = ref(false);
const error      = ref(null);
const processing = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const { data } = await getPendingByUser(props.userId);
    pending.value = data;
  } catch (err) {
    console.error('Error cargando pagos pendientes:', err);
    error.value = 'No se pudieron cargar los pagos pendientes.';
  } finally {
    loading.value = false;
  }
});

async function finishPayment(p) {
  if (processing.value) return;
  processing.value = true;
  try {
    const { data: plan } = await createPurchasedPlan({
      ownerId:      p.ownerId,
      planId:       p.planId,
      purchaseDate: new Date().toISOString(),
      status:       'active'
    });

    const completed = {
      ...p,
      status:            'completed',
      paymentDate:       new Date().toISOString(),
      purchasedPlanId:   plan.id
    };

    await addPaymentToHistory(p.ownerId, completed);
    await deletePayment(p.id);
    pending.value = pending.value.filter(x => x.id !== p.id);
  } catch (err) {
    console.error('Error completando el pago:', err);
    alert('No se pudo completar el pago. Intenta de nuevo.');
  } finally {
    processing.value = false;
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  padding: 1.5rem;
  background: rgba(60, 60, 60, 0.25);
  border-radius: 8px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.95);
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

.card p {
  margin: 0.4rem 0;
  color: #4a5568;
}

.card button {
  margin-top: 1rem;
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(90deg, #dd6b20, #c05621);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.card button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.card button:hover:not(:disabled) {
  background: linear-gradient(90deg, #c05621, #dd6b20);
  transform: translateY(-2px);
}

.back-button {
  margin-top: 2rem;
  text-align: center;
}

.back-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #38a169, #2f855a);
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  transition: background 0.3s, transform 0.2s;
}

.back-link:hover {
  background: linear-gradient(90deg, #2f855a, #38a169);
  transform: translateY(-2px);
}
</style>
