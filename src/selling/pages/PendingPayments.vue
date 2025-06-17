<template>
  <div class="container">
    <h1>Pagos pendientes</h1>
    <div class="grid">
      <div v-for="p in pending" :key="p.id" class="card">
        <p><strong>Owner ID:</strong> {{ p.ownerId }}</p>
        <p><strong>Plan:</strong> {{ p.planId }}</p>
        <p><strong>Método:</strong> {{ p.method }}</p>
        <p><strong>Monto:</strong> {{ p.amount }} {{ p.currency }}</p>
        <p><strong>Fecha tentativa:</strong> {{ p.paymentDate }}</p>
        <p><strong>Estado:</strong> {{ p.status }}</p>
        <button @click="finish(p)">Completar pago</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { patchPayment, deletePayment } from '@/selling/services/payments.service.js'
import { createPurchasedPlan } from '@/selling/services/purchased-plans.service.js'
import { addPaymentToHistory } from '@/selling/services/purchase-history.service.js'

const pending = ref([])

onMounted(async () => {
  const res = await axios.get('http://localhost:3000/payments')
  pending.value = res.data.filter(p => p.status === 'pending')
})

async function finish(p) {
  // 1. Crear el plan comprado
  const plan = await createPurchasedPlan({
    ownerId: p.ownerId,
    planId: p.planId,
    purchaseDate: new Date().toISOString(),
    status: 'active'
  })

  // 2. Crear nuevo pago completado (actualizado)
  const completedPayment = {
    ...p,
    status: 'completed',
    paymentDate: new Date().toISOString(),
    purchasedPlanId: plan.data.id
  }
  async function finish(p) {
    try {
      console.log('Eliminando pago con ID:', p.id)

      const plan = await createPurchasedPlan({
        ownerId: p.ownerId,
        planId: p.planId,
        purchaseDate: new Date().toISOString(),
        status: 'active'
      })

      const completedPayment = {
        ...p,
        status: 'completed',
        paymentDate: new Date().toISOString(),
        purchasedPlanId: plan.data.id
      }

      await addPaymentToHistory(p.ownerId, completedPayment)

      // Intenta eliminar directamente
      await axios.delete(`http://localhost:3000/payments/${p.id}`)

      pending.value = pending.value.filter(pay => pay.id !== p.id)

      console.log('✅ Eliminado correctamente')
    } catch (err) {
      console.error('❌ Error al eliminar el pago:', err)
    }
  }

  // 3. Agregar al historial de pagos
  await addPaymentToHistory(p.ownerId, completedPayment)

  // 4. Eliminar el pago pendiente original
  await deletePayment(p.id)

  // 5. Quitarlo visualmente de la lista
  pending.value = pending.value.filter(pay => pay.id !== p.id)
}
</script>



<style scoped>
.container {
  padding: 1rem;
}
h1 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}
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
button {
  margin-top: 0.8rem;
  padding: 0.5rem 1rem;
  background-color: #2d89ef;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #1e5cb3;
}
</style>
