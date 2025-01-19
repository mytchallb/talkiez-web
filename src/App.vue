<template>
  <main class="fixed top-0 left-0 w-full h-[100dvh] bg-cover bg-center bg-gray-dark flex items-center justify-center">
    <Login v-if="!store.token || store.screen === 'login'" />
    <Main v-else-if="store.screen === 'main'" />
    <Modals />
  </main>
</template>
<script setup>
import { mainStore } from "./stores/store"
import Login from "./components/Screens/Login.vue"
import Main from "./components/Screens/Main.vue"

import Modals from "./components/Modals.vue"
import "./index.css"
const store = mainStore()
</script>
