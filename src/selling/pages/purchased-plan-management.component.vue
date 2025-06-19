<!-- src/selling/components/PlanForm.vue -->
<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2>{{ isEditing ? 'Editar Plan' : 'Crear Plan' }}</h2>

      <form @submit.prevent="openPaymentDialog" class="form">
        <input v-model="form.ownerId"     placeholder="Owner ID"    required />
        <input v-model="form.planId"      placeholder="Plan ID"     required />
        <input v-model="form.purchaseDate" type="date"          required />
        <select v-model="form.status">
          <option value="active">Activo</option>
          <option value="expired">Expirado</option>
        </select>

        <div class="actions">
          <button type="submit">
            {{ isEditing ? 'Actualizar' : 'Crear y Pagar' }}
          </button>
          <button
              v-if="isEditing"
              @click="handleDelete"
              type="button"
              class="delete-btn"
          >
            Eliminar
          </button>
        </div>
      </form>

      <router-link to="/selling" class="back-link">← Volver al listado</router-link>
      <button class="close-button" @click="$emit('close')">✕</button>

      <PaymentDialog
          v-if="showPay"
          :draft="draft"
          @close="onPaymentFinished"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PaymentDialog from './PaymentDialog.vue';

import {
  getPurchasedPlanById,
  createPurchasedPlan,
  updatePurchasedPlan,
  deletePurchasedPlan
} from '@/selling/services/purchased-plans.service.js';

import { patchPayment } from '@/selling/services/payments.service.js';

const router     = useRouter();
const route      = useRoute();
const form       = ref({ ownerId:'', planId:'', purchaseDate:'', status:'active' });
const isEditing  = ref(false);
const showPay    = ref(false);
const draft      = ref({});

onMounted(async () => {
  const id = route.query.id;
  if (id) {
    const { data } = await getPurchasedPlanById(id);
    form.value = { ...data };
    isEditing.value = true;
  }
});

function openPaymentDialog() {
  if (isEditing.value) {
    // Sólo actualizar sin pago
    updatePurchasedPlan(form.value.id, form.value)
        .then(() => router.push('/selling'));
  } else {
    // Preparamos el draft y abrimos modal de pago
    draft.value = { ...form.value };
    showPay.value = true;
  }
}

async function onPaymentFinished(payment) {
  showPay.value = false;
  if (!payment) return;

  if (payment.status === 'pending') {
    return router.push('/selling/payments/pending');
  }

  // Ya completado: creamos el plan y ligamos el pago
  const { data: plan } = await createPurchasedPlan({
    ownerId:      payment.ownerId,
    planId:       payment.planId,
    purchaseDate: payment.paymentDate,
    status:       'active'
  });

  await patchPayment(payment.id, { purchasedPlanId: plan.id });
  await router.push('/selling');
}

function handleDelete() {
  if (confirm('¿Seguro deseas eliminar este plan?')) {
    deletePurchasedPlan(form.value.id)
        .then(() => router.push('/selling'));
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #ededed;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: transform 0.2s;
}
.modal:hover {
  transform: translateY(-3px);
}

h2 {
  margin: 0 0 1.5rem;
  font-size: 1.6rem;
  color: #2b6cb0;
  text-align: center;
}

.form input,
.form select {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}
.form input:focus,
.form select:focus {
  outline: none;
  border-color: #2b6cb0;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.actions button {
  flex: 1;
  padding: 0.75rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.actions button[type="submit"] {
  background: linear-gradient(90deg, #38a169, #2f855a);
  color: #fff;
}
.actions button[type="submit"]:hover {
  background: linear-gradient(90deg, #2f855a, #38a169);
  transform: translateY(-2px);
}

.delete-btn {
  background: linear-gradient(90deg, #e53e3e, #c53030);
  color: #fff;
}
.delete-btn:hover {
  background: linear-gradient(90deg, #c53030, #e53e3e);
  transform: translateY(-2px);
}

.back-link {
  display: block;
  margin: 1.5rem auto 0;
  text-align: center;
  padding: 0.5rem 1rem;
  background: #2b6cb0;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.3s, transform 0.2s;
}
.back-link:hover {
  background: #2c5282;
  transform: translateY(-1px);
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: #a0aec0;
  transition: color 0.2s;
}
.close-button:hover {
  color: #718096;
}
</style>
