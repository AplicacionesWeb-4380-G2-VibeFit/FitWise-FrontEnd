<template>
  <PurchasedPlanListComponent />

  <!-- Modal para crear o editar -->
  <PurchasedPlanManagementComponent
      v-if="isCreateOrEdit"
      :id="id"
      @close="goBack"
  />

  <!-- Modal para detalles -->
  <PurchasedPlanDetailComponent
      v-if="isDetail"
      :id="id"
      @close="goBack"
  />
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import PurchasedPlanListComponent from '@/selling/components/purchased-plan-list.component.vue'
import PurchasedPlanManagementComponent from '@/selling/pages/purchased-plan-management.component.vue'
import PurchasedPlanDetailComponent from '@/selling/pages/purchased-plan-details.component.vue'

const route = useRoute()
const router = useRouter()

const isCreateOrEdit = computed(() => route.name === 'selling create' || route.name === 'selling edit')
const isDetail = computed(() => route.name === 'selling details')

const id = computed(() => route.params.id)

function goBack() {
  router.push('/selling')
}
</script>
