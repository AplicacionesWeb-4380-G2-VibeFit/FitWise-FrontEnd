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
      //Presionado
      signUpPressed: false
    };
  },
  methods: {
    isOver18(birthDate) {
      // Validar formato MM/DD/YYYY
      const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
      if (!regex.test(birthDate)) return false;
      const [mm, dd, yyyy] = birthDate.split('/');
      const birth = new Date(`${yyyy}-${mm}-${dd}`);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age >= 18;
    },
    isValidUrl(url) {
      try {
        new URL(url);
        return true;
      } catch (_) {
        return false;
      }
    },
    onSignUp() {
      this.signUpPressed= true;

      if (
          !this.username ||
          !this.password ||
          !this.firstName ||
          !this.lastName ||
          !this.email ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email) ||
          !this.birthDate ||
          !/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(this.birthDate) ||
          !this.isOver18(this.birthDate) ||
          !this.gender ||
          (this.gender !== 'male' && this.gender !== 'female') ||
          !this.image ||
          !this.isValidUrl(this.image) ||
          !this.aboutMe
      ) {
        return; // No hacer nada si faltan campos o hay errores
      }


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
            <pv-input-text id="username" v-model="username" :class="['w-standard', {'p-invalid': !username && signUpPressed}]" />
            <small v-if="!username && signUpPressed" class="p-invalid">Username is required.</small>
          </pv-float-label>
        </div>
        <div class="p-field mt-5">
          <pv-float-label>
            <label for="password">Password</label>
            <pv-input-text id="password" v-model="password" :class="['w-standard', {'p-invalid': !password && signUpPressed}]" type="password" />
            <small v-if="!password && signUpPressed" class="p-invalid">Password is required.</small>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="firstName">First Name</label>
            <pv-input-text id="firstName" v-model="firstName" :class="['w-standard', {'p-invalid': !firstName && signUpPressed}]" />
            <small v-if="!firstName && signUpPressed" class="p-invalid">First Name is required.</small>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="lastName">Last Name</label>
            <pv-input-text id="lastName" v-model="lastName" :class="['w-standard', {'p-invalid': !lastName && signUpPressed}]" />
            <small v-if="!lastName && signUpPressed" class="p-invalid">Last Name is required.</small>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="email">Email</label>
            <pv-input-text
                id="email"
                v-model="email"
                :class="['w-standard', {'p-invalid': !email && signUpPressed}]"
            />
            <small v-if="!email && signUpPressed" class="p-invalid">Email is required.</small>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="birthDate">Birth Date (MM/DD/YYYY)</label>
            <pv-input-text
                id="birthDate"
                v-model="birthDate"
                :class="['w-standard', {'p-invalid': signUpPressed && (!birthDate || !/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(birthDate) || (birthDate && !isOver18(birthDate)))}]"
            />
            <small
                v-if="signUpPressed && (!birthDate || !/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(birthDate))"
                class="p-invalid"
            >
              Birth Date is required (MM/DD/YYYY).
            </small>
            <small
                v-else-if="signUpPressed && birthDate && !isOver18(birthDate)"
                class="p-invalid"
            >
              Debe ser mayor de 18 años.
            </small>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="gender">Gender</label>
            <pv-select
                id="gender"
                v-model="gender"
                :options="[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }]"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Gender"
                :class="['w-standard', {'p-invalid': !gender && signUpPressed}]"
            />
            <small v-if="!gender && signUpPressed" class="p-invalid">Gender is required.</small>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="image">Image URL</label>
            <pv-textarea
                id="image"
                v-model="image"
                :class="['w-standard','textarea-tall', {'p-invalid': (!image && signUpPressed) || (image && signUpPressed && !isValidUrl(image))}]"
                rows="2"
                :auto-resize="true"
            />
            <small v-if="!image && signUpPressed" class="p-invalid">Image is required.</small>
            <small v-else-if="image && signUpPressed && !isValidUrl(image)" class="p-invalid">Debe ser una URL válida.</small>
          </pv-float-label>
        </div>
        <div class="field mt-5">
          <pv-float-label>
            <label for="aboutMe">About Me</label>
            <pv-textarea id="aboutMe" v-model="aboutMe" rows="3" :auto-resize="true" :class="['w-standard','textarea-tall',{'p-invalid': !aboutMe && signUpPressed}]" />
            <small v-if="!aboutMe && signUpPressed" class="p-invalid">Description about you is required.</small>
          </pv-float-label>
        </div>
        <div class="p-field mt-5">
          <pv-button type="submit" class="w-standard">Sign Up</pv-button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Tu estilo existente */
.w-standard {
  width: 320px;

}

.textarea-tall {
  min-height: 120px;
  /* Puedes ajustar el valor según lo que prefieras */
}
</style>