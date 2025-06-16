<script>
import {UserService} from "@/presenting/services/user.service.js";
import {FollowerService} from "@/presenting/services/follower.service.js";
import {User} from "@/presenting/model/user.entity.js";
import {Follower} from "@/presenting/model/follower.entity.js";
import { ref } from 'vue';


export default {
  name: "followers-management",
  components: {},
  data(){
    return {
      userId: null,
      followers: [],
      followedUsers: [],
      filterValue: '', // Nueva variable para filtrar seguidores

      userService: null,
      followerService: null,

      followerDialog: false,

      deleteFollowerDialog: false,

      deleteFollowedUser: null,

      certificateDialogVisible: false,
      selectedUserId: null,
      certificateDialogKey: 0, // Clave para reiniciar el componente
    }

  },
  methods: {
    getFollowedUsersByUserId(){
      this.followerService.getByFollowerUserId(this.userId).then(
        (response) => {
          this.followers = response.data.map(follower => new Follower(follower));
          // Ejecutar solo si followers NO está vacío
          if (this.followers.length > 0) {
            this.followedUsers = []; // Limpia la lista antes de llenarla
            for (const follower of this.followers) {
              this.userService.getById(follower.followingUserId)
                  .then(response => {
                    const user = new User(response.data);
                    this.followedUsers.push(user);
                    console.log(this.followedUsers);
                  })
                  .catch(error => {
                    console.error("Error fetching user:", error);
                  });
            }

          }
        }
      ).catch(error => {
        console.error("Error fetching followers:", error);
      });
    },
    handleAddFollower(newUserFollowed, newFollower) {
      // Agregar el nuevo seguidor a la lista followedUsers
      this.followedUsers.push(newUserFollowed);
      this.followers.push(newFollower);
    },
    confirmDeleteFollowed(item) {
      this.deleteFollowerDialog = true;
      this.deleteFollowedUser = null;
      this.deleteFollowedUser = new User({ ...item }); // Copiar los datos del objeto en lugar de asignar el puntero
    },

    deleteFollowerByFollowingUserId() {
      const followerToDelete = this.followers.find(follower => follower.followingUserId === this.deleteFollowedUser.id);
      this.followerService.delete(followerToDelete.id)
          .then(() => {
            this.followers = this.followers.filter(follower => follower.followingUserId !== this.deleteFollowedUser.id);
            this.followedUsers = this.followedUsers.filter(user => user.id !== this.deleteFollowedUser.id);
            this.deleteFollowerDialog = false;
            console.log("Follower deleted successfully");
          })
          .catch(error => {
            console.error("Error deleting follower:", error);
          });
    },

    openCertificateDialog(followedUserId) {
      this.selectedUserId = followedUserId;
      this.certificateDialogVisible = false; // Cierra el diálogo si está abierto
      this.certificateDialogKey++; // Incrementa la clave para reiniciar el componente
      this.$nextTick(() => {
        this.certificateDialogVisible = true; // Vuelve a abrir el diálogo
      });
    }




  },

  computed: {
    filteredFollowedUsers() {
      if (!this.filterValue || this.filterValue.trim() === '') {
        return this.followedUsers;
      }

      const searchTerm = this.filterValue.toLowerCase().trim();

      return this.followedUsers.filter(user => {

        const normalize = str => (str || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

        const firstName = normalize(user.firstName);
        const lastName = normalize(user.lastName);
        const fullName = [firstName, lastName].filter(Boolean).join(' ');
        const username = normalize(user.username);
        const email = normalize(user.email);


        return username.includes(searchTerm) ||
            email.includes(searchTerm) ||
            fullName.includes(searchTerm);
      });
    }
  },

  setup() {
    const layout = ref('list');
    const options = ['list', 'grid'];
    return {
      layout,
      options
    };
  },

  created() {
    this.userId=1; // This should be dynamically set based on the logged-in user
    this.followerService = new FollowerService();
    this.userService = new UserService();

    this.getFollowedUsersByUserId();


  }

}
</script>

<template>
  <br>
  <!-- Hero Section para la página de seguidos -->
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
    <img src="https://img.freepik.com/foto-gratis/gente-latina-entrena-al-aire-libre_23-2151039413.jpg?semt=ais_hybrid&w=740" alt="Comunidad entrenando" style="
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
        <h1 style="font-size: 2.2rem; font-weight: bold; color: #ffffff; margin-bottom: 0.5rem;">{{ $t('followers.heroImage.title') }}</h1>
        <p style="font-size: 1.15rem; color: #e0e0e0; margin-bottom: 1.5rem; max-width: 500px;">
          {{ $t('followers.heroImage.description') }}
        </p>
        <div style="display: flex; gap: 1rem;">
          <pv-button as-child v-slot="slotProps">
            <router-link
                :to="'/presenting/profile'"
                :class="slotProps['class']"
                style="background: #1abc9c; border: none; color: #fff; font-weight: 600; font-size: 1rem; padding: 0.75rem 2rem; border-radius: 2rem; display: inline-block; text-align: center; text-decoration: none;"
            >
              {{ $t('followers.heroImage.return') }}
            </router-link>
          </pv-button>
          <pv-button
              icon="pi pi-plus"
              :label="$t('followers.heroImage.button')"
              style="background: #ffffff; border: none; color: #1a3a2a; font-weight: 600; font-size: 1rem; padding: 0.75rem 2rem; border-radius: 2rem;"
              @click="followerDialog = true"
          />
        </div>
      </div>
    </div>
  </div>

  //COMPONENTS
  //
  //

  <!--Remove -->
  <pv-dialog
      v-model:visible="deleteFollowerDialog"
      :style="{ width: '450px' }" header="Delete Follower"
      :modal="true">
    <div class="delete-dialog-content">
      <i class="pi pi-exclamation-triangle delete-dialog-icon" />
      <span>
            Are you sure you want to delete <b>{{ deleteFollowedUser.email }}</b>?
      </span>
    </div>
    <template #footer>
      <pv-button label="No" icon="pi pi-times" text @click="deleteFollowerDialog = false" />
      <pv-button label="Yes" icon="pi pi-check" @click="deleteFollowerByFollowingUserId" />
    </template>
  </pv-dialog>


  <div class="flex flex-col">
    <div class="card">
      <div class="seguidores-titulo-profesional">Lista de Usuarios Seguidos</div>
      <pv-data-view :value="filteredFollowedUsers" :layout="layout">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex align-items-center" style="width: 50%;">
              <span class="p-input-icon-left w-full">
                <i class="pi pi-search" />
                <pv-input-text v-model="filterValue" placeholder="Buscar por nombre, usuario o email..." class="w-full" />
              </span>
            </div>
            <pv-select-button v-model="layout" :options="options"
                              :allowEmpty="false"
                              style="min-width: 120px;"
            >
              <template #option="{ option }">
                <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
              </template>
            </pv-select-button>
          </div>
        </template>
        <template #list="slotProps">
          <div class="flex flex-col">
            <div v-for="(item, index) in slotProps.items" :key="index">
              <div
                  class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
                  :class="{ 'border-t border-surface': index !== 0 }"
                  style="background: #18191a; border-radius: 1rem; box-shadow: 0 2px 12px rgba(0,0,0,0.18);"
              >
                <div class="md:w-40 relative flex-shrink-0">
                  <pv-tag
                      v-if="item && item.gender"
                      :value="item.gender === 'male' ? 'Male' : 'Female'"
                      :style="{
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: 2,
              background: item.gender === 'male' ? '#1976d2' : '#d32f2f',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: '0.5rem',
              padding: '0.25rem 0.75rem',
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
            }"
                  />
                  <img
                      class="block mx-auto rounded"
                      :src="`${item.image}`"
                      :alt="item.name"
                      style="width: 140px; height: 140px; object-fit: cover; border: 3px solid #1abc9c; background: #23272f;"
                  />
                </div>
                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                  <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                    <div>
                      <span class="font-medium text-surface-400 text-sm" style="color: #1abc9c;">Email:</span>
                      <span class="font-medium text-surface-100 text-sm" style="color: #fff;">{{ item.email }}</span>
                      <div class="text-lg font-semibold mt-2" style="color: #f5f5f5;">
                        <span style="color: #1abc9c;">Usuario:</span> {{ item.username }}
                      </div>
                      <div class="box-nombre mt-2" style="background: #23272f;">
                <span class="text-surface-900 font-bold text-base" style="color: #fff;">
                  {{ item.firstName }} {{item.lastName}}
                </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex-1 text-left md:text-center">
                    <span class="font-medium text-surface-400 text-sm" style="color: #1abc9c;">Sobre mí:</span>
                    <div
                        class="text-sm"
                        style="color: #e0e0e0; background: #23272f; border-radius: 0.5rem; padding: 0.75rem; margin-top: 0.5rem; max-height: 6.5rem; overflow-y: auto; font-size: 1rem;"
                    >
                      {{ item.aboutMe }}
                    </div>
                  </div>
                  <div class="flex flex-col md:items-end gap-8">
                    <div>
                      <span class="font-medium text-surface-400 text-sm" style="color: #1abc9c;">
                        Fecha de nacimiento <span style="font-size: 0.85em; color: #9ca3af;">(MM/DD/AA)</span>:
                      </span>
                      <span class="text-sm font-medium" style="color: #fff;">{{ item.birthDate }}</span>
                    </div>
                    <div class="flex flex-row-reverse md:flex-row gap-2">
                      <pv-button icon="pi pi-trash" outlined style="color: #e74c3c; border-color: #e74c3c;" @click="confirmDeleteFollowed(item)" />
                      <pv-button
                          icon="pi pi-id-card"
                          label="Ver Certificaciones"
                          class="flex-auto md:flex-initial whitespace-nowrap"
                          style="background: #1e5cb3; color: #fff; border: none; font-weight: 600;"
                          @click="openCertificateDialog(item.id)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #grid="slotProps">
          <div class="grid grid-cols-12 gap-4">
            <div
                v-for="(item, index) in slotProps.items"
                :key="index"
                class="col-span-12 sm:col-span-6 lg:col-span-4 p-2"
            >
              <div
                  class="p-6 rounded flex flex-col"
                  style="background: #18191a; border-radius: 1rem; box-shadow: 0 2px 12px rgba(0,0,0,0.18); border: 1.5px solid #23272f;"
              >
                <div class="flex justify-center rounded p-4" style="background: #23272f;">
                  <div class="relative mx-auto">
                    <pv-tag
                        v-if="item && item.gender"
                        :value="item.gender === 'male' ? 'Male' : 'Female'"
                        :style="{
                position: 'absolute',
                top: '10px',
                left: '10px',
                zIndex: 2,
                background: item.gender === 'male' ? '#1976d2' : '#d32f2f',
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: '0.5rem',
                padding: '0.25rem 0.75rem',
                fontSize: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
              }"
                    />
                    <img
                        class="rounded"
                        :src="`${item.image}`"
                        :alt="item.name"
                        style="width: 180px; height: 180px; object-fit: cover; border: 3px solid #1abc9c; background: #23272f;"
                    />
                  </div>
                </div>
                <div class="pt-6">
                  <div class="flex flex-row justify-between items-start gap-2">
                    <div>
                      <span class="font-medium text-surface-400 text-sm" style="color: #1abc9c;">Email:</span>
                      <span class="font-medium text-surface-100 text-sm" style="color: #fff;">{{ item.email }}</span>
                      <div class="text-lg font-semibold mt-2" style="color: #f5f5f5;">
                        <span style="color: #1abc9c;">Usuario:</span> {{ item.username }}
                      </div>
                      <div class="box-nombre mt-2" style="background: #23272f;">
                <span class="text-surface-900 font-bold text-base" style="color: #fff;">
                  {{ item.firstName }} {{item.lastName}}
                </span>
                      </div>
                    </div>
                  </div>
                  <div class="mt-4">
                    <span class="font-medium text-surface-400 text-sm" style="color: #1abc9c;">Sobre mí:</span>
                    <div
                        class="text-sm"
                        style="color: #e0e0e0; background: #23272f; border-radius: 0.5rem; padding: 0.75rem; margin-top: 0.5rem; max-height: 6.5rem; overflow-y: auto; font-size: 1rem;"
                    >
                      {{ item.aboutMe }}
                    </div>
                  </div>
                  <div class="flex flex-col gap-6 mt-6">
                    <div>
                      <span class="font-medium text-surface-400 text-sm" style="color: #1abc9c;">
                          Fecha de nacimiento
                        <span style="font-size: 0.85em; color: #9ca3af;">(MM/DD/AA)</span>:</span>
                      <span class="text-sm font-medium" style="color: #fff;">{{ item.birthDate }}</span>
                    </div>
                    <div class="flex gap-2">
                      <pv-button
                          icon="pi pi-id-card"
                          label="Ver Certificaciones"
                          class="flex-auto whitespace-nowrap"
                          style="background: #1e5cb3; color: #fff; border: none; font-weight: 600;"
                          @click="openCertificateDialog(item.id)"
                      />
                      <pv-button
                          icon="pi pi-trash"
                          outlined
                          style="color: #e74c3c; border-color: #e74c3c;"
                          @click="confirmDeleteFollowed(item)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

      </pv-data-view>
    </div>
  </div>





</template>

<style scoped>
.seguidores-titulo-profesional {
  font-size: 2.1rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 1.5px;
  text-shadow: 0 4px 16px rgba(0,0,0,0.25);
  border-left: 7px solid #1abc9c;
  padding-left: 1.3rem;
  background: linear-gradient(90deg, #23272f 0%, #111 100%);
  border-radius: 8px 0 0 8px;
  box-shadow: 0 2px 8px rgba(26,188,156,0.10);
  margin-bottom: 2rem;
  margin-top: 0.5rem;
  display: inline-block;
}

.box-nombre {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 30px;
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.04), 0px 1px 2px 0px rgba(0,0,0,0.06);
  background: #fff;
}

/* Estructura principal */
.flex {
  display: flex;
}
.flex-col {
  flex-direction: column;
}
.flex-row {
  flex-direction: row;
}
.items-center {
  align-items: center;
}
.justify-between {
  justify-content: space-between;
}
.md\:w-40 {
  width: 10rem;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.p-6 {
  padding: 1.5rem;
}
.gap-4 {
  gap: 1rem;
}
.gap-2 {
  gap: 0.5rem;
}
.gap-6 {
  gap: 1.5rem;
}
.gap-8 {
  gap: 2rem;
}
.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}
.font-semibold {
  font-weight: 600;
}
.font-medium {
  font-weight: 500;
}
.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
.rounded {
  border-radius: 0.5rem;
}
.block {
  display: block;
}
.bg-surface-100 {
  background: #f3f4f6;
}
.bg-surface-0 {
  background: #fff;
}
.border-t {
  border-top: 1px solid #e5e7eb;
}
.border-surface {
  border-color: #e5e7eb;
}
.text-surface-500 {
  color: #6b7280;
}
.text-surface-400 {
  color: #9ca3af;
}
.text-surface-900 {
  color: #111827;
}

/* Personalizados para los breakpoints */
@media (min-width: 640px) {
  .sm\:flex-row {
    flex-direction: row;
  }
  .sm\:items-center {
    align-items: center;
  }
}
@media (min-width: 768px) {
  .md\:w-40 {
    width: 10rem;
  }
  .md\:flex-row {
    flex-direction: row;
  }
  .md\:items-center {
    align-items: center;
  }
  .md\:items-end {
    align-items: flex-end;
  }
  .md\:flex-initial {
    flex: initial;
  }
}

/* Colores adicionales y detalles visuales */
.text-yellow-500 {
  color: #f59e42;
}
.text-surface-500 {
  color: #6b7280;
}
.whitespace-nowrap {
  white-space: nowrap;
}

/* Utilidad para el botón con flex container entre dispositivos */
.flex-auto {
  flex: 1 1 auto;
}

/* Grid y columnas */
.grid {
  display: grid;
}
.grid-cols-12 {
  grid-template-columns: repeat(12, minmax(0, 1fr));
}
.gap-4 {
  gap: 1rem;
}
.col-span-12 {
  grid-column: span 12 / span 12;
}
.sm\:col-span-6 {
  grid-column: span 6 / span 6;
}
.lg\:col-span-4 {
  grid-column: span 4 / span 4;
}
@media (min-width: 640px) {
  .sm\:col-span-6 {
    grid-column: span 6 / span 6;
  }
}
@media (min-width: 1024px) {
  .lg\:col-span-4 {
    grid-column: span 4 / span 4;
  }
}

/* Flex y alineación */
.flex {
  display: flex;
}
.flex-col {
  flex-direction: column;
}
.flex-row {
  flex-direction: row;
}
.items-start {
  align-items: flex-start;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.gap-2 {
  gap: 0.5rem;
}
.gap-6 {
  gap: 1.5rem;
}
.mt-6 {
  margin-top: 1.5rem;
}

/* Espaciados y bordes */
.p-2 {
  padding: 0.5rem;
}
.p-4 {
  padding: 1rem;
}
.p-6 {
  padding: 1.5rem;
}
.pt-6 {
  padding-top: 1.5rem;
}
.rounded {
  border-radius: 0.5rem;
}
.border {
  border-width: 1px;
  border-style: solid;
}
.border-surface-200 {
  border-color: #e5e7eb;
}
.bg-surface-0 {
  background: #fff;
}
.bg-surface-50 {
  background: #f9fafb;
}
.bg-surface-100 {
  background: #f3f4f6;
}

/* Dark mode */
.dark\:bg-surface-900 {
  background: #111827;
}
.dark\:border-surface-700 {
  border-color: #374151;
}
.dark\:text-surface-400 {
  color: #9ca3af;
}

/* Posicionamiento */
.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.w-full {
  width: 100%;
}

/* Tipografía y color */
.text-2xl {
  font-size: 1.5rem;
  font-weight: 600;
}
.text-lg {
  font-size: 1.125rem;
}
.text-sm {
  font-size: 0.875rem;
}
.font-semibold {
  font-weight: 600;
}
.font-medium {
  font-weight: 500;
}
.text-surface-500 {
  color: #6b7280;
}
.text-surface-900 {
  color: #111827;
}
.text-yellow-500 {
  color: #f59e42;
}
.whitespace-nowrap {
  white-space: nowrap;
}


.delete-dialog-content {
  display: flex;
  align-items: center;
  gap: 16px; /* equivalente a gap-4 de Tailwind (4*4px) */
}
.delete-dialog-icon {
  font-size: 2rem; /* equivalente a text-3xl de Tailwind */
}

/* Estilos adicionales para el campo de búsqueda */
.p-input-icon-left {
  position: relative;
  display: inline-block;
}

.p-input-icon-left i {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  margin-top: -0.5rem;
  color: #6b7280;
}

.p-input-icon-left input {
  padding-left: 2.5rem;
}

.ml-2 {
  margin-left: 0.5rem;
}

.w-full {
  width: 100%;
}

</style>