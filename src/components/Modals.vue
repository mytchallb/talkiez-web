<template>
  <template v-for="(modal, index) in store.modals" :key="index">
    <ModalProfile v-if="modal === 'profile'" />
    <ModalAddFriend v-if="modal === 'addFriend'" />
  </template>
</template>

<script setup>
import { mainStore } from "../stores/store"
import ModalProfile from "@/components/Modals/ModalProfile.vue"
import ModalAddFriend from "@/components/Modals/ModalAddFriend.vue"

const store = mainStore()
</script>
