<script>
import {UserService} from "@/presenting/services/user.service.js";
import {User} from "@/presenting/model/user.entity.js";

import {Follower} from "@/presenting/model/follower.entity.js";
import {FollowerService} from "@/presenting/services/follower.service.js";


export default {
  name: "follower-form-validation",
  props: {
    followerDialog: {
      type: Boolean,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    followers: {
      type: Array,
      default: () => []
    }
  },
  emits: ['addFollower'],
  methods: {
    saveFollower() {
      this.submitted = true;
      if (this.emailSearch.trim()) {
        // Aquí puedes agregar la lógica para guardar el seguidor
        console.log("Seguidor agregado:", this.emailSearch);

        this.validationResultMessage(this.emailSearch);


        this.emailSearch = ''; // Limpiar el campo después de agregar
        this.submitted = false; // Resetear el estado de enviado
      }
    },
    validationResultMessage(email) {
      this.validationResult= null// Emitir evento para resetear validationResult
      this.userSearched = null; // Resetear el usuario buscado
      this.newFollower = null;

      this.userService.getByEmail(email)
          .then(response => {
            // Verifica si hay datos válidos
            if (!response.data || response.data.length === 0 || !response.data[0].id) {
              this.validationResult= {
                severity: 'error',
                success: true,
                message: "Email no encontrado o datos inválidos",
                icon: "pi pi-times-circle"
              };
              return;
            }

            // Toma la primera instancia porque el email es único
            const userData = response.data[0];
            this.userSearched = new User(userData);
            console.log(this.userSearched);


            if(this.userSearched.id=== this.userId) {
              this.validationResult= {
                severity: 'warn',
                success: true,
                message: "No puedes seguirte a ti mismo",
                icon: "pi pi-times-circle"
              };
              return; // Evitar que se cree un nuevo seguidor
            }
            if (
                this.followers.some(follower => follower.followingUserId === this.userSearched.id)
            ) {
              this.validationResult= {
                severity: 'info',
                success: true,
                message: "Este usuario ya es seguido",
                icon: "pi pi-times-circle"
              };
            } else {
              this.validationResult= {
                severity: 'success',
                success: true,
                message: "Email válido. Puedes seguir a este usuario.",
                icon: "pi pi-check-circle"
              };
              this.newFollower = new Follower({
                followerUserId: this.userId,
                followingUserId: this.userSearched.id
              });
              this.followerService.create(this.newFollower).then(response => {
                if (response.data && response.data.id) {
                  this.newFollower.id = response.data.id; // Asignar el ID generado

                  // Emitir un evento para agregar el nuevo seguidor a la lista en followed-details-management
                  this.$emit('addFollower', this.userSearched, this.newFollower);
                }
              }).catch(error => {
                console.error("Error creando seguidor:", error);
              });
            }
          }).catch(error => {
            this.validationResult= {
              severity: 'error',
              success: false,
              message: "Error buscando usuario por email.",
              icon: "pi pi-times-circle"
            };
          }
      );




    },

    getUserById(userId) {
      this.userService.getById(userId).then(response => {
        if (response.data) {
          this.user = new User(response.data);
        }
      }).catch(error => {
        console.error("Error fetching user:", error);
      });
    },

    getAllUsers() {
      this.userService.getAll().then(response => {
        if (response.data) {
          this.users = response.data.map(user => new User(user));
        }
      }).catch(error => {
        console.error("Error fetching users:", error);
      });
    },
  },

  data() {
    return {

      emailSearch: '',
      submitted: false,
      user: null,
      users: [],
      newFollower: null,
      userSearched: null,
      validationResult: null,
    }
  },
  created() {
    this.userService = new UserService();
    this.followerService = new FollowerService();
    this.getUserById(this.userId);
    this.getAllUsers();
  }

}
</script>

<template>

</template>

<style scoped>
.search-input-container {
  position: relative;
  display: inline-block;
  width: 100%;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  z-index: 1;
  color: #6b7280;
}

.search-input {
  width: 100%;
  padding-left: 35px !important; /* Para dar espacio al icono */
}

.search-grid {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 10px;
  align-items: flex-start; /* Alinear desde arriba para mantener el input y button al mismo nivel */
}

.search-column {
  grid-column: span 3;
  position: relative;
}

.input-wrapper {
  position: relative;
}

.button-column {
  grid-column: 4;
  text-align: right;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  display: block;
  margin-top: 4px;
  position: absolute;
  width: 100%;
}

.user-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1.5rem;
  gap: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.user-card-image {
  width: 33%;
  position: relative;
}

.user-card-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 1px solid #e0e0e0;
}

.user-card-details {
  flex: 1;
  text-align: left;
}

.user-card-username {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

.user-card-email {
  color: #666;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.user-card-name {
  color: #444;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.button-large {
  height: 2.7rem; /* Ajustar la altura del botón */
  font-size: 1rem; /* Opcional: ajustar el tamaño del texto */
  padding: 0.5rem 1rem; /* Opcional: ajustar el relleno interno */
}
</style>