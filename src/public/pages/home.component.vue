<script>
export default {
  name: "home",
  title: "Home"
}
</script>

<template>
  <div class="home-container">
    <section class="home-hero">
      <h1 class="home-title">Bienvenido a <span class="fitwise-highlight">FitWise</span></h1>
      <p class="home-subtitle">Tu compañero digital para transformar tu salud, a tu ritmo.</p>
      <div class="home-actions">
        <pv-button
            label="Ver Planes"
            icon="pi pi-play"
            class="p-button-success p-button-lg"
            @click="$router.push('/publishing')"
        />
        <pv-button
            label="Mi Perfil"
            icon="pi pi-user"
            class="p-button-outlined p-button-secondary p-button-lg"
            @click="$router.push('/presenting/profile')"
        />
      </div>
    </section>

    <section class="home-features grid mt-4">
      <div class="col-12 md:col-4 p-2">
        <div class="feature-card">
          <i class="pi pi-dumbbell text-3xl text-green-700 mb-2"></i>
          <h3>Rutinas Flexibles</h3>
          <p>Diseña entrenamientos que se ajustan a tus horarios y nivel.</p>
        </div>
      </div>
      <div class="col-12 md:col-4 p-2">
        <div class="feature-card">
          <i class="pi pi-apple text-3xl text-green-700 mb-2"></i>
          <h3>Nutrición Personalizada</h3>
          <p>Planes alimenticios pensados en tu día a día y cultura gastronómica.</p>
        </div>
      </div>
      <div class="col-12 md:col-4 p-2">
        <div class="feature-card">
          <i class="pi pi-chart-line text-3xl text-green-700 mb-2"></i>
          <h3>Seguimiento Visual</h3>
          <p>Monitorea tu avance con gráficos, badges y más.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.home-hero {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  color: #fff;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}

.home-title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.fitwise-highlight {
  color: #ffdd57;
}

.home-subtitle {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.home-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.feature-card {
  background-color: #f6fdf9;
  border: 1px solid #c3e6cb;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(40, 167, 69, 0.15);
}

.feature-card h3 {
  color: #218838;
  margin: 0.5rem 0;
}

.feature-card p {
  font-size: 0.95rem;
  color: #495057;
}
</style>
