<template>
  <main class="fixed top-0 left-0 w-full h-[100dvh] bg-cover bg-center bg-gray-dark flex items-center justify-center">
    <Main />
    <ModalLogin v-if="!store.token || store.screen === 'login'" />
    <Modals />
  </main>
</template>
<script setup>
import { mainStore } from "./stores/store"
import { onMounted } from "vue"
import { startApp } from "./lib/methods"
import ModalLogin from "./components/Modals/ModalLogin.vue"
import Main from "./components/Screens/Main.vue"

import Modals from "./components/Modals.vue"
import "./index.css"
const store = mainStore()

// check if we're logged in and call startApp on mount
onMounted(() => {
  if (store.token) {
    startApp()
  }
})
</script>
