<script>
import LanguageSwitcher from "@/public/components/language-switcher.component.vue";

export default {
  name: "header-content",
  components: { LanguageSwitcher },
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
        <pv-button class="p-button-text" icon="pi pi-bars" @click="toggleDrawer"/>
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