<template>

  <div class="container">
    <h1>Purchased Plans</h1>
    <div class="grid">
      <div v-for="plan in purchasedPlans" :key="plan.id" class="card">
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllPurchasedPlans } from '@/selling/services/purchased-plans.service.js';

const purchasedPlans = ref([]);

onMounted(async () => {
  purchasedPlans.value = await getAllPurchasedPlans();
});
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
.links {
  margin-top: 0.8rem;
  display: flex;
  justify-content: space-between;
}
.links a {
  color: #2d89ef;
  text-decoration: none;
}
.links a:hover {
  text-decoration: underline;
}
.create-button {
  margin-top: 2rem;
}
.create-button a {
  display: inline-block;
  padding: 0.6rem 1rem;
  background: #2d89ef;
  color: white;
  border-radius: 4px;
  text-decoration: none;
}
.create-button a:hover {
  background: #1e5cb3;
}
</style>