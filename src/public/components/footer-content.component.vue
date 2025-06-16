<script>
export default {
  name: "footer-content"
}
</script>

<template>
  <footer>
    <div class="grid bg-primary mt-4 p-2 align-content-center">
      <div class="col-12 ml-3 align-items-center justify-content-center">
        <p>Copyright &copy; 2025. FitWise</p>
      </div>
      <div  class="col-12 ml-3 mt-1 align-items-center justify-content-center">
        <p>
          {{ $t('authoring-phrase.intro') }} <i class="pi pi-heart"/>
          {{ $t('authoring-phrase.use') }} <a href="https://primevue.org/" target="_blank">PrimeVue</a>
          {{ $t('authoring-phrase.author', {brand: 'VibeFit'}) }}
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/*
footer {
  position: sticky;
  bottom: 0;
  flex: 0 0 auto;
}
*/

</style>