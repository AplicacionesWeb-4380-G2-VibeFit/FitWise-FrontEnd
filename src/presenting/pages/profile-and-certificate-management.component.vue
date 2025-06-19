<script>
import { User } from '@/presenting/model/user.entity.js';
import { UserService } from '@/presenting/services/user.service.js';
import CertificateListCreateAndEdit from "@/presenting/components/certificate-list-create-and-edit.component.vue";


export default{
  name: "profile-and-certificate-management",
  components: {CertificateListCreateAndEdit},

  data(){
    return {
      userId: null,
      user: new User({}),
      //Para editar el usuario
      userEdit: new User({}),
      userService: null,

      //Edicion de Perfil
      isEditModeProfile: false,

    }
  },

  methods: {
    onAccept() {
      // Aquí arreglo el birthDate para que sea un string en formato MM/DD/YYYY
      if (this.userEdit.birthDate instanceof Date) {
        const d = this.userEdit.birthDate;
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const yyyy = d.getFullYear();
        this.userEdit.birthDate = `${mm}/${dd}/${yyyy}`;
      }

      // Tu lógica aquí
      this.user = new User(JSON.parse(JSON.stringify(this.userEdit)));
      this.userService.update(this.userId, this.user);

      this.isEditModeProfile = false;
    },
    onCancel() {
      this.userEdit = new User(JSON.parse(JSON.stringify(this.user)));
      this.isEditModeProfile = false;
    }

  },
  created() {
    this.userService = new UserService();

    this.userId="1"; // This should be dynamically set based on the logged-in user
    // Fetch user data by ID
    this.userService.getById(this.userId).then(response => {
      this.user = new User(response.data);
      this.userEdit = new User(JSON.parse(JSON.stringify(this.user)));
    }).catch(error => {
      console.error("Error fetching user:", error);
      this.user = null;
    })
  },
  computed: {
    isEditDisabled() {
      // Validar email (formato simple)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Validar fecha de nacimiento (al menos 18 años)
      let isUnder18 = false;
      if (this.userEdit.birthDate) {
        const hoy = new Date();
        const nacimiento = new Date(this.userEdit.birthDate);
        const edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
          // No ha cumplido años aún este año
          if (edad - 1 < 18) isUnder18 = true;
        } else {
          if (edad < 18) isUnder18 = true;
        }
      } else {
        isUnder18 = true;
      }

      return (
          !this.userEdit.username ||
          !this.userEdit.image ||
          !this.userEdit.firstName ||
          !this.userEdit.lastName ||
          isUnder18 ||
          !this.userEdit.email ||
          !emailRegex.test(this.userEdit.email) ||
          !this.userEdit.gender ||
          !this.userEdit.aboutMe
      );
    }
  }

}
</script>

<template>
  <br>

  <!-- Hero Section Mejorada: Imagen de fondo completa, overlay verde menta delante, contenido centrado -->
  <div style="
    width: 90vw;
    max-width: 9500px;
    height: 400px;
    position: relative;
    margin: 0 auto 2rem auto;
    overflow: hidden;
    top: 0;
    left: 0;
  ">
    <!-- Imagen de fondo -->
    <img src="https://hero-workout.com/assets/images/v2/Home_ShoulderPress.jpg" alt="Hero" style="
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%; min-height: 100%; object-fit: cover; object-position: top; z-index: 1; filter: brightness(0.65);">
    <!-- Overlay verde menta con negro -->
    <div style="
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(135deg, rgba(26, 26, 26, 0.75) 0%, rgba(26, 188, 156, 0.75) 100%);
      z-index: 2;
    "></div>
    <!-- Contenido -->
    <div style="
      position: relative;
      z-index: 3;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      height: 100%;
      padding: 3.5rem 0 2.5rem 0;
    ">
      <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 1.5rem; max-width: 600px; width: 100%; padding: 0 2rem;">
        <h1 style="font-size: 2.2rem; font-weight: bold; color: #ffffff; margin-bottom: 0.5rem;">{{ $t('profile.heroImage.title') }}</h1>
        <p style="font-size: 1.15rem; color: #e0e0e0; margin-bottom: 1.5rem; max-width: 500px;">{{ $t('profile.heroImage.description') }}</p>
        <pv-button as-child v-slot="slotProps">
          <router-link
              :to="'/presenting/followers'"
              :class="slotProps['class']"
              style="background: #1abc9c; border: none; color: #fff; font-weight: 600; font-size: 1rem; padding: 0.75rem 2rem; border-radius: 2rem; display: inline-block; text-align: center; text-decoration: none;"
          >
            {{ $t('profile.heroImage.button') }}
          </router-link>
        </pv-button>
      </div>
    </div>
  </div>


  <pv-fluid>
    <!-- Grid de 2 columnas: Edición de perfil (col 1) y Card DataView (col 2) -->
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; margin-top: 2rem; align-items: start;">
      <!-- Edición de perfil -->
      <div>
        <!-- ...todo el bloque de edición de perfil (sin la card) aquí... -->
        <div style="
            background: white;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1);
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
            max-width: 1000px;
            margin: 0 auto;
          ">

          <div
              style="display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              align-items: center; gap: 1rem;">
            <!-- Columna Izquierda -->
            <div>
            </div>
            <!-- Columna Centro -->
            <div style="text-align: center;">
              <span class="perfil-titulo-principal">
                {{ $t('profile.profileManagement.title') }}
              </span>
            </div>
            <!-- Columna Derecha-->
            <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: center;">
              <pv-button
                  v-if="!isEditModeProfile"
                  severity="info"
                  raised
                  style="min-width: unset; width: auto;"
                  @click="isEditModeProfile = true"
              >
                {{ $t('profile.profileManagement.edit') }}
              </pv-button>
              <pv-button
                  v-if="isEditModeProfile"
                  severity="success"
                  raised
                  style="min-width: unset; width: auto;"
                  :disabled="isEditDisabled"
                  @click="onAccept"
              >
                {{ $t('profile.profileManagement.accept') }}
              </pv-button>
              <pv-button
                  v-if="isEditModeProfile"
                  severity="danger"
                  raised
                  style="min-width: unset; width: auto;"
                  @click="onCancel"
              >
                {{ $t('profile.profileManagement.cancel') }}
              </pv-button>
            </div>

          </div>

          <div
              style="
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                grid-template-rows: 1fr 1fr;
                column-gap: 1rem;
                row-gap: 0;
                align-items: center;
                width: 100%;
                min-height: 230px;
              "
          >
            <!-- Imagen: columna 1, filas 1 y 2 -->
            <div
                style="
                  grid-row: 1 / span 2;
                  grid-column: 1 / 2;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 100%;
                "
            >
              <img
                  v-if="user && user.image"
                  :src="userEdit.image"
                  alt="Imagen de usuario"
                  style="max-width: 200px; max-height: 200px; object-fit: contain; border-radius: 12px;"
              />

            </div>

            <!-- Username: columnas 2 y 3, fila 1 -->
            <div
                style="
                  grid-row: 1 / 2;
                  grid-column: 2 / 4;
                  display: flex;
                  flex-direction: column;
                  gap: 0.5rem;
                  width: 100%;
                "
            >
              <label for="username">{{ $t('profile.profileManagement.username') }}</label>
              <pv-input-text
                  id="username"
                  type="text"
                  v-model="userEdit.username"
                  :disabled="!isEditModeProfile"
              />
            </div>

            <!-- ImageURL: columnas 2 y 3, fila 2 -->
            <div
                style="
                  grid-row: 2 / 3;
                  grid-column: 2 / 4;
                  display: flex;
                  flex-direction: column;
                  gap: 0.5rem;
                  width: 100%;
                "
            >
              <label for="image">{{ $t('profile.profileManagement.image') }}</label>
              <pv-textarea
                  id="image"
                  rows="4"
                  v-model="userEdit.image"
                  style="resize: none;"
                  :disabled="!isEditModeProfile"
              />
            </div>
          </div>


          <div
              style="
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 1rem;
                width: 100%;
                align-items: start;
              "
          >
            <!-- Columna 1: Firstname -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%;">
              <label for="firstname">{{ $t('profile.profileManagement.firstname') }}</label>
              <pv-input-text
                  id="firstname"
                  type="text"
                  v-model="userEdit.firstName"
                  :disabled="!isEditModeProfile"
              />
            </div>

            <!-- Columna 2: Lastname -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%;">
              <label for="lastname">{{ $t('profile.profileManagement.lastname') }}</label>
              <pv-input-text
                  id="lastname"
                  type="text"
                  v-model="userEdit.lastName"
                  :disabled="!isEditModeProfile"
              />
            </div>

            <!-- Columna 3: BirthDate -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%;">
              <label for="birthDate">{{ $t('profile.profileManagement.birthdate') }}</label>
              <pv-date-picker
                  id="birthDate"
                  :showIcon="true"
                  :showButtonBar="true"
                  v-model="userEdit.birthDate"
                  :disabled="!isEditModeProfile"
              />
              <small style="color: black;">Your age must be over 18</small>
            </div>
          </div>


          <div
              style="
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 1rem;
                width: 100%;
                align-items: center;
              "
          >
            <!-- Email: ocupa columnas 1 y 2 -->
            <div style="grid-column: 1 / span 2; display: flex; flex-direction: column; gap: 0.5rem; width: 100%;">
              <label for="email">{{ $t('profile.profileManagement.email') }}</label>
              <pv-input-text id="email" type="text" v-model="userEdit.email"
                             :disabled="!isEditModeProfile"
              />
            </div>

            <!-- Gender: en columna 3 -->
            <div style="grid-column: 3 / 4; display: flex; flex-direction: column; gap: 0.5rem; width: 100%;">
              <label for="gender">{{ $t('profile.profileManagement.gender') }}</label>
              <div style="display: flex; flex-direction: row; gap: 1rem; align-items: center;">
                <div style="display: flex; align-items: center;">
                  <pv-radio-button
                      id="option1"
                      name="option"
                      value="male"
                      v-model="userEdit.gender"
                      :disabled="!isEditModeProfile"
                  />
                  <label for="option1" style="line-height: 1; margin-left: 0.5rem;">{{ $t('profile.profileManagement.male') }}</label>
                </div>
                <div style="display: flex; align-items: center;">
                  <pv-radio-button
                      id="option2"
                      name="option"
                      value="female"
                      v-model="userEdit.gender"
                      :disabled="!isEditModeProfile"
                  />
                  <label for="option2" style="line-height: 1; margin-left: 0.5rem;">{{ $t('profile.profileManagement.female') }}</label>
                </div>
              </div>
            </div>



          </div>

          <div
              style="
                  display: flex;
                  flex-direction: column;
                  gap: 0.5rem;
                  width: 100%;
                "
          >
            <label for="image">{{ $t('profile.profileManagement.aboutMe') }}</label>
            <pv-textarea
                id="image"
                rows="4"
                v-model="userEdit.aboutMe"
                style="resize: none;"
                :disabled="!isEditModeProfile"
            />
          </div>

        </div>
      </div>

      <!-- Card tipo DataView -->
      <div>
        <div
            style="
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
          padding: 2rem 1.5rem;
          max-width: 400px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        "
        >
          <div style="width: 100%; display: flex; justify-content: center;">
            <div style="position: relative;">
              <pv-tag
                  v-if="user && user.gender"
                  :value="user.gender === 'male'
    ? $t('profile.profileManagement.male')
    : $t('profile.profileManagement.female')"
                  :style="{
    position: 'absolute',
    top: '10px',
    left: '10px',
    zIndex: 2,
    background: user.gender === 'male' ? '#1976d2' : '#d32f2f',
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: '0.5rem',
    padding: '0.25rem 0.75rem',
    fontSize: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
  }"
              />
              <img
                  v-if="user && user.image"
                  :src="user.image"
                  alt="Imagen de usuario"
                  style="width: 180px; height: 180px; object-fit: cover; border-radius: 1rem; border: 2px solid #e0e0e0;"
              />
            </div>
          </div>
          <div style="width: 100%; text-align: center;">
            <span style="font-size: 2rem; font-weight: 800; color: #1a237e; letter-spacing: 1px;">{{ user.username }}</span>
            <div style="color: #666; font-size: 1.1rem; margin-top: 0.5rem; font-weight: 600;">
              <span style="font-weight: 700; color: #1976d2;">{{$t('profile.profileManagement.email')}}:</span> {{ user.email }}
            </div>
            <div style="margin-top: 0.5rem; font-size: 1.15rem; color: #444; font-weight: 600;">
              <span style="font-weight: 700; color: #1976d2;">{{$t('profile.profileManagement.name')}}:</span> {{ user.firstName }} {{ user.lastName }}
            </div>
            <div style="margin-top: 0.5rem; font-size: 1.05rem; color: #888; font-weight: 500;">
              <span style="font-weight: 700; color: #1976d2;">{{$t('profile.profileManagement.birthdate')}}</span>
              <span style="font-size: 0.95em; color: #b0b0b0; font-weight: 400;"> (MM/DD/AA):</span>
              {{ user.birthDate }}
            </div>
            <div style="margin-top: 0.5rem; font-size: 1.1rem; color: #444; font-style: italic; text-align: left; max-width: 95%; margin-left: auto; margin-right: auto; background: #f7fafd; border-radius: 0.5rem; padding: 0.75rem 1rem; min-height: 60px; word-break: break-word;">
              <span style="font-weight: 700; color: #1976d2; display: block; margin-bottom: 0.25rem;">{{$t('profile.profileManagement.aboutMe')}}:</span>
              <span style="white-space: pre-line;">{{ user.aboutMe }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ...resto del contenido (certificaciones, etc) ... -->
    <br>
    <br>

    <certificate-list-create-and-edit :userId="userId"/>


  </pv-fluid>


</template>

<style scoped>


div {
  color: #000;
}

label {
  color: #000;
}



:deep(input[disabled]) {
  background-color: #fff !important;
  color: #000 !important;
}

:deep(textarea[disabled]) {
  background-color: #fff !important;
  color: #000 !important;
}

:deep(.p-inputtext + button){
  background-color: #1a237e !important; /* Azul elegante */
  border-color: #1a237e !important;
  color: #fff !important;
}

.perfil-titulo-principal {
  font-size: 2.2rem;
  font-weight: 800;
  color: #212121; /* Cambiado a gris oscuro profesional */
  letter-spacing: 1.5px;
  text-transform: none;
  text-shadow: 0 2px 8px rgba(33,33,33,0.10); /* Sombra más sutil y neutra */
  border-left: 6px solid #1976d2; /* Azul profesional */
  padding-left: 1.2rem;
  background: linear-gradient(90deg, #f5f7fa 0%, #e3eafc 100%); /* Gradiente más suave y elegante */
  border-radius: 7px 0 0 7px;
  box-shadow: 0 1px 8px rgba(33,33,33,0.08); /* Sombra más neutra */
  display: inline-block;
}




</style>