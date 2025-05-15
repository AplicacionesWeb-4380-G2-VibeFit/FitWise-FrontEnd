
<script>
import {
  Avatar as PvAvatar,
  Button as PvButton,
  Card as PvCard,
  ConfirmDialog as PvConfirmDialog,
  DataView as PvDataView, Dialog as PvDialog, InputText as PvInputText,
  Tag as PvTag
} from "primevue";
import {Profile} from "@/presenting/model/profile.entity.js";
import {User} from "@/presenting/model/user.entity.js";
import {UserService} from "@/presenting/services/user.service.js";
import {ProfileService} from "@/presenting/services/profile.service.js";
import {FollowedUserService} from "@/presenting/services/followedUser.service.js";
import {FollowedUser} from "@/presenting/model/followedUser.entity.js";




export default {
  name: "profile-management",
  components: {PvInputText, PvAvatar, PvDialog, PvConfirmDialog, PvTag, PvDataView, PvButton, PvCard},
  data(){
    return {
      editVisible:false,
      email: null,

      userId: 1,


      profileService: null,
      userService: null,

      followedUserService:null,

      user: new User({}),
      profile: new Profile({}),
      tempProfile: {}, // Clon temporal del perfil



      userFollowed: new User({}),
      profileFollowed: new FollowedUser({}),


      users: [],
      profiles: [],

      followersList:[],

      followedUsers:[],
      followedProfiles:[],


    }
  },
  methods: {
    openEditDialog() {
      this.tempProfile = { ...this.profile }; // Clonar el perfil original
      this.editVisible = true;
    },

    handleCancel() {
      this.editVisible = false;
      this.$toast.add({
        severity: 'error',
        summary: 'Rejected',
        detail: 'You have rejected',
        life: 3000
      });
    },
    saveChanges() {
      this.profile = { ...this.tempProfile }; // Guardar los cambios
      this.editVisible = false;
      this.$toast.add({
        severity: 'success',
        summary: 'Saved',
        detail: 'Changes have been saved',
        life: 3000,
      });
    },

    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },

    findUserById(id) {
      return this.users.findIndex(user => user.id === id);
    },
    findProfileByUserId(userId){
      return this.profiles.findIndex(profile => profile.userId === userId);
    },

    //Apis

    updateProfile(profile) {
      this.profileService.update(this.profile.id,this.profile).then(response => {
        console.log('updateProfile');
        let index = this.findProfileByUserId(this.profile.id);
        this.profiles[index] = new Profile(response.data);
        console.log(this.profiles);
        this.notifySuccessfulAction("Profile Updated");


      }).catch(error => console.error(error));
    }


  },
  created(){
    this.userService=new UserService();
    this.profileService=new ProfileService();
    this.followedUserService=new FollowedUserService();

    // Aqui tenemos la informacion


    this.followedUserService.getByFollowerId(this.userId).then(response => {
      this.followersList = response.data.map(followersElement => new FollowedUser(followersElement));
      console.log(this.followersList);

      this.userService.getAll().then(response => {
        this.users = response.data.map(user => new User(user));
        this.user = this.users[this.findUserById(this.userId)];

        this.followedUsers = this.followersList
            .map(follower => this.users.find(user => user.id === follower.followedId))
            .filter(user => user !== undefined);

        console.log(this.followedUsers);
      }).catch(error => console.error(error));

      this.profileService.getAll().then(response => {

        this.profiles = response.data.map(profile => new Profile(profile));
        this.profile = this.profiles[this.findProfileByUserId(this.userId)];
        this.followedProfiles = this.profiles.filter(profile =>
            this.followedUsers.some(user => user.id === profile.userId)
        );
        console.log(this.followedProfiles);

      }).catch(error => console.error(error));


    }).catch(error => console.error(error));







  }
}
</script>

<template>
  <h1>PROFILE</h1>


  <div class="grid justify-center align-center" style="display: grid; place-items: center; width: 100%; height: 100vh;">
    <pv-card style="width: 25rem; overflow: hidden">
      <template #header>
        <div style="position: relative; display: inline-block;">
          <pv-tag
              v-if="profile.isPremium"
              style="position: absolute; top: 0.5rem; left: 0.5rem; background-color: yellow; color: black; padding: 0.5rem; font-size: 1rem; border-radius: 0.25rem; animation: glow 1.5s infinite; z-index: 1;">
            PREMIUM
          </pv-tag>
          <img alt="user header" :src="profile.image" class="w-12 h-12 object-cover rounded mx-auto" />
        </div>
      </template>
      <template #title>{{ $t('profile.username') }}: {{user.userName}}</template>
      <template #subtitle>{{ $t('profile.email') }}: {{user.email}}</template>
      <template #content>
        <p class="m-0">{{ $t('profile.name') }}: {{profile.name}} {{profile.lastname}}</p>
        <p class="m-0">{{ $t('profile.gender') }}: {{profile.gender}}</p>
        <!--
        <p class="m-0">{{profile.membershipExpiry}}</p>
        -->
      </template>
      <template #footer>
        <div class="flex gap-4 mt-1">
          <pv-button :label="$t('profile.edit')" @click="openEditDialog" severity="secondary" outlined class="w-full" />
          <pv-button :label="$t('profile.subscription')" class="w-full" />
        </div>
      </template>
    </pv-card>
  </div>

  <pv-dialog v-model:visible="editVisible" modal :style="{ width: '30rem' }" class="card flex justify-center">
    <template #header>
      <div class="flex items-center gap-5">
        <pv-avatar :image="profile.image" shape="circle" class="w-60 h-60" />
        <span class="font-bold text-xl" style="margin-left: -10px;">{{ $t('profile.username') }}: {{ user.userName }}</span>
      </div>
    </template>

    <div>
      <span class="text-surface-500 dark:text-surface-400 block mb-4">{{ $t('profile.description') }}</span>

      <div class="flex items-center gap-4 mb-4">
        <label for="name" class="font-semibold w-24 text-center">{{ $t('profile.name') }}</label>
        <pv-input-text id="name" class="flex-auto" autocomplete="off" v-model="tempProfile.name" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="lastname" class="font-semibold w-24 text-center">{{ $t('profile.lastname') }}</label>
        <pv-input-text id="lastname" class="flex-auto" autocomplete="off" v-model="tempProfile.lastname" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="gender" class="font-semibold w-24 text-center">{{ $t('profile.gender') }}</label>
        <pv-input-text id="gender" class="flex-auto" autocomplete="off" v-model="tempProfile.gender" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="image" class="font-semibold w-24 text-center">URL Image</label>
        <pv-input-text id="image" class="flex-auto" autocomplete="off" v-model="tempProfile.image" />
      </div>
    </div>

    <template #footer>
      <pv-button
          label="Cancel"
          text
          severity="secondary"
          @click="handleCancel"
          autofocus
      />
      <pv-button
          label="Save"
          outlined
          severity="secondary"
          @click="saveChanges"
          autofocus
      />
    </template>
  </pv-dialog>


  <h1>{{ $t('followers.followersList') }}</h1>

  <!--
  <pv-confirm-dialog group="headless">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
        <div class="rounded-full bg-primary text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
          <i class="pi pi-question !text-4xl"></i>
        </div>
        <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
        <p class="mb-0">{{ message.message }}</p>
        <div class="flex items-center gap-2 mt-6">
          <pv-button label="Save" @click="acceptCallback" class="w-32"></pv-button>
          <pv-button label="Cancel" outlined @click="rejectCallback" class="w-32"></pv-button>
        </div>
      </div>
    </template>
  </pv-confirm-dialog>
  -->

  <div class="card" style="display: flex; justify-content: center; width: 100%;">
    <div class="flex flex-wrap items-center gap-4">
      <pv-icon-field class="flex items-center">
        <pv-input-icon class="pi pi-user" />
        <pv-input-text v-model="email" placeholder="Email" />
      </pv-icon-field>
      <pv-button @click="followUser(email)" :label="$t('followers.follow')" />    </div>
  </div>
  <pv-toast/>

  <br/>
  <br/>
  <br/>

  <div class="grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr)); gap: 1rem; justify-content: center;">
    <div v-for="(followedProfile, index) in followedProfiles" :key="index" style="display: flex; justify-content: center;">
      <pv-card style="width: 25rem; overflow: hidden">
        <template #header>
          <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 300px; position: relative;">
            <pv-tag
                v-if="followedProfile.isPremium"
                style="position: absolute; top: 0.5rem; left: 0.5rem; background-color: yellow; color: black; padding: 0.5rem; font-size: 1rem; border-radius: 0.25rem; animation: glow 1.5s infinite;">
              PREMIUM
            </pv-tag>
            <img
                alt="user header"
                :src="followedProfile.image"
                class="object-cover rounded"
                style="width: 300px; height: 300px; object-fit: cover;"
            />
          </div>
        </template>

        <template #title>{{users[findUserById(followedProfile.userId)]?.userName || 'Usuario no encontrado'}}</template>
        <template #subtitle>{{users[findUserById(followedProfile.userId)]?.email || 'Email no disponible'}}</template>

        <template #content>
          <p class="m-0">{{followedProfile.name}} {{followedProfile.lastname}}</p>
          <p class="m-0">{{followedProfile.gender}}</p>
          <p class="m-0">{{followedProfile.isPremium}}</p>
          <p class="m-0">{{followedProfile.membershipExpiry}}</p>
        </template>
        <template #footer>
          <div class="flex gap-4 mt-1">
            <pv-button :label="$t('followers.delete')" @click="deleteFollower(followedProfile.userId)" class="w-full" />          </div>
        </template>
      </pv-card>
    </div>
  </div>









</template>

<style scoped>


</style>