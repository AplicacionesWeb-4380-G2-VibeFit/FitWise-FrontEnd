<script>
import {useAuthenticationStore} from "../services/authentication.store.js";
import {SignUpRequest} from "../model/sign-up.request.js";

export default {
  name: "sign-up",
  data() {
    return {
      authenticationStore: useAuthenticationStore(),
      username: "",
      password: "",
      // --- ¡NUEVOS CAMPOS AQUÍ! ---
      firstName: "",
      lastName: "",
      email: "",
      birthDate: "", // Recuerda el formato MM/DD/YYYY
      gender: "",    // Considera usar un select o radio para esto si es un enum
      image: "",     // URL de la imagen
      aboutMe: "",
      // --------------------------
    };
  },
  methods: {
    onSignUp() {
      let signUpRequest = new SignUpRequest(
          this.username,
          this.password,
          // --- ¡PASANDO TODOS LOS CAMPOS AL CONSTRUCTOR! ---
          this.firstName,
          this.lastName,
          this.email,
          this.birthDate,
          this.gender,
          this.image,
          this.aboutMe
          // -------------------------------------------------
      );
      this.authenticationStore.signUp(signUpRequest, this.$router);
    }
  }
}
</script>

<template>
  <div>
    <h3>Sign Up</h3>
  </div>
  <p class="p-fluid mb-5">Please enter the required information to sign up.</p>
  <div>
    <form @submit.prevent="onSignUp">
      <div class="p-fluid">
        <div class="field mt-5">
          <pv-float-label>
            <label for="username">Username</label>
            <pv-input-text id="username" v-model="username" :class="{'p-invalid': !username}"/>
            <small v-if="!username" class="p-invalid">Username is required.</small>
          </pv-float-label>
        </div>
        <div class="p-field mt-5">
          <pv-float-label>
            <label for="password">Password</label>
            <pv-input-text id="password" v-model="password" :class="{'p-invalid': !password}" type="password"/>
            <small v-if="!password" class="p-invalid">Password is required.</small>
          </pv-float-label>
        </div>

        <div class="field mt-5">
          <pv-float-label>
            <label for="firstName">First Name</label>
            <pv-input-text id="firstName" v-model="firstName" :class="{'p-invalid': !firstName}"/>
            <small v-if="!firstName" class="p-invalid">First Name is required.</small>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="lastName">Last Name</label>
            <pv-input-text id="lastName" v-model="lastName" :class="{'p-invalid': !lastName}"/>
            <small v-if="!lastName" class="p-invalid">Last Name is required.</small>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="email">Email</label>
            <pv-input-text id="email" v-model="email" :class="{'p-invalid': !email}"/>
            <small v-if="!email" class="p-invalid">Email is required.</small>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="birthDate">Birth Date (MM/DD/YYYY)</label>
            <pv-input-text id="birthDate" v-model="birthDate" :class="{'p-invalid': !birthDate}"/>
            <small v-if="!birthDate" class="p-invalid">Birth Date is required (MM/DD/YYYY).</small>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="gender">Gender</label>
            <pv-input-text id="gender" v-model="gender" :class="{'p-invalid': !gender}"/>
            <small v-if="!gender" class="p-invalid">Gender is required.</small>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="image">Image URL</label>
            <pv-input-text id="image" v-model="image"/>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="aboutMe">About Me</label>
            <pv-textarea id="aboutMe" v-model="aboutMe" rows="3" :auto-resize="true"/>
          </pv-float-label>
        </div>
        <div class="p-field mt-5">
          <pv-button type="submit">Sign Up</pv-button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Tu estilo existente */
</style>