<script>
export default {
  name: "about",
  title: "About Us"
}
</script>

<template>
  <div class="about-container">
    <section class="about-hero">
      <h1 class="about-title">Sobre <span class="fitwise-highlight">FitWise</span></h1>
      <p class="about-subtitle">Transformamos el bienestar en una experiencia accesible, flexible y sostenible.</p>
    </section>

    <section class="about-content">
      <p>
        FitWise es una plataforma digital de fitness diseñada para ayudarte a crear rutinas y planes de nutrición
        personalizados que se adaptan a tu tiempo, nivel y objetivos. Queremos que la salud sea un hábito posible para todos.
      </p>
      <p>
        Nuestra misión es empoderar a las personas para llevar un estilo de vida saludable,
        combinando tecnología y acompañamiento constante. Con FitWise, no importa si recién comienzas o si ya tienes experiencia:
        aquí encontrarás un aliado que crece contigo.
      </p>
    </section>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.about-hero {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  color: #fff;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 2rem;
}

.about-title {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
}

.fitwise-highlight {
  color: #ffdd57;
}

.about-subtitle {
  font-size: 1.2rem;
}

.about-content p {
  font-size: 1rem;
  color: #495057;
  margin-bottom: 1rem;
  line-height: 1.6;
  background-color: #f6fdf9;
  padding: 1rem;
  border-left: 4px solid #28a745;
  border-radius: 6px;
}
</style>
