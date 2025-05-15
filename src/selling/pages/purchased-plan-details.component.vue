<template>

  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="container">
        <h1>Detalle del Plan</h1>
        <p><strong>ID:</strong> {{ plan.id }}</p>
        <p><strong>Owner ID:</strong> {{ plan.ownerId }}</p>
        <p><strong>Plan ID:</strong> {{ plan.planId }}</p>
        <p><strong>Fecha de Compra:</strong> {{ plan.purchaseDate }}</p>
        <p><strong>Estado:</strong> {{ plan.status }}</p>
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

const route = useRoute();
const plan = ref({});

onMounted(async () => {
  plan.value = await getPurchasedPlanById(route.params.id);
});
</script>
<style scoped>
.container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  background: #3c3c36;
  border-radius: 8px;
}
h1 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
}
p {
  margin: 0.4rem 0;
}
.back-link {
  display: inline-block;
  margin-top: 1.5rem;
  color: #2d89ef;
  text-decoration: none;
}
.back-link:hover {
  text-decoration: underline;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; bottom: 0; right: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background: #292924;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
}
</style>