<script>
import LanguageSwitcher from "@/public/components/language-switcher.component.vue";
import AuthenticationSection from "@/iam/components/authentication-section.component.vue";

export default {
  name: "header-content",
  components: {AuthenticationSection, LanguageSwitcher },
  data() {
    return {
      drawer: false
    };
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
      this.$emit('drawer-toggle', this.drawer);
    }
  }
}
</script>

<template>
  <header>
    <pv-toolbar class="bg-primary">
      <template #start>
        <i class="pi pi-bars text-4xl text-white mr-3" @click="toggleDrawer"/>
        <h3>FitWise</h3>
      </template>
      <template #center>
        <div class="flex-column">
          <pv-button v-for="item in items" :key="item.label" as-child v-slot="slotProps">
            <router-link :to="item.to" :class="slotProps['class']">{{ $t(item.label) }}</router-link>
          </pv-button>
        </div>
      </template>
      <template #end>
        <authentication-section/>
        <language-switcher/>
      </template>
    </pv-toolbar>
    <pv-drawer v-model:visible="drawer"/>
  </header>
</template>

<style scoped>
header {
  flex: 0 0 auto;
}
</style>