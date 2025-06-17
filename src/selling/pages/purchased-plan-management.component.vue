<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2>{{ isEditing ? 'Editar Plan' : 'Crear Plan' }}</h2>

      <form @submit.prevent="openPaymentDialog" class="form">
        <input v-model="form.ownerId" placeholder="Owner ID" required />
        <input v-model="form.planId" placeholder="Plan ID" required />
        <input v-model="form.purchaseDate" type="date" required />
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

      <router-link to="/selling" class="back-link">
        ← Volver al listado
      </router-link>

      <button class="close-button" @click="$emit('close')">✕</button>
    </div>

    <!-- D I Á L O G O   D E   P A G O -->
    <PaymentDialog
        v-if="showPay"
        :draft="draft"
        @close="onPaymentFinished"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PaymentDialog from './PaymentDialog.vue'

import {
  getPurchasedPlanById,
  createPurchasedPlan,
  updatePurchasedPlan,
  deletePurchasedPlan
} from '@/selling/services/purchased-plans.service.js'

import { patchPayment } from '@/selling/services/payments.service.js'

const router = useRouter()
const route = useRoute()

const form = ref({
  ownerId: '',
  planId: '',
  purchaseDate: '',
  status: 'active'
})
const isEditing = ref(false)

const showPay = ref(false)
const draft = ref({})

onMounted(async () => {
  const id = route.query.id
  if (id) {
    const existing = await getPurchasedPlanById(id)
    form.value = { ...existing }
    isEditing.value = true
  }
})

async function openPaymentDialog () {
  if (isEditing.value) {
    // ✅ Solo actualizar sin pagar
    await updatePurchasedPlan(form.value.id, form.value)
    router.push('/selling')
  } else {
    // 🛒 Crear → abrir el modal de pago
    draft.value = { ...form.value }
    showPay.value = true
  }
}

async function onPaymentFinished (payment) {
  showPay.value = false
  if (!payment) return

  if (payment.status === 'pending') {
    router.push('/selling/payments/pending')
    return
  }

  const plan = await createPurchasedPlan({
    ownerId: payment.ownerId,
    planId: payment.planId,
    purchaseDate: payment.paymentDate,
    status: 'active'
  })

  await patchPayment(payment.id, { purchasedPlanId: plan.data.id })

  router.push('/selling')
}

async function handleDelete () {
  if (confirm('¿Seguro deseas eliminar este plan?')) {
    await deletePurchasedPlan(form.value.id)
    router.push('/selling')
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
  z-index: 999;
}

.modal {
  background: #636161;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: white;
  text-align: center;
}

.form input,
.form select {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  background: #2d89ef;
  color: white;
  cursor: pointer;
  font-weight: bold;
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
  display: block;
  margin-top: 1.5rem;
  color: #2d89ef;
  text-align: center;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.close-button {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  background: transparent;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: #444;
}
</style>
