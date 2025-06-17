<template>
  <div class="container">
    <h1>Historial de Pagos</h1>

    <div class="grid">
      <div v-for="payment in payments" :key="payment.id" class="card">
        <h2>Pago ID: {{ payment.id }}</h2>
        <p><strong>Owner ID:</strong> {{ payment.ownerId }}</p>
        <p><strong>Plan comprado:</strong> {{ payment.purchasedPlanId }}</p>
        <p><strong>Método:</strong> {{ payment.method }}</p>
        <p><strong>Monto:</strong> {{ payment.amount }} {{ payment.currency }}</p>
        <p><strong>Fecha:</strong> {{ payment.paymentDate }}</p>
        <p><strong>Estado:</strong> {{ payment.status }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const payments = ref([])

onMounted(async () => {
  // 1. Leer TODA la colección purchaseHistory
  const res = await axios.get('http://localhost:3000/purchaseHistory')

  // 2. Aplanar todos los arreglos de payments
  const allPayments = res.data.flatMap(user => user.payments || [])

  // 3. Filtrar solo los completados
  payments.value = allPayments.filter(p => p.status === 'completed')
})
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
.card h2 {
  margin-bottom: 0.5rem;
  color: #2d89ef;
}
</style>
