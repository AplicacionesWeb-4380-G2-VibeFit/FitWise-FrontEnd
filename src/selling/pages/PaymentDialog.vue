<template>
  <div class="overlay" @click.self="$emit('close', null)">
    <div class="modal">
      <h3>Pagar plan #{{ draft.planId }}</h3>

      <label>Método:</label>
      <select v-model="payment.method">
        <option value="yape">Yape</option>
        <option value="paypal">PayPal</option>
      </select>

      <label>Monto (PEN):</label>
      <input v-model.number="payment.amount" type="number" />

      <div class="buttons">
        <button @click="payNow" :disabled="saving">Pagar ahora</button>
        <button @click="payLater" :disabled="saving">Más tarde</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { createPayment } from '@/selling/services/payments.service.js'
import { addPaymentToHistory } from '@/selling/services/purchase-history.service.js' // Asegúrate de que el path sea correcto

const props = defineProps({ draft: Object })
const emit  = defineEmits(['close'])
const saving = ref(false)

const payment = reactive({
  method: 'yape',
  amount: props.draft.price || 0
})

async function payNow () {
  saving.value = true
  try {
    const pay = await createPayment({
      id: Date.now(),
      ownerId: props.draft.ownerId,
      planId:  props.draft.planId,
      amount:  payment.amount,
      currency: 'PEN',
      method:  payment.method,
      status: 'completed',
      paymentDate: new Date().toISOString()
    })

    // ✅ Añadir al historial de pagos
    await addPaymentToHistory(props.draft.ownerId, pay.data)

    emit('close', pay.data)   // devuelve el Payment al padre
  } catch (err) {
    console.error('Error al procesar el pago:', err)
    alert('Ocurrió un error al procesar el pago.')
  } finally {
    saving.value = false
  }
}

async function payLater () {
  await finish('pending')
}

async function finish (status) {
  saving.value = true
  try {
    const pay = await createPayment({
      id: Date.now(),
      ownerId: props.draft.ownerId,
      planId:  props.draft.planId,
      amount:  payment.amount,
      currency: 'PEN',
      method:  payment.method,
      status,
      paymentDate: new Date().toISOString()
    })

    emit('close', pay.data)
  } catch (err) {
    console.error('Error al guardar el pago:', err)
    alert('Ocurrió un error al guardar el pago.')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal {
  background: #515151;
  padding: 1.5rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
}
</style>
