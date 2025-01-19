<template>
  <nav class="flex justify-between items-center relative w-full bg-gray-medium py-4 px-8">
    <div class="flex items-center gap-2">
      <img src="/logo.png" alt="Talkiez" class="w-10 h-10 object-contain" />
      <h1 class="text-4xl mb-0 font-bold text-primary">Talkiez</h1>
    </div>
    <div class="flex items-center gap-4 justify-center">
      <div>
        <button @click="goToProfile" class="p-2 rounded-full flex items-center gap-2 px-4 border border-primary text-primary">
          <svg class="w-4 h-4 fill-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
              d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"
            />
          </svg>
          <span class="">
            {{ trimWord(store.user?.name || "Guest", 10) }}
          </span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { mainStore } from "../stores/store"
import { auth } from "../lib/methods"
import { trimWord } from "../lib/utils"
const store = mainStore()

const goToProfile = () => {
  store.modals.push("profile")
}
</script>
