<!-- App.vue -->
<script>
import HeaderContent from "@/public/components/header-content.component.vue";
import FooterContent from "@/public/components/footer-content.component.vue";
import { useRoute, useRouter } from 'vue-router'
import PurchasedPlanList from '@/selling/components/purchased-plan-list.component.vue'
import PurchasedPlanDetails from '@/selling/pages/purchased-plan-details.component.vue'
import PurchasedPlanManagement from '@/selling/pages/purchased-plan-management.component.vue'
import { computed } from "vue";
import SellingView from "@/selling/pages/selling-view.vue";

export default {
  name: "App",
  components: { SellingView, FooterContent, HeaderContent, PurchasedPlanList, PurchasedPlanDetails, PurchasedPlanManagement },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const isDetailsRoute = computed(() => route.name === 'selling-details');
    const isCreateOrEditRoute = computed(() =>
        route.name === 'selling-create' || route.name === 'selling-edit'
    );

    function goBack() {
      router.push('/selling');
    }

    return { isDetailsRoute, isCreateOrEditRoute, goBack };
  },
  data() {
    return {
      items: [
        { label: 'option.home', to: '/home' },
        { label: 'option.about', to: '/about' },
        { label: 'option.reviews', to: '/reviewing' },
        { label: 'option.profile',      to: '/presenting/profile'},
        { label: 'option.routine-management', to: '/publishing' },
        { label: 'option.routine-sales', to: '/selling' },
        { label: 'option.schedule', to: '/organizing' }
      ]
    };
  }
};
</script>

<template>
  <pv-toast />
  <pv-confirm-dialog />

  <header-content :items="items" />

  <main>
    <router-view />

  </main>

  <footer-content />
  <!-- Modal de Detalles -->
  <PurchasedPlanDetails v-if="isDetailsRoute" @close="goBack" />

  <!-- Modal de Crear/Editar -->
  <PurchasedPlanManagement v-if="isCreateOrEditRoute" @close="goBack" />

</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
