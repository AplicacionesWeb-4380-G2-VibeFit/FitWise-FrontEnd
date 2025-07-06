<!-- src/selling/components/PaymentDialog.vue -->
<template>
  <div class="overlay" @click.self="close(null)">
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
import { addPaymentToHistoryNow } from '@/selling/services/purchase-history.service.js'
import { createPurchasedPlan } from '@/selling/services/purchased-plans.service.js' // ✅ NUEVO

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
    const res = await createPayment({
      id: Date.now(),
      ownerId: props.draft.ownerId,
      planId:  props.draft.planId,
      amount:  payment.amount,
      currency: 'PEN',
      method:  payment.method,
      status: 'completed',
      paymentDate: new Date().toISOString()
    })

    const pay = res.data
    if (!pay || !pay.id) throw new Error('No se generó el pago correctamente.')

    // 1. Historial
    await addPaymentToHistoryNow(props.draft.ownerId, pay)

    // 2. Purchased Plan
    await createPurchasedPlan({
      ownerId: props.draft.ownerId,
      planId: props.draft.planId,
      purchaseDate: new Date().toISOString(),
      status: 'active'
    })

    emit('close', pay)
  } catch (err) {
    console.error('❌ Error al procesar el pago:', err)
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
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: transform 0.2s;
}
.modal:hover {
  transform: translateY(-3px);
}

.modal h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #2b6cb0;
  font-size: 1.5rem;
  text-align: center;
}

label {
  display: block;
  margin: 0.75rem 0 0.25rem;
  color: #4a5568;
  font-weight: 500;
}

select,
input[type="number"] {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  transition: border-color 0.2s;
}
select:focus,
input[type="number"]:focus {
  outline: none;
  border-color: #2b6cb0;
}

.buttons {
  margin-top: 1.5rem;
  display: flex;
  gap: 0.75rem;
}

.buttons button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.buttons button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.buttons button:first-child {
  background: linear-gradient(90deg, #38a169, #2f855a);
  color: #fff;
}
.buttons button:first-child:hover:not(:disabled) {
  background: linear-gradient(90deg, #2f855a, #38a169);
  transform: translateY(-2px);
}

.buttons button:last-child {
  background: linear-gradient(90deg, #dd6b20, #c05621);
  color: #fff;
}
.buttons button:last-child:hover:not(:disabled) {
  background: linear-gradient(90deg, #c05621, #dd6b20);
  transform: translateY(-2px);
}

/* Cerrar modal (X) */
.modal::before {
  content: "✕";
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.2rem;
  color: #a0aec0;
  cursor: pointer;
  transition: color 0.2s;
}
.modal::before:hover {
  color: #718096;
}
</style>
