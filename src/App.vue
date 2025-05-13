<script >
import HeaderContent from "@/public/components/header-content.component.vue";
import FooterContent from "@/public/components/footer-content.component.vue";

export default {
  name: "App",
  components: { FooterContent, HeaderContent },
  data(){
    return {
      items: [
        {label: 'option.home',       to: '/home'},
        {label: 'option.about',      to: '/about'},
      ]
    }
  }
}
</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>

  <header-content :items="items"/>

  <main>
    <router-view/>
  </main>

  <footer-content/>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
