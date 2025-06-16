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
      userFollowers: [],
      filterValue: '', // Nueva variable para filtrar seguidores

      userService: null,
      followerService: null,

      followedDialog: false,

      deleteFollowedDialog: false,
      deleteFollowedUser: null,

      certificationDialogVisible: false,
      selectedUserId: null,
      certificationDialogKey: 0, // Clave para reiniciar el componente
    }

  }
}
</script>

<template>

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