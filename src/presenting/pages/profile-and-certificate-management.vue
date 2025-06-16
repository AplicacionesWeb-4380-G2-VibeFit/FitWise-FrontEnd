<script>
import { User } from '@/presenting/model/user.entity.js';
import { UserService } from '@/presenting/services/user.service.js';


export default{
  name: "profile-and-certificate-management",

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

    this.userId=1; // This should be dynamically set based on the logged-in user
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