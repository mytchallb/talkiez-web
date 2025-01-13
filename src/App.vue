<template>
  <main class="w-full h-full bg-cover bg-center" :style="{ backgroundImage: `url(${bg})` }">
    <Login v-if="!store.token || store.screen === 'login'" />
    <Main v-else-if="store.screen === 'main'" />
    <Profile v-else-if="store.screen === 'profile'" />
  </main>
</template>
<script setup>
import { ref } from 'vue';
import { mainStore } from './stores/store';
import Login from './components/Screens/Login.vue';
import Main from './components/Screens/Main.vue';
import Profile from './components/Screens/Profile.vue';
import './index.css';
import bg from './assets/bg.jpg';
const store = mainStore();


// see if user is logged in
if (store.user) {
  console.log('user is logged in');
} else {
  console.log('user is not logged in');
}



</script>
